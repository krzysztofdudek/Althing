// node time-by-unit.mjs [log.md]  -- reads a loop's log (default: the 6.2.0 loop), read-only; prints where a unit's time goes, as Markdown
import fs from 'node:fs'; import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const LOG = process.argv[2] || path.join(HERE, '../../../releases/6.2.0/.jarl/log.md');
const log = fs.readFileSync(LOG, 'utf8').split('\n');
const re = /^- (\d{4}-\d\d-\d\d \d\d:\d\d) · (\d{3}) (.*)$/;
const min = s => Date.parse(s.replace(' ', 'T') + 'Z') / 60000;
const branchOf = {}; const units = {}; const verdictGroups = {}; const evRows = {};
for (const l of log) {
  const m = l.match(re); if (!m) continue;
  const [, ts, id, rest] = m; const t = min(ts);
  if (rest.startsWith('→ in-progress')) {
    const bm = rest.match(/branch (\S+)/); if (!bm) continue;
    branchOf[id] = bm[1];
    const u = units[bm[1]] ??= { issues: new Set(), start: t, verdicts: [], merged: null };
    u.issues.add(id); u.start = Math.min(u.start, t); continue;
  }
  const b = branchOf[id]; if (!b) continue; const u = units[b];
  const v = rest.match(/^review (approve|changes) · by (\S+)/);
  if (v) { (verdictGroups[ts + '|' + v[2]] ??= new Set()).add(id); u.verdicts.push({ t, kind: v[1], key: ts + '|' + v[2] }); continue; }
  if (/^merged/.test(rest)) u.merged = u.merged == null ? t : Math.max(u.merged, t);
  if (/^evidence row/.test(rest)) (evRows[b] ??= []).push(t);
}
const sorted = a => [...a].sort((x, y) => x - y);
const at = (a, p) => sorted(a)[Math.min(a.length - 1, Math.floor(a.length * p))];
const dist = a => `${at(a, 0.5)} · ${at(a, 0.25)} · ${at(a, 0.75)} · ${at(a, 0.9)}`;
const sum = a => a.reduce((x, y) => x + y, 0);
const us = Object.values(units).filter(u => u.merged != null && u.verdicts.length);
const reviews = u => [...new Map(u.verdicts.map(v => [v.key, v])).values()].sort((a, b) => a.t - b.t);

console.log('### Issues per recorded verdict (same minute, same reviewer)\n');
console.log('| issues | verdicts |\n|---|---|');
const vs = {}; for (const s of Object.values(verdictGroups)) vs[s.size] = (vs[s.size] || 0) + 1;
for (const [k, n] of Object.entries(vs)) console.log(`| ${k} | ${n} |`);

console.log('\n### Units by issues per unit (merged, with at least one verdict)\n');
console.log('| issues per unit | units | median lease to merge, min | median per issue, min | mean reviews per unit | units with a changes verdict |\n|---|---|---|---|---|---|');
for (const [label, test] of [['1', n => n === 1], ['2', n => n === 2], ['3', n => n === 3], ['4 to 6', n => n >= 4]]) {
  const sel = us.filter(u => test(u.issues.size)); if (!sel.length) continue;
  const tot = sel.map(u => u.merged - u.start); const per = sel.map(u => (u.merged - u.start) / u.issues.size);
  const revs = sel.map(u => reviews(u).length);
  console.log(`| ${label} | ${sel.length} | ${at(tot, 0.5)} | ${Math.round(at(per, 0.5))} | ${(sum(revs) / sel.length).toFixed(2)} | ${sel.filter(u => u.verdicts.some(v => v.kind === 'changes')).length} |`);
}

const toFirst = [], between = [], toMerge = [], total = [], work = [], wait = [];
for (const u of us) {
  const r = reviews(u);
  toFirst.push(r[0].t - u.start); between.push(r.at(-1).t - r[0].t); toMerge.push(u.merged - r.at(-1).t); total.push(u.merged - u.start);
  let prev = u.start;
  for (const v of r) {
    const before = (evRows[Object.keys(units).find(b => units[b] === u)] || []).filter(x => x <= v.t && x >= prev);
    if (before.length) { const last = Math.max(...before); work.push(last - prev); wait.push(v.t - last); }
    prev = v.t;
  }
}
console.log('\n### Phases of a unit, minutes (median · p25 · p75 · p90)\n');
console.log('| phase | n | minutes |\n|---|---|---|');
console.log(`| lease to first verdict | ${toFirst.length} | ${dist(toFirst)} |`);
console.log(`| first verdict to last verdict | ${between.length} | ${dist(between)} |`);
console.log(`| last verdict to merge | ${toMerge.length} | ${dist(toMerge)} |`);
console.log(`| lease to merge | ${total.length} | ${dist(total)} |`);
console.log(`| round start (lease or previous verdict) to the last evidence row before the verdict: work | ${work.length} | ${dist(work)} |`);
console.log(`| that evidence row to the verdict: raising and running the reviewer | ${wait.length} | ${dist(wait)} |`);
