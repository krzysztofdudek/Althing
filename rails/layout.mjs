// Region shapes that need no git history: the root (layout/root), kebab-case
// names (naming/kebab), and the family, research and release regions
// (layout/family, layout/research, layout/release).

export const ROOT_FILES = ['README.md', 'VISION.md', 'AGENTS.md', 'CLAUDE.md', 'LICENSE', 'CODEOWNERS', 'package.json', '.gitignore', '.gitattributes'];

// layout/root: the root node maps only the allowed files, and package.json is
// private, an ES module, on Node 22 or later, with no dependencies at all.
export function checkRoot(files) {
  const out = [];
  for (const f of files) {
    if (f.path.includes('/') || !ROOT_FILES.includes(f.path)) {
      out.push({ file: f.path, line: 1, message: `"${f.path}" does not belong at the root, which holds only ${ROOT_FILES.join(', ')}. Place it in its region (README.md says which), or file an issue asking where it belongs.` });
    }
    if (f.path === 'package.json') {
      let pkg;
      try { pkg = JSON.parse(f.content); } catch (e) { out.push({ file: f.path, line: 1, message: `package.json does not parse: ${e.message}` }); continue; }
      if (pkg.private !== true) out.push({ file: f.path, line: 1, message: 'package.json must say "private": true: Althing is never published.' });
      if (pkg.type !== 'module') out.push({ file: f.path, line: 1, message: 'package.json must say "type": "module".' });
      if (!pkg.engines || typeof pkg.engines.node !== 'string') out.push({ file: f.path, line: 1, message: 'package.json must name the Node versions it runs on (engines.node).' });
      for (const k of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies', 'bundleDependencies', 'bundledDependencies']) {
        if (pkg[k] && Object.keys(pkg[k]).length) out.push({ file: f.path, line: 1, message: `package.json has ${k}: Althing's code has zero dependencies, so a clone runs with Node alone.` });
      }
    }
  }
  return out;
}

const CONVENTIONAL = new Set(['README.md', 'INDEX.md', 'AGENTS.md', 'CLAUDE.md', 'SKILL.md', 'LICENSE', 'CODEOWNERS', 'CHANGELOG.md', 'VISION.md', 'FROZEN.sha256']);
const KEBAB = /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/;

// naming/kebab: every segment below the region's own directory.
export function checkKebab(path) {
  const segs = path.split('/').slice(1);
  for (const s of segs) {
    if (CONVENTIONAL.has(s) || KEBAB.test(s)) continue;
    return `"${s}" in ${path} is not kebab-case (lower-case words joined by hyphens; README.md, INDEX.md and the other conventional upper-case names are allowed). Rename it with git mv and update its links.`;
  }
  return null;
}

export const FAMILY_FILES = ['canon.md', 'registry.json', 'map.md', 'contracts.md', 'inventory.md', 'parked.md', 'history.md'];

