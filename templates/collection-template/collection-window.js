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

const findRootPort = (graph) => {
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const declaration = nodes.find((node) => ['declaration', 'manifest'].includes(clean(node?.type).toLowerCase()));
  const surface = declaration?.data?.declaration?.surfaces?.find((entry) => clean(entry?.id) === 'root');
  const portId = clean(surface?.portNodeId || surface?.viewNodeId);
  const port = nodes.find((node) => node?.id === portId)
    || nodes.find((node) => clean(node?.type).toLowerCase() === 'port' && clean(node?.data?.surfaceId || node?.id) === 'root')
    || nodes.find((node) => clean(node?.type).toLowerCase() === 'port');
  return {
    id: clean(port?.id),
    label: clean(declaration?.data?.identity?.name || port?.label)
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

const renderWindow = async (direction = 'refresh') => {
  const nodes = await api.getNodes();
  const declaration = nodes.find((node) => (
    ['declaration', 'manifest'].includes(clean(node?.type).toLowerCase())
    && clean(node?.data?.intent?.kind).toLowerCase() === 'collection'
  ));
  const contract = declaration?.data?.collection || {};
  const view = contract.view || {};
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
  const windowSize = Math.max(1, Math.min(50, Number(view.windowSize) || 10));
  const prior = globalThis[STATE_KEY] || { start: 0 };
  let start = Number(prior.start) || 0;
  if (direction === 'next') start += windowSize;
  if (direction === 'previous') start -= windowSize;
  const maxStart = members.length ? Math.floor((members.length - 1) / windowSize) * windowSize : 0;
  start = Math.max(0, Math.min(maxStart, start));
  globalThis[STATE_KEY] = { start, count: members.length };

  const visibleRefs = members.slice(start, start + windowSize);
  const resolved = await Promise.all(visibleRefs.map(async (ref) => {
    try {
      const graph = await api.readGraph(ref, { fresh: true });
      return { ref, ...findRootPort(graph) };
    } catch (_) {
      return { ref, id: '', label: clean(ref.split('/').pop()).replace(/\.node$/i, '') };
    }
  }));

  const existing = nodes.filter((node) => clean(node?.data?._runtime?.kind) === RUNTIME_KIND);
  const wantedIds = new Set(resolved.map((member) => `runtime-collection-${safeId(member.ref)}`));
  const deleteIds = existing.filter((node) => !wantedIds.has(node.id)).map((node) => node.id);
  if (deleteIds.length && typeof api.deleteNodes === 'function') {
    await api.deleteNodes(deleteIds);
    await pause(80);
  } else {
    for (const id of deleteIds) {
      await api.deleteNode(id);
      await pause(180);
    }
  }

  const columns = Math.max(1, Math.min(windowSize, Number(view.columns) || 2));
  const cardWidth = Math.max(220, Number(view.cardWidth) || 500);
  const cardHeight = Math.max(140, Number(view.cardHeight) || 320);
  const gapX = Math.max(20, Number(view.gapX) || 80);
  const gapY = Math.max(20, Number(view.gapY) || 70);
  const originX = Number.isFinite(Number(view?.origin?.x)) ? Number(view.origin.x) : -720;
  const originY = Number.isFinite(Number(view?.origin?.y)) ? Number(view.origin.y) : 330;
  const existingIds = new Set(existing.map((node) => node.id));
  const createNodes = [];
  const updateNodes = [];

  for (let index = 0; index < resolved.length; index += 1) {
    const member = resolved[index];
    const id = `runtime-collection-${safeId(member.ref)}`;
    const label = member.label || clean(member.ref.split('/').pop()).replace(/\.node$/i, '') || 'Collection member';
    const portal = {
      id,
      type: 'portal',
      label,
      position: {
        x: originX + (index % columns) * (cardWidth + gapX),
        y: originY + Math.floor(index / columns) * (cardHeight + gapY)
      },
      width: cardWidth,
      height: cardHeight,
      data: {
        authority: 'navigate',
        intent: 'external',
        src: member.ref,
        ref: member.ref,
        endpoint: member.ref,
        sourceRef: member.ref,
        sourceNodeId: member.id,
        sourcePayload: clean(view.payload) || 'node.web',
        surfaceId: 'root',
        target: { ref: member.ref, mode: 'navigate', portId: 'root', surfaceId: 'root', label: `Open ${label}` },
        visibilityRole: 'browser',
        _runtime: { kind: RUNTIME_KIND, sourceRef: member.ref, windowStart: start }
      }
    };
    if (existingIds.has(id)) updateNodes.push(portal);
    else createNodes.push(portal);
  }
  for (const portal of updateNodes) {
    await api.updateNode(portal.id, portal);
    await pause(180);
  }
  if (createNodes.length && typeof api.createNodes === 'function') {
    await api.createNodes(createNodes);
  } else {
    for (const portal of createNodes) {
      await api.createNode(portal);
      await pause(180);
    }
  }
  return { start, end: Math.min(members.length, start + windowSize), count: members.length };
};

if (globalThis.__twiliteCollectionUnsubscribe) {
  globalThis.__twiliteCollectionUnsubscribe.forEach((unsubscribe) => unsubscribe());
}
globalThis.__twiliteCollectionUnsubscribe = [
  api.events.on('collection:previous', () => renderWindow('previous')),
  api.events.on('collection:next', () => renderWindow('next')),
  api.events.on('collection:refresh', () => renderWindow('refresh'))
];

return renderWindow('refresh');
