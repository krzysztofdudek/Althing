// Reading another region from a Yggdrasil check: through ctx.fs, which allows
// only the node's own files and those of the nodes it declares relations to.
// Returns the text, false when the file does not exist, null when this node
// may not read it (an undeclared region).
export function tryRead(ctx, path) {
  try {
    if (ctx.fs.exists(path) !== 'file') return false;
    return ctx.fs.read(path);
  } catch {
    return null;
  }
}

export function ownFile(ctx, path) {
  return ctx.files.find((f) => f.path === path);
}

export function registryOf(ctx) {
  const own = ownFile(ctx, 'family/registry.json');
  const text = own ? own.content : tryRead(ctx, 'family/registry.json');
  if (typeof text !== 'string') return null;
  try { return JSON.parse(text); } catch { return null; }
}
