// Reads the log of a real Jarl loop and prints where its issues spent their time and what actually went wrong.
// Node, no dependencies, read-only. Usage: node real-loop.mjs <directory holding .jarl>
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
const lines = readFileSync(join(root, '.jarl/log.md'), 'utf8').split('\n');
const stamp = (s) => Date.parse(s.replace(' ', 'T') + ':00Z');
const hours = (a, b) => (b - a) / 3600000;
const median = (xs) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const pct = (xs, p) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const f = (x) => (x === null ? 'n/a' : x.toFixed(2));

const issues = new Map();
const get = (id) => { const k = String(Number(id)); if (!issues.has(k)) issues.set(k, { id: k, starts: [], rows: [], verdicts: [], rounds: [], merges: [], dones: [], workers: [], body: [] }); return issues.get(k); };
for (const l of lines) {
  const m = l.match(/^- (\d{4}-\d\d-\d\d \d\d:\d\d)(?: key \S+)?(?: tip)?(?: by \S+)? · (.*)$/);
  if (!m) continue;
  const t = stamp(m[1]);
  const x = m[2];
  let g;
  if ((g = x.match(/^filed (\d+)\b/))) get(g[1]).filed = t;
  else if ((g = x.match(/^(\d+) → in-progress\b(.*)$/))) { const i = get(g[1]); i.starts.push(t); const w = g[2].match(/· worker (\S+)/); if (w) i.workers.push(w[1]); }
  else if ((g = x.match(/^(\d+) → done\b/))) get(g[1]).dones.push(t);
  else if ((g = x.match(/^(\d+) evidence row\b/))) get(g[1]).rows.push(t);
  else if ((g = x.match(/^(\d+) review (approve|changes)\b/))) get(g[1]).verdicts.push({ t, v: g[2] });
  else if ((g = x.match(/^(\d+) round \d+/))) get(g[1]).rounds.push(t);
  else if ((g = x.match(/^(\d+) merged\b/))) get(g[1]).merges.push(t);
  else if ((g = x.match(/^(\d+) body · acceptance/))) get(g[1]).body.push(t);
}
const all = [...issues.values()];
const code = all.filter((i) => i.merges.length && i.starts.length && i.dones.length);
const stage = { backlog: [], work: [], toVerdict: [], rework: [], toMerge: [], toDone: [] };
for (const i of code) {
  const s = i.starts[0];
  const firstRow = i.rows.find((t) => t >= s);
  const firstVerdict = i.verdicts.find((v) => v.t >= s);
  const lastApprove = [...i.verdicts].reverse().find((v) => v.v === 'approve');
  const merge = i.merges[i.merges.length - 1];
  if (i.filed) stage.backlog.push(hours(i.filed, s));
  if (firstRow) stage.work.push(hours(s, firstRow));
  if (firstRow && firstVerdict && firstVerdict.t >= firstRow) stage.toVerdict.push(hours(firstRow, firstVerdict.t));
  if (firstVerdict && lastApprove && lastApprove.t >= firstVerdict.t) stage.rework.push(hours(firstVerdict.t, lastApprove.t));
  if (lastApprove && merge >= lastApprove.t) stage.toMerge.push(hours(lastApprove.t, merge));
  stage.toDone.push(hours(merge, i.dones[i.dones.length - 1]));
}
console.log(`issues seen in the log: ${all.length}; with a lease, a merge and a done: ${code.length}`);
console.log('stage (hours)                          n  median     p90     sum');
for (const [k, label] of [['backlog', 'filed to first lease'], ['work', 'lease to first proof row'], ['toVerdict', 'first row to first verdict'], ['rework', 'first verdict to last approve'], ['toMerge', 'last approve to merge'], ['toDone', 'merge to done']]) {
  const xs = stage[k];
  console.log(`${label.padEnd(36)} ${String(xs.length).padStart(4)} ${f(median(xs)).padStart(7)} ${f(pct(xs, 0.9)).padStart(7)} ${xs.reduce((a, b) => a + b, 0).toFixed(0).padStart(7)}`);
}
const leased = all.filter((i) => i.starts.length);
const edited = leased.filter((i) => i.body.some((t) => t > i.starts[0] && (!i.dones.length || t < i.dones[i.dones.length - 1])));
console.log(`leased issues: ${leased.length}; acceptance body edited after the first lease and before done: ${edited.length} (${edited.map((i) => i.id).join(', ')})`);
const multi = leased.filter((i) => new Set(i.workers).size > 1);
console.log(`issues with more than one worker name: ${multi.length} (${multi.map((i) => i.id).join(', ')})`);
console.log(`rounds: ${all.reduce((a, i) => a + i.rounds.length, 0)} on ${all.filter((i) => i.rounds.length).length} issues; changes verdicts: ${all.reduce((a, i) => a + i.verdicts.filter((v) => v.v === 'changes').length, 0)} on ${all.filter((i) => i.verdicts.some((v) => v.v === 'changes')).length}`);
const closed = all.filter((i) => i.dones.length && i.verdicts.length);
const clean = closed.filter((i) => !i.verdicts.some((v) => v.v === 'changes') && !i.rounds.length);
console.log(`reviewed and done: ${closed.length}; first pass clean (no changes, no round): ${clean.length}`);
const redNoChange = all.filter((i) => i.rounds.some((t) => { const before = i.verdicts.filter((v) => v.t <= t); const last = before[before.length - 1]; return last && last.v === 'approve'; }));
console.log(`issues with a round whose last verdict before it was an approve (a red after review): ${redNoChange.length} (${redNoChange.map((i) => i.id).join(', ')})`);
const files = readdirSync(join(root, '.jarl/issues')).filter((n) => n.endsWith('.md'));
let withFiles = 0, emptyWhy = 0, noAcc = 0; const titles = new Map();
for (const n of files) {
  const t = readFileSync(join(root, '.jarl/issues', n), 'utf8');
  if (/\*\*Files:\*\* \S/.test(t)) withFiles++;
  if (/^## Why\s*\n\s*(\n## |$)/m.test(t)) emptyWhy++;
  if (/^## Acceptance\s*\n\s*(\n## |$)/m.test(t)) noAcc++;
  const title = t.split('\n')[0].replace(/^# \d+ · /, '').trim().toLowerCase();
  titles.set(title, (titles.get(title) || 0) + 1);
}
console.log(`issue files: ${files.length}; declaring Files: ${withFiles}; empty Why: ${emptyWhy}; empty Acceptance: ${noAcc}; titles filed twice: ${[...titles.values()].filter((c) => c > 1).length}`);
const asks = readFileSync(join(root, '.jarl/asks.md'), 'utf8');
console.log(`questions: ${(asks.match(/^- \*\*a-\d+\*\*/gm) || []).length}; ratify: ${(asks.match(/· ratify/g) || []).length}; open: ${(asks.match(/\(open\)/g) || []).length}`);
const text = lines.join('\n');
for (const w of ['second merger', 'mid-merge', 'two mergers', 'merge conflict', 'conflict in', 'flaky', 'stale lease', 'compaction', 'never ran', 'did not run', 'claimed']) console.log(`log mentions "${w}": ${(text.match(new RegExp(w, 'gi')) || []).length}`);

// Issues with more than one worker: did the last worker record any proof of its own?
const onOld = [];
for (const i of multi) {
  if (!i.dones.length) continue;
  const named = lines.filter((l) => new RegExp(`· 0*${i.id} → in-progress\\b.*· worker `).test(l)).map((l) => ({ t: stamp(l.slice(2, 18)), w: (l.match(/· worker (\S+)/) || [])[1] }));
  let last = named[named.length - 1];
  for (let k = named.length - 1; k > 0; k--) { if (named[k].w !== named[k - 1].w) { last = named[k]; break; } }
  if (!i.rows.some((t) => t >= last.t)) onOld.push(i.id);
}
console.log(`done issues with several workers where the last new worker recorded no row of its own: ${onOld.length} (${onOld.join(', ')})`);
// How many issues were in flight at once.
const ev = [];
for (const i of leased) { const e = i.dones[i.dones.length - 1] ?? Date.now(); ev.push([i.starts[0], 1], [e, -1]); }
ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
let cur = 0, peak = 0; for (const [, d] of ev) { cur += d; peak = Math.max(peak, cur); }
console.log(`issues in flight at once, peak (first lease to last done): ${peak}`);
const days = new Set(all.flatMap((i) => i.dones.map((t) => new Date(t).toISOString().slice(0, 10))));
console.log(`days with at least one issue closed: ${days.size}; closed issues per such day: ${(all.filter((i) => i.dones.length).length / days.size).toFixed(1)}`);
const notReview = lines.filter((l) => !/ review (approve|changes) /.test(l) && !/ filed /.test(l) && !/ body · /.test(l));
for (const w of ['rolled back', 'roll back', 'red on', 'suite red', 'conflict']) console.log(`non-review, non-filing lines with "${w}": ${notReview.filter((l) => l.toLowerCase().includes(w)).length}`);
