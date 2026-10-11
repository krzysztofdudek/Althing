// Retro: the model-calibration metrics of design.md (section A.4), computed read-only on a loop written by Jarl 6.1.0,
// which records no model. It shows which metrics the existing record already supports. Grouping is by the issue's
// Tier, because until 2026-10-11 Althing's rule tied a tier to one model (strong to the strongest, standard to a
// mid-class one) and reviewers to the strongest; a tier here is a model only as far as that rule was followed.
//
// It imports the driver Jarl's library (the checkout ws.local.json names as "jarl") for the journal and the issues,
// writes nothing, and takes no lock.
//
// Run from Althing's root: node research/2026-10-11-jarl-model-calibration-and-field-notes/materials/retro.mjs [loop root]
// (default: releases/6.2.0)
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ALTHING = process.cwd();
const local = JSON.parse(readFileSync(join(ALTHING, 'ws.local.json'), 'utf8'));
const L = await import(pathToFileURL(resolve(ALTHING, local.sources.jarl.path, 'skills/jarl/scripts/jarl-lib.mjs')).href);
const ROOT = resolve(ALTHING, process.argv[2] || 'releases/6.2.0');
const MIN_N = 5;
const DAY = 86_400_000;
const ms = (at) => Date.parse(`${at.replace(' ', 'T')}:00Z`);

const issues = L.loadIssues(ROOT);
const byId = new Map(issues.map((i) => [i.id, i]));
const journal = L.journalById(ROOT);

// Leases: every move into in-progress that names a worker. A unit is one worker on one branch (a package leased in
// one call is one unit; a takeover by another worker is a new unit).
const units = new Map();
for (const [id, events] of journal) {
  for (const e of events) {
    const m = new RegExp(`^${id} → in-progress(?: · .*)?$`).exec(e.text);
    if (!m) continue;
    const w = / · worker (.+?)(?: · worktree |$)/.exec(e.text);
    const b = / · branch (\S+)/.exec(e.text);
    if (!w) continue;
    const key = `${b ? b[1] : id}\n${w[1]}`;
    const u = units.get(key) || { branch: b ? b[1] : null, worker: w[1], start: e.n, issues: new Map() };
    if (!u.issues.has(id)) u.issues.set(id, e.n);
    u.start = Math.min(u.start, e.n);
    units.set(key, u);
  }
}

// One issue inside one unit: from its lease to the next lease of another worker on it (a handover), or the end.
function issueInUnit(id, from, worker) {
  const ev = journal.get(id) || [];
  let end = Infinity; let handedOver = false;
  for (const e of ev) {
    if (e.n <= from) continue;
    const w = new RegExp(`^${id} → in-progress.* · worker (.+?)(?: · worktree |$)`).exec(e.text);
    if (w && w[1] !== worker) { end = e.n; handedOver = true; break; }
  }
  const win = ev.filter((e) => e.n > from && e.n < end);
  const verdicts = win.map((e) => ({ e, r: /^\d{3} review (approve|changes) · (?:by (.+?) \((fresh|coordinator|self)\) · )?/.exec(e.text) })).filter((x) => x.r);
  const first = verdicts[0] || null;
  const rows = win.filter((e) => e.text.startsWith(`${id} evidence row · `));
  const rounds = win.filter((e) => e.text.startsWith(`${id} round `));
  const firstApprove = verdicts.find((x) => x.r[1] === 'approve');
  const closed = win.find((e) => new RegExp(`^${id} → done(?= |$)`).test(e.text));
  return {
    handedOver, closed: Boolean(closed), closedAt: closed ? closed.at : null,
    changes: verdicts.filter((x) => x.r[1] === 'changes').length,
    rounds: rounds.length,
    redAfterApprove: Boolean(firstApprove && rounds.some((r) => r.n > firstApprove.e.n)),
    rowsBeforeReview: rows.filter((r) => !first || r.n < first.e.n).length,
    reviewed: Boolean(first),
  };
}

// Follow-ups: issues filed within 7 days after a closed issue whose Found by names its number (the loop metric's rule).
const filedAt = new Map();
for (const [id, events] of journal) { const f = events.find((e) => e.text.startsWith(`filed ${id} `)); if (f) filedAt.set(id, f.at); }
const idsNamed = (t) => [...String(t || '').matchAll(/(?<![0-9A-Za-z])(\d{3})(?![0-9A-Za-z])/g)].map((m) => m[1]);
function followUps(id, closedAt) {
  if (!closedAt) return 0;
  return issues.filter((y) => y.id !== id && idsNamed(y.fields['found by']).includes(id) && filedAt.has(y.id) && ms(filedAt.get(y.id)) >= ms(closedAt) && ms(filedAt.get(y.id)) - ms(closedAt) <= 7 * DAY).length;
}

