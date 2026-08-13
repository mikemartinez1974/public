const RUNTIME_KIND = 'windowed-collection-member';
const STATE_KEY = '__twiliteCollectionWindow';
const clean = (value) => String(value || '').trim();
const cleanPath = (value) => clean(value).replace(/^\/+|\/+$/g, '');
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const parseGithubRef = (ref) => {
  const raw = clean(ref).split('#')[0];
  if (!raw.toLowerCase().startsWith('github://')) return null;
  const [owner = '', repo = '', ...parts] = raw.slice('github://'.length).split('/');
  const filePath = cleanPath(parts.join('/'));
  if (!owner || !repo || !filePath) return null;
  const directory = filePath.includes('/') ? filePath.slice(0, filePath.lastIndexOf('/')) : '';
  return { owner, repo, directory };
};

const safeId = (value) => clean(value).toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 88) || 'member';

const listRepositoryDirectory = async (request) => {
  if (typeof api.listRepositoryDirectory === 'function') {
    return api.listRepositoryDirectory(request);
  }
  const error = new Error('Repository directory listing is not available in this Twilite runtime.');
  error.code = 'DIRECTORY_LIST_UNAVAILABLE';
  throw error;
};

const compatibilityMembers = (nodes, parsed, contract) => {
  const prefix = `github://${parsed.owner}/${parsed.repo}/${parsed.directory ? `${parsed.directory}/` : ''}`.toLowerCase();
  const declared = Array.isArray(contract?.compatibilityMembers) ? contract.compatibilityMembers.map(clean) : [];
  const portals = nodes
    .filter((node) => clean(node?.type).toLowerCase() === 'portal')
    .map((node) => clean(node?.data?.target?.ref || node?.data?.sourceRef || node?.data?.ref || node?.data?.src));
  return [...new Set([...declared, ...portals]
    .filter((ref) => ref.toLowerCase().startsWith(prefix))
    .filter((ref) => !ref.toLowerCase().endsWith('/root.node'))
  )].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};

const findMemberProjection = (graph, payload = 'node.web.icon') => {
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const declaration = nodes.find((node) => ['declaration', 'manifest'].includes(clean(node?.type).toLowerCase()));
  const semanticSurfaceId = clean(payload).toLowerCase().includes('icon')
    ? 'icon'
    : clean(payload).toLowerCase().includes('summary')
      ? 'summary'
      : clean(payload).toLowerCase().includes('detail')
        ? 'detail'
        : 'root';
  const surfaces = Array.isArray(declaration?.data?.declaration?.surfaces)
    ? declaration.data.declaration.surfaces
    : [];
  const surface = surfaces.find((entry) => {
    const id = clean(entry?.id).toLowerCase();
    const label = clean(entry?.label).toLowerCase();
    return id === semanticSurfaceId
      || id === `${semanticSurfaceId}-surface`
      || id.endsWith(`-${semanticSurfaceId}-surface`)
      || label === semanticSurfaceId;
  })
    || surfaces.find((entry) => clean(entry?.id).toLowerCase() === 'root');
  const portId = clean(surface?.portNodeId || surface?.viewNodeId);
  const port = nodes.find((node) => node?.id === portId)
    || nodes.find((node) => clean(node?.type).toLowerCase() === 'port' && clean(node?.data?.surfaceId || node?.id) === 'root')
    || nodes.find((node) => clean(node?.type).toLowerCase() === 'port');
  const infrastructureTypes = new Set([
    'bridge', 'declaration', 'manifest', 'markdown', 'port', 'portal', 'script', 'title'
  ]);
  const isSemanticInstance = (node) => {
    const type = clean(node?.type).toLowerCase();
    return Boolean(node && !infrastructureTypes.has(type) && node?.data?._classBinding);
  };
  const connected = (Array.isArray(graph?.edges) ? graph.edges : [])
    .filter((edge) => edge?.source === port?.id || edge?.target === port?.id)
    .map((edge) => nodes.find((node) => node?.id === (edge.source === port?.id ? edge.target : edge.source)))
    .find(isSemanticInstance);
  const rooted = nodes.find((node) => node?.root === true && isSemanticInstance(node));
  const semanticNode = connected || rooted || nodes.find(isSemanticInstance) || null;
  return {
    id: clean(port?.id),
    label: clean(declaration?.data?.identity?.name || port?.label),
    payload: clean(
      port?.data?.view?.payload ||
      port?.data?.payload ||
      payload
    ),
    node: semanticNode
  };
};