// layout/family: the family files by name, and a registry that parses.
export function checkFamily(files) {
  const out = [];
  for (const f of files) {
    const name = f.path.replace(/^family\//, '');
    if (!FAMILY_FILES.includes(name)) out.push({ file: f.path, line: 1, message: `family/ holds only ${FAMILY_FILES.join(', ')}; "${name}" belongs elsewhere (the placement table in AGENTS.md says where).` });
    if (name === 'registry.json') {
      try {
        const r = JSON.parse(f.content);
        if (r.schema !== 'family-registry/1') out.push({ file: f.path, line: 1, message: 'family/registry.json must declare "schema": "family-registry/1".' });
      } catch (e) { out.push({ file: f.path, line: 1, message: `family/registry.json does not parse: ${e.message}` }); }
    }
  }
  return out;
}

const RESEARCH_DIR = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESEARCH_HEAD = ['**Question:**', '**Method:**', '**Status:**', '**Conclusion:**'];
const STATUS = /^\*\*Status:\*\*\s*(open|concluded|superseded by [a-z0-9][a-z0-9-]*)\s*$/;

// layout/research: research/INDEX.md and dated folders; each folder has a README
// whose first non-empty lines are the four header lines, a findings.json that
// parses when present, and its files at the top or under materials/.
export function checkResearch(files) {
  const out = [];
  const folders = new Map();
  for (const f of files) {
    const rest = f.path.replace(/^research\//, '');
    if (rest === 'INDEX.md') continue;
    const [dir, ...inner] = rest.split('/');
    if (!inner.length) { out.push({ file: f.path, line: 1, message: `research/ holds only INDEX.md and dated folders (YYYY-MM-DD-<slug>/); move "${rest}" into a folder.` }); continue; }
    if (!RESEARCH_DIR.test(dir)) { out.push({ file: f.path, line: 1, message: `research folder "${dir}" must be named YYYY-MM-DD-<kebab-slug>.` }); continue; }
    if (!folders.has(dir)) folders.set(dir, []);
    folders.get(dir).push({ f, inner: inner.join('/') });
  }
  for (const [dir, items] of folders) {
    const readme = items.find((x) => x.inner === 'README.md');
    if (!readme) { out.push({ file: items[0].f.path, line: 1, message: `research/${dir}/ has no README.md with its Question, Method, Status and Conclusion.` }); continue; }
    const head = readme.f.content.split(/\r?\n/).map((l, i) => ({ l: l.trim(), n: i + 1 })).filter((x) => x.l && !x.l.startsWith('# '));
    RESEARCH_HEAD.forEach((h, i) => {
      if (!head[i] || !head[i].l.startsWith(h)) out.push({ file: readme.f.path, line: head[i]?.n || 1, message: `research/${dir}/README.md must open with ${RESEARCH_HEAD.join(', ')} (in that order, after an optional title); line ${i + 1} should start with ${h}.` });
    });
    const st = head.find((x) => x.l.startsWith('**Status:**'));
    if (st && !STATUS.test(st.l)) out.push({ file: readme.f.path, line: st.n, message: 'Status is open, concluded, or "superseded by <slug>".' });
    for (const { f, inner } of items) {
      if (inner === 'findings.json') { try { JSON.parse(f.content); } catch (e) { out.push({ file: f.path, line: 1, message: `findings.json does not parse: ${e.message}` }); } }
      if (inner.includes('/') && !inner.startsWith('materials/')) out.push({ file: f.path, line: 1, message: `inside a research folder, files sit at the top or under materials/; "${inner}" does not.` });
    }
  }
  return out;
}

const SEMVER = /^\d+\.\d+\.\d+$/;
const RELEASE_TOP = new Set(['family.json', 'FROZEN.sha256']);
const RELEASE_DIRS = new Set(['plans', 'briefs']);

// layout/release: releases/INDEX.md and semver-named directories that hold
// family.json and only plans/, briefs/, FROZEN.sha256 (the loop has its own node).
export function checkRelease(files) {
  const out = [];
  const dirs = new Set();
  for (const f of files) {
    const rest = f.path.replace(/^releases\//, '');
    if (rest === 'INDEX.md') continue;
    const [dir, first, ...more] = rest.split('/');
    if (!SEMVER.test(dir)) { out.push({ file: f.path, line: 1, message: `releases/ holds INDEX.md and one directory per version, named x.y.z; "${dir}" is not.` }); continue; }
    dirs.add(dir);
    if (!more.length ? !RELEASE_TOP.has(first) : !RELEASE_DIRS.has(first)) {
      out.push({ file: f.path, line: 1, message: `releases/${dir}/ holds only family.json, plans/, briefs/, .jarl/ and, once frozen, FROZEN.sha256; "${rest.slice(dir.length + 1)}" does not belong there.` });
    }
  }
  for (const dir of dirs) {
    if (!files.some((f) => f.path === `releases/${dir}/family.json`)) {
      const any = files.find((f) => f.path.startsWith(`releases/${dir}/`));
      out.push({ file: any.path, line: 1, message: `releases/${dir}/ has no family.json, the release's manifest.` });
    }
  }
  return out;
}
