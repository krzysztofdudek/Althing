// The link detector (rail links/resolve). Every relative Markdown link
// resolves to a file or directory that exists. A link may reach into another
// region only through a relation its node declares (a `uses` relation in
// the node's yg-node.yaml): that is what lets the rule read the target, and it
// is how a new kind of cross-region link is admitted. Another repository is
// linked by its GitHub URL, never by a relative path. Anchors are not checked.

import { linesOf, isMarkdown, stripInlineCode } from './markdown.mjs';
import { linkTargets, resolveLink } from './paths.mjs';

// A mapping entry as Yggdrasil reads it: a glob when it holds '*', otherwise a
// file or a directory (with or without a trailing slash).
export function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if ('\\^$+?.()|{}[]'.includes(c)) re += `\\${c}`;
    else re += c;
  }
  return new RegExp(`^${re}$`);
}

export function entryCovers(entry, path) {
  if (entry.includes('*')) return globToRegExp(entry).test(path);
  const e = entry.replace(/\/+$/, '');
  return path === e || path.startsWith(`${e}/`);
}

// Is `dir` an ancestor directory of something an entry maps?
export function entryUnder(entry, dir) {
  const e = entry.replace(/\/+$/, '');
  return e.startsWith(`${dir}/`);
}

// scanLinks(file, { regions: [mappingEntries...], exists(path) -> 'file'|'dir'|false })
// regions[0] is the file's own node; the rest are the nodes it declares relations to.
export function scanLinks(file, { regions, exists }) {
  const out = [];
  if (!isMarkdown(file.path)) return out;
  for (const l of linesOf(file.content, { markdown: true })) {
    if (l.code) continue;
    for (const { target } of linkTargets(stripInlineCode(l.text))) {
      if (!target || target.startsWith('/')) {
        if (target) out.push({ line: l.n, target, reason: 'an absolute link; write it relative to this file' });
        continue;
      }
      const resolved = resolveLink(file.path, target);
      if (resolved === null) continue; // climbing out of the repository is boundary/no-private-paths' finding
      if (resolved === '') continue; // the repository root itself
      const all = regions.flat();
      if (all.some((e) => entryCovers(e, resolved))) {
        if (exists(resolved) === false) out.push({ line: l.n, target, reason: 'the target does not exist' });
      } else if (all.some((e) => entryUnder(e, resolved))) {
        // a directory that holds mapped files: it exists
      } else {
        out.push({ line: l.n, target, reason: 'the target is in a region this node does not declare; add a uses relation to its node, or link it another way' });
      }
    }
  }
  return out;
}

export function describeLink(f) {
  return `broken link "${f.target}": ${f.reason}.`;
}