const listMembers = async (parsed, membership) => {
  const entries = await listRepositoryDirectory({
    repo: `${parsed.owner}/${parsed.repo}`,
    path: parsed.directory,
    branch: 'main',
    allowPublic: true
  });
  const refs = [];
  if (membership?.includeDirectNodeFiles !== false) {
    entries.filter((entry) => clean(entry?.type).toLowerCase() === 'file')
      .filter((entry) => clean(entry?.name).toLowerCase().endsWith('.node'))
      .filter((entry) => clean(entry?.name).toLowerCase() !== 'root.node')
      .forEach((entry) => refs.push(`github://${parsed.owner}/${parsed.repo}/${cleanPath(entry.path)}`));
  }
  if (membership?.includeDirectChildRoots !== false) {
    const directories = entries.filter((entry) => clean(entry?.type).toLowerCase() === 'dir');
    const childRoots = await Promise.all(directories.map(async (directory) => {
      try {
        const children = await listRepositoryDirectory({
          repo: `${parsed.owner}/${parsed.repo}`,
          path: cleanPath(directory.path),
          branch: 'main',
          allowPublic: true
        });
        const root = children.find((entry) => clean(entry?.type).toLowerCase() === 'file' && clean(entry?.name).toLowerCase() === 'root.node');
        return root ? `github://${parsed.owner}/${parsed.repo}/${cleanPath(root.path)}` : '';
      } catch (_) {
        return '';
      }
    }));
    refs.push(...childRoots.filter(Boolean));
  }
  return [...new Set(refs)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};

const renderWindow = async (direction = 'run') => {
  const nodes = await api.getNodes();
  const existing = nodes.filter((node) => clean(node?.data?._runtime?.kind) === RUNTIME_KIND);
  const declaration = nodes.find((node) => (
    ['declaration', 'manifest'].includes(clean(node?.type).toLowerCase())
    && clean(node?.data?.intent?.kind).toLowerCase() === 'collection'
  ));
  const contract = declaration?.data?.collection || {};
  const surface = nodes.find((node) => clean(node?.data?.capabilityRole) === 'collection-surface');
  const surfaceView = surface?.data?.collectionView && typeof surface.data.collectionView === 'object'
    ? surface.data.collectionView
    : {};
  // The reusable surface supplies layout defaults; the host collection owns the
  // editorial policy for its members and may deliberately override them.
  const view = { ...surfaceView, ...(contract.view || {}) };
  const memberPayload = (() => {
    const configured = clean(view.payload);
    // node.web was the legacy reader/card request. Collection windows now use
    // the compact icon surface unless their declaration names another surface.
    return !configured || configured === 'node.web' ? 'node.web.icon' : configured;
  })();
  const graphRef = clean(contract.collectionRef || declaration?.data?.document?.url);
  const parsed = parseGithubRef(graphRef);
  if (!parsed) throw new Error('Collection declaration needs data.collection.collectionRef as a github:// graph address.');

  let members;
  try {
    members = await listMembers(parsed, contract.membership || {});
  } catch (error) {
    if (error?.code !== 'DIRECTORY_LIST_UNAVAILABLE') throw error;
    members = compatibilityMembers(nodes, parsed, contract);
    if (!members.length) {
      throw new Error('This runtime cannot discover the collection directory yet, and the graph has no authored member portals to use as a compatibility index.');
    }
  }
  const runtimeStart = Number(existing[0]?.data?._runtime?.windowStart);
  const configuredWindowSize = Math.max(1, Math.min(50, Number(view.windowSize) || 10));
  const prior = globalThis[STATE_KEY] || {
    start: Number.isFinite(runtimeStart) ? runtimeStart : 0,
    pageSize: configuredWindowSize
  };
  const windowSize = Math.max(1, Math.min(50, Number(prior.pageSize) || configuredWindowSize));
  let start = Number(prior.start) || 0;
  const maxStart = members.length ? Math.floor((members.length - 1) / windowSize) * windowSize : 0;
  if (direction === 'next') start += windowSize;
  if (direction === 'previous') start -= windowSize;
  if (direction === 'run' && existing.length) {
    start = start >= maxStart ? 0 : start + windowSize;
  }
  start = Math.max(0, Math.min(maxStart, start));
  globalThis[STATE_KEY] = { start, count: members.length, pageSize: windowSize };

  const visibleRefs = members.slice(start, start + windowSize);
  const resolved = await Promise.all(visibleRefs.map(async (ref) => {
    try {
      const graph = await api.readGraph(ref, { fresh: true });
      return { ref, ...findMemberProjection(graph, memberPayload) };
    } catch (_) {
      return { ref, id: '', label: clean(ref.split('/').pop()).replace(/\.node$/i, '') };
    }
  }));

  const wantedIds = new Set(resolved.map((member) => `runtime-collection-${safeId(member.ref)}`));
  const resolvedByRuntimeId = new Map(
    resolved.map((member) => [`runtime-collection-${safeId(member.ref)}`, member])
  );
  const seenRuntimeIds = new Set();
  const duplicateIds = new Set();
  existing.forEach((node) => {
    if (seenRuntimeIds.has(node.id)) duplicateIds.add(node.id);
    seenRuntimeIds.add(node.id);
  });
  const deleteIds = [...new Set(existing
    .filter((node) => {
      const member = resolvedByRuntimeId.get(node.id);
      const semanticTypeChanged = Boolean(
        member?.node && clean(node?.type).toLowerCase() !== clean(member.node.type).toLowerCase()
      );
      const projectedBaseLevel = clean(node?.data?.presentation?.baseLevel).toLowerCase();
      const authoredBaseLevel = clean(member?.node?.data?.presentation?.baseLevel).toLowerCase();
      const semanticBaselineChanged = projectedBaseLevel !== authoredBaseLevel;
      return !wantedIds.has(node.id)
        || duplicateIds.has(node.id)
        || semanticTypeChanged
        || semanticBaselineChanged;
    })
    .map((node) => node.id))];
  if (deleteIds.length && typeof api.deleteNodes === 'function') {
    await api.deleteNodes(deleteIds);
    await pause(80);
  } else {
    for (const id of deleteIds) {
      await api.deleteNode(id);
      await pause(180);
    }
  }

  const usesIconMembers = memberPayload === 'node.web.icon' || memberPayload === 'icon.web';
  const columns = Math.max(1, Math.min(windowSize, Number(view.columns) || 3));
  const cardWidth = Math.max(160, Number(
    usesIconMembers ? (view.iconCardWidth || Math.min(Number(view.cardWidth) || 220, 240)) : view.cardWidth
  ) || 500);
  const cardHeight = Math.max(160, Number(
    usesIconMembers ? (view.iconCardHeight || Math.min(Number(view.cardHeight) || 220, 240)) : view.cardHeight
  ) || 320);
  const gapX = Math.max(20, Number(view.gapX) || 80);
  const gapY = Math.max(20, Number(view.gapY) || 70);
  const surfaceX = Number(surface?.position?.x);
  const surfaceY = Number(surface?.position?.y);
  const surfaceWidth = Number(surface?.width);
  const surfacePaddingX = Math.max(24, Number(view.surfacePaddingX) || 56);
  const surfaceHeaderHeight = Math.max(80, Number(view.surfaceHeaderHeight) || 190);
  const contentWidth = columns * cardWidth + Math.max(0, columns - 1) * gapX;
  const centeredOffset = Number.isFinite(surfaceWidth)
    ? Math.max(surfacePaddingX, (surfaceWidth - contentWidth) / 2)
    : surfacePaddingX;
  const originX = Number.isFinite(surfaceX)
    ? surfaceX + centeredOffset
    : (Number.isFinite(Number(view?.origin?.x)) ? Number(view.origin.x) : -720);
  const originY = Number.isFinite(surfaceY)
    ? surfaceY + surfaceHeaderHeight
    : (Number.isFinite(Number(view?.origin?.y)) ? Number(view.origin.y) : 330);

  const collectionName = clean(declaration?.data?.identity?.name || declaration?.label || 'Collection');
  const collectionPurpose = clean(
    declaration?.data?.identity?.description || declaration?.data?.document?.description || contract?.description
  );
  if (surface?.id && typeof api.updateNode === 'function') {
    const nextTitle = collectionName || clean(surface?.data?.title) || 'Collection';
    const nextPurpose = collectionPurpose || clean(surface?.data?.purpose) || 'A windowed collection.';
    if (surface?.data?.title !== nextTitle || surface?.data?.purpose !== nextPurpose) {
      await api.updateNode(surface.id, {
        data: { ...(surface.data || {}), title: nextTitle, purpose: nextPurpose }
      });
    }
  }
  const existingById = new Map(
    existing
      .filter((node) => !duplicateIds.has(node.id) && !deleteIds.includes(node.id))
      .map((node) => [node.id, node])
  );
  const existingIds = new Set(existingById.keys());
  const createNodes = [];
  const updateNodes = [];

  for (let index = 0; index < resolved.length; index += 1) {
    const member = resolved[index];
    const id = `runtime-collection-${safeId(member.ref)}`;
    const label = member.label || clean(member.ref.split('/').pop()).replace(/\.node$/i, '') || 'Collection member';
    const priorMember = existingById.get(id) || null;
    const semanticNode = member.node || null;
    const projected = semanticNode ? {
      ...semanticNode,
      id,
      root: false,
      label,
      position: priorMember?.positionLocked === true
        ? priorMember.position
        : {
            x: originX + (index % columns) * (cardWidth + gapX),
            y: originY + Math.floor(index / columns) * (cardHeight + gapY)
          },
      width: cardWidth,
      height: cardHeight,
      ...(priorMember?.positionLocked === true ? { positionLocked: true } : {}),
      data: {
        ...(semanticNode.data || {}),
        _origin: {
          ...(semanticNode.data?._origin || {}),
          canonicalId: semanticNode.id,
          ref: member.ref,
          instanceId: id
        },
        _runtime: { kind: RUNTIME_KIND, sourceRef: member.ref, sourceNodeId: semanticNode.id, windowStart: start }
      }
    } : {
      id,
      type: 'portal',
      label,
      position: priorMember?.positionLocked === true
        ? priorMember.position
        : {
            x: originX + (index % columns) * (cardWidth + gapX),
            y: originY + Math.floor(index / columns) * (cardHeight + gapY)
          },
      width: cardWidth,
      height: cardHeight,
      ...(priorMember?.positionLocked === true ? { positionLocked: true } : {}),
      data: {
        authority: 'navigate',
        intent: 'external',
        src: member.ref,
        ref: member.ref,
        endpoint: member.ref,
        sourceRef: member.ref,
        sourceNodeId: member.id,
        sourcePayload: member.payload || memberPayload,
        surfaceId: 'root',
        target: { ref: member.ref, mode: 'navigate', portId: 'root', surfaceId: 'root', label: `Open ${label}` },
        visibilityRole: 'browser',
        _runtime: { kind: RUNTIME_KIND, sourceRef: member.ref, windowStart: start }
      }
    };
    if (existingIds.has(id)) updateNodes.push(projected);
    else createNodes.push(projected);
  }
  // Existing members already carry the same authored projection. Avoid rewriting
  // every card on Refresh; window changes replace the member set in bulk below.
  if (createNodes.length && typeof api.createNodes === 'function') {
    await api.createNodes(createNodes);
  } else {
    for (const memberNode of createNodes) {
      await api.createNode(memberNode);
      await pause(180);
    }
  }
  if (updateNodes.length) {
    // Each member has distinct geometry and source data, so this is not the
    // homogeneous updateNodes(ids, patch) operation. Queue the independent
    // updates together and let the host apply them as one render batch.
    await Promise.all(updateNodes.map((memberNode) => api.updateNode(memberNode.id, memberNode)));
  }
  const result = {
    start,
    end: Math.min(members.length, start + windowSize),
    count: members.length,
    pageSize: windowSize,
    payload: memberPayload,
    surfaceId: clean(surface?.id)
  };
  try {
    api.events.emit('collection:window-state', result);
  } catch (_) {}
  return result;
};

const applyPageSize = (payload) => {
  const requested = Number(payload?.pageSize ?? payload?.value ?? payload);
  if (!Number.isFinite(requested)) return renderWindow('refresh');
  const prior = globalThis[STATE_KEY] || {};
  globalThis[STATE_KEY] = {
    ...prior,
    start: 0,
    pageSize: Math.max(1, Math.min(50, Math.round(requested)))
  };
  return renderWindow('refresh');
};

if (globalThis.__twiliteCollectionUnsubscribe) {
  globalThis.__twiliteCollectionUnsubscribe.forEach((unsubscribe) => unsubscribe());
}
globalThis.__twiliteCollectionUnsubscribe = [
  api.events.on('collection:previous', () => renderWindow('previous')),
  api.events.on('collection:next', () => renderWindow('next')),
  api.events.on('collection:refresh', () => renderWindow('refresh')),
  api.events.on('collection:page-size', (payload) => applyPageSize(payload))
];

const invocationEvent = clean(api?.invocation?.event).toLowerCase();
if (invocationEvent === 'collection:previous') return renderWindow('previous');
if (invocationEvent === 'collection:next') return renderWindow('next');
if (invocationEvent === 'collection:refresh') return renderWindow('refresh');
if (invocationEvent === 'collection:page-size') return applyPageSize(api?.invocation?.payload);
return renderWindow('run');