const rows = [];
for (const u of units.values()) {
  const per = [...u.issues].map(([id, from]) => ({ id, ...issueInUnit(id, from, u.worker) }));
  const settled = per.every((p) => p.closed || p.handedOver);
  if (!settled) continue;
  const lead = byId.get([...u.issues.keys()].sort()[0]);
  const repo = lead ? (lead.fields.repo || '.').split(',')[0].trim().split('/').pop() : '?';
  rows.push({
    tier: lead ? lead.tier : '?', kind: lead ? lead.kind : '?', repo, size: per.length,
    clean: per.every((p) => p.closed && !p.changes && !p.rounds && !p.handedOver),
    changes: per.reduce((s, p) => s + p.changes, 0), rounds: per.reduce((s, p) => s + p.rounds, 0),
    redAfterApprove: per.some((p) => p.redAfterApprove), handedOver: per.some((p) => p.handedOver),
    evidenceBeforeReview: per.filter((p) => p.reviewed).every((p) => p.rowsBeforeReview > 0) && per.some((p) => p.reviewed),
    followUps: per.reduce((s, p) => s + followUps(p.id, p.closedAt), 0),
  });
}

function line(label, rs) {
  const n = rs.length;
  const c = (f) => rs.filter(f).length;
  const share = (k) => (n >= MIN_N ? ` (${Math.round((k / n) * 100)}%)` : '');
  return `${label.padEnd(26)} units ${String(n).padStart(3)} · clean first pass ${c((r) => r.clean)}${share(c((r) => r.clean))} · changes ${rs.reduce((s, r) => s + r.changes, 0)} · rounds ${rs.reduce((s, r) => s + r.rounds, 0)} · red after approve ${c((r) => r.redAfterApprove)} · handed over ${c((r) => r.handedOver)} · rows before review ${c((r) => r.evidenceBeforeReview)}${share(c((r) => r.evidenceBeforeReview))} · follow-ups ${rs.reduce((s, r) => s + r.followUps, 0)}${n < MIN_N ? '  [n < 5: counts only]' : ''}`;
}
const group = (key) => { const g = new Map(); for (const r of rows) { const k = key(r); g.set(k, [...(g.get(k) || []), r]); } return [...g].sort((a, b) => b[1].length - a[1].length); };

console.log(`# Retro on ${ROOT.split('/').slice(-2).join('/')}: ${issues.length} issues, ${rows.length} settled worker units (one worker on one branch)\n`);
console.log('## Workers, by tier (the model by the rule of the time)');
for (const [k, rs] of group((r) => r.tier)) console.log(line(`tier ${k}`, rs));
console.log('\n## Workers, by class (Kind · Tier)');
for (const [k, rs] of group((r) => `${r.kind}·${r.tier}`)) console.log(line(k, rs));
console.log('\n## Workers, by repository (a slice on demand)');
for (const [k, rs] of group((r) => r.repo)) console.log(line(k, rs));

// Reviewers: every verdict, the approves a later verdict by another reviewer checked (no round, restart or reopen
// between), and the misses (a later changes by another reviewer, or a round after the approve, before the close).
const rv = { verdicts: 0, changes: 0, approves: 0, checked: 0, missedByLaterReview: 0, roundAfterApprove: 0, coordinatorVerdicts: 0 };
for (const [id, events] of journal) {
  const seq = events.filter((e) => /^\d{3} (review |round |→ )/.test(e.text));
  seq.forEach((e, k) => {
    const r = /^\d{3} review (approve|changes) · (?:by (.+?) \((fresh|coordinator|self)\) · )?/.exec(e.text);
    if (!r) return;
    rv.verdicts += 1;
    if (r[3] === 'coordinator') rv.coordinatorVerdicts += 1;
    if (r[1] === 'changes') { rv.changes += 1; return; }
    rv.approves += 1;
    for (const later of seq.slice(k + 1)) {
      if (/^\d{3} round /.test(later.text)) { rv.roundAfterApprove += 1; break; }
      if (/^\d{3} → (in-progress|open)(?= |$)/.test(later.text)) break;
      const lr = /^\d{3} review (approve|changes) · (?:by (.+?) \()?/.exec(later.text);
      if (lr && lr[2] && lr[2] !== r[2]) { rv.checked += 1; if (lr[1] === 'changes') rv.missedByLaterReview += 1; break; }
    }
  });
}
console.log('\n## Reviewers (all on the strongest model by the rule of the time)');
console.log(`verdicts ${rv.verdicts} · changes ${rv.changes} · approves ${rv.approves} · approves checked by a later reviewer ${rv.checked}, of which a later changes ${rv.missedByLaterReview} · a round after an approve ${rv.roundAfterApprove} · coordinator verdicts ${rv.coordinatorVerdicts}`);
console.log('\nNot in this record: the model of any worker or reviewer (only the tier, and only through a rule), a verdict relayed by someone else in the reviewer\'s name, an approve by the worker\'s own model, and every slip that never reached the record (a report sent before the check finished, a forbidden command form).');
