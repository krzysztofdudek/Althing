// The loop shape detector (rail loop/shape): releases/<v>/.jarl/ is one
// permanent Jarl loop, written through the driver Jarl and never by hand.

const TOP_FILES = new Set(['goal.md', 'decisions.md', 'asks.md', 'log.md', '.gitignore', '.gitattributes', '.permanent']);
const TOP_DIRS = new Set(['issues', 'templates', 'archive']);
const ISSUE = /^(\d{3,})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const REQUIRED = ['Status', 'Kind', 'Priority'];

// files: [{ path, content }] under releases/<v>/.jarl/; registryNames: Set or null.
export function checkLoop(files, { registryNames = null } = {}) {
  const out = [];
  if (!files.length) return out;
  const base = files[0].path.replace(/(\/\.jarl\/).*$/, '$1');
  const numbers = new Map();
  let permanent = false;
  for (const f of files) {
    const rel = f.path.slice(base.length);
    const [top, ...rest] = rel.split('/');
    if (rel === '.permanent') permanent = true;
    if (/(^|\/)\.lock(\.break)?$|\.tmp$/.test(rel)) { out.push({ file: f.path, message: `${rel} is Jarl's write lock or a temporary file; it is never committed.` }); continue; }
    if (!rest.length ? !TOP_FILES.has(top) : !TOP_DIRS.has(top)) {
      out.push({ file: f.path, message: `.jarl/ holds only goal.md, decisions.md, asks.md, log.md, issues/, templates/, archive/, .gitignore, .gitattributes and .permanent; "${rel}" does not belong there.` });
      continue;
    }
    if (top !== 'issues' || rest.length !== 1) continue;
    const m = ISSUE.exec(rest[0]);
    if (!m) { out.push({ file: f.path, message: `issue files are NNN-<kebab-slug>.md; "${rest[0]}" is not.` }); continue; }
    if (numbers.has(m[1])) out.push({ file: f.path, message: `issue number ${m[1]} is used twice (${numbers.get(m[1])} and ${rest[0]}).` });
    numbers.set(m[1], rest[0]);
    const lines = f.content.split(/\r?\n/);
    const head = /^# (\d+) \u00b7 /.exec(lines[0] || '');
    if (!head || head[1] !== m[1]) out.push({ file: f.path, line: 1, message: `the first line must be "# ${m[1]} \u00b7 <title>", matching the file's number.` });
    for (const field of REQUIRED) {
      if (!lines.some((l) => l.startsWith(`**${field}:**`))) out.push({ file: f.path, line: 1, message: `the issue has no **${field}:** field.` });
    }
    lines.forEach((l, i) => {
      const repo = /^\*\*Repo:\*\*\s*(.*)$/.exec(l);
      if (!repo) return;
      for (const r of repo[1].split(',').map((x) => x.trim()).filter(Boolean)) {
        const relative = r.startsWith('.') && !/^[A-Za-z]:/.test(r);
        const named = !r.includes('/') && (!registryNames || registryNames.has(r));
        if (!relative && !named) out.push({ file: f.path, line: i + 1, message: `**Repo:** "${r}" must be a relative path (../../../<Repo>) or a registry name, never an absolute path.` });
      }
    });
  }
  if (!permanent) out.push({ file: files[0].path, message: `${base}.permanent is missing: a release loop is opened with init --permanent and stays as the release's record.` });
  return out;
}
