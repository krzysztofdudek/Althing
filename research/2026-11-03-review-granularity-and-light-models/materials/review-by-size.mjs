// node review-by-size.mjs  -- reads the 6.2.0 loop and sibling repos (read-only), writes review-by-size.csv and a bands JSON on stdout
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const ROOT = '~/repos/github.com/krzysztofdudek';
const LOOP = ROOT + '/Althing/releases/6.2.0/.jarl';
const OUT = path.dirname(new URL(import.meta.url).pathname);
const log = fs.readFileSync(LOOP + '/log.md', 'utf8').split('\n');
const issues = {};
for (const f of fs.readdirSync(LOOP + '/issues')) {
  const t = fs.readFileSync(`${LOOP}/issues/${f}`, 'utf8'); const id = f.slice(0, 3);
  const g = k => (t.match(new RegExp(`^\\*\\*${k}:\\*\\*[ \\t]*(.*)$`, 'm')) || [, ''])[1].trim();
  issues[id] = { kind: g('Kind'), tier: g('Tier'), repos: g('Repo').split(',').map(s => s.trim().replace(/^(\.\.\/)+/, '')).filter(Boolean) };
}
const ev = {};
const E = id => ev[id] ??= { merges: [], rev: 0, chg: 0, rounds: 0, sev: [] };
for (const l of log) {
  let m;
  if ((m = l.match(/ · (\d+) merged ([0-9a-f]{7,40})(?: in (\S+))?/))) E(m[1]).merges.push({ sha: m[2], repo: m[3] ? m[3].replace(/^(\.\.\/)+/, '') : null });
  else if ((m = l.match(/ · (\d+) review (approve|changes) · by /))) {
    const e = E(m[1]); e.rev++;
    if (m[2] === 'changes') { e.chg++; const body = l.slice(m.index + m[0].length);
      const s = /\bCritical\b/.test(body) ? 3 : /\bImportant\b/.test(body) ? 2 : /\bMinor\b/.test(body) ? 1 : 0; e.sev.push(s); }
  } else if ((m = l.match(/ · (\d+) round \d+/))) E(m[1]).rounds++;
}
const git = (repo, args) => execFileSync('git', ['-C', `${ROOT}/${repo}`, ...args], { encoding: 'utf8', timeout: 20000, stdio: ['ignore','pipe','ignore'], maxBuffer: 1 << 28 });
const isGen = p => /(^|\/)dist\//.test(p) || /corpus\/.*(golden|expected)|golden/i.test(p);
const rows = [], unsized = [];
for (const [id, e] of Object.entries(ev)) {
  if (!e.merges.length) continue;
  const iss = issues[id]; if (!iss) { unsized.push([id, 'no issue file']); continue; }
  let ins = 0, del = 0, files = 0, gl = 0, gf = 0, ok = 0; const seen = new Set(), miss = [];
  for (const mg of e.merges) {
    const cands = mg.repo ? [mg.repo] : iss.repos.length ? iss.repos : ['Althing'];
    const cand2 = cands.map(r => r === '..' || r === '.' ? 'Althing' : r);
    let done = false;
    for (const repo of cand2) {
      try {
        const out = git(repo, ['diff', '--numstat', `${mg.sha}^1`, mg.sha]);
        const key = repo + mg.sha; if (seen.has(key)) { done = true; break; } seen.add(key);
        for (const ln of out.split('\n').filter(Boolean)) {
          const [a, d, p] = ln.split('\t'); const n = (a === '-' ? 0 : +a), x = (d === '-' ? 0 : +d);
          if (isGen(p)) { gl += n + x; gf++; } else { ins += n; del += x; files++; }
        }
        done = true; ok++; break;
      } catch { }
    }
    if (!done) miss.push(mg.sha);
  }
  if (!ok) { unsized.push([id, 'sha missing/unreadable: ' + miss.join(' ')]); continue; }
  if (miss.length) unsized.push([id + ' (partial)', 'some shas missing: ' + miss.join(' ')]);
  const sev = Math.max(0, ...e.sev);
  rows.push({ issue: id, repo: (e.merges[0].repo || iss.repos[0] || '').replace(/^(\.\.)?$/, 'Althing'), kind: iss.kind, tier: iss.tier,
    lines: ins + del, files, gen_lines: gl, gen_files: gf, merges: e.merges.length, reviews: e.rev, changes: e.chg, rounds: Math.max(e.rev, e.rounds), top_severity: ['none', 'Minor', 'Important', 'Critical'][sev] });
}
rows.sort((a, b) => a.issue.localeCompare(b.issue));
const cols = Object.keys(rows[0]);
fs.writeFileSync(OUT + '/review-by-size.csv', [cols.join(','), ...rows.map(r => cols.map(c => r[c]).join(','))].join('\n') + '\n');
// bands
const band = n => n <= 20 ? '1 up to 20' : n <= 100 ? '2 21-100' : n <= 400 ? '3 101-400' : n <= 1000 ? '4 401-1000' : '5 over 1000';
const stat = rs => { const n = rs.length; if (!n) return null; const r = rs.filter(x => x.reviews > 0);
  const pct = (a, b) => b ? (100 * a / b).toFixed(0) + '%' : 'n/a';
  return `${n} | ${r.length} | ${pct(r.filter(x => x.changes === 0 || (x.changes>0&&false)).length, r.length)} | ${pct(r.filter(x => ['Important', 'Critical'].includes(x.top_severity)).length, r.length)} | ${(r.reduce((s, x) => s + x.rounds, 0) / (r.length || 1)).toFixed(2)}`; };
// clean first pass: the first verdict is approve; approximated below by re-reading the log
const first = {};
for (const l of log) { const m = l.match(/ · (\d+) review (approve|changes) · by /); if (m && !(m[1] in first)) first[m[1]] = m[2]; }
for (const r of rows) r.firstClean = first[r.issue] === 'approve';
const tab = (title, keyf) => { const g = {}; for (const r of rows) (g[keyf(r)] ??= []).push(r);
  let s = `\n### ${title}\n\n| group | units | reviewed | clean first pass | Important/Critical named | mean rounds |\n|---|---|---|---|---|---|\n`;
  for (const k of Object.keys(g).sort()) { const rs = g[k], r = rs.filter(x => x.reviews > 0);
    const p = (a, b) => b ? Math.round(100 * a / b) + '%' : 'n/a';
    s += `| ${k} | ${rs.length} | ${r.length} | ${p(r.filter(x => x.firstClean).length, r.length)} | ${p(r.filter(x => x.top_severity === 'Important' || x.top_severity === 'Critical').length, r.length)} | ${(r.reduce((a, x) => a + x.rounds, 0) / (r.length || 1)).toFixed(2)} |\n`; }
  return s; };
let md = tab('By size band (lines changed, excluding dist and goldens)', r => band(r.lines));
md += tab('By kind', r => r.kind) + tab('By tier', r => r.tier) + tab('By repo', r => r.repo);
md += tab('Kind x size band', r => `${r.kind} / ${band(r.lines)}`) + tab('Tier x size band', r => `${r.tier} / ${band(r.lines)}`);
md += `\n### Unsized\n\n` + (unsized.map(u => `- ${u[0]}: ${u[1]}`).join('\n') || 'none') + '\n';
md += `\nTotals: ${rows.length} sized rows, ${rows.filter(r => !r.reviews).length} with no review verdict.\n`;
fs.writeFileSync(OUT + '/bands.generated.md', md);
console.log(md);
