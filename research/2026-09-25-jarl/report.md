# Jarl: improvements from two days of real use

## 1. Verdict

Jarl carried a large release loop: 231 issues across Yggdrasil, Grain, Horde, JarlSkill and the repository the loop lived in, 1712 log lines and 28 rulings. The record was complete enough that this research could count every approve, every evidence row and every state change after the fact. That is the tool's core promise, and it held. The loop did not run the way Jarl models work, though:

- **Packages, not single issues.** Jarl assumes one issue, one worker, one branch and one fresh review. In practice one Opus worker took a package of 2 to 10 issues on a shared branch.
- **Reviews were rarely fresh.** The coordinator or the worker itself approved most issues. Only 17 of 221 approvals came from a fresh reviewer.
- **State lived in prose.** Merge SHAs, CI state, "waits on 022" and "for Krzysztof to ratify" were free text.

The tool has no words for any of this. The coordinator worked around the gap by copying the same evidence across issues and by writing state as prose, and the record drifted:

- Issue 209 was closed with issue 203's evidence.
- The `done` gate was satisfied by notes written at filing time.
- The handoff is three days old.
- 35 issue files are untracked in git, while the committed log files them.

Two outright defects were reproduced in scratch loops:

- **No locking.** Parallel writes lose evidence and duplicate issue numbers.
- **Argument parser.** It swallows any value starting with `--`.

The loop did not actually hit duplicate ids, because the coordinator happened to do most writes one at a time. The skill still tells workers, the reviewer and the merger to write at the same time, so the defect sits in the design. Every fix proposed here records, derives or displays state. None of them adds a landing gate.

## 2. Top recommendations (ranked)

| # | What | Why | Effort | How we would know it worked |
|---|---|---|---|---|
| 1 | **Lock every mutating command and write atomically** (A1): `.jarl/.lock` taken with `wx` plus a stale-lock timeout, temp file then rename, and `new` retries on EEXIST. | The skill has workers, reviewer and merger write concurrently through `--root`. Scratch runs lost 19 of 20 evidence writes and gave issue 001 four times. Rec 5 (bulk ops) and B1 (research import) depend on it. | S (half a day, ~40-60 lines + 1 test) | 20 parallel `evidence` calls → 20 rows and 20 log lines. 10 parallel `new` calls → 10 distinct numbers. |
| 2 | **Issues get a body at filing time, and research imports with stable ids** (B2 + B1): body flags on `new`, a `body` command, and `import <findings.json>` with a **Source:** field set to `<report-dir>#<finding-id>`, plus a `sources` coverage view. | 143 of 231 issues have no What, Why or Acceptance. Finding ids live only in titles across three unlinked id systems. The reviewer has no acceptance line to check. | S for B2 (~60 lines); M for B1 (~150 lines) | The next loop has 0 in-progress or done issues with an empty Acceptance. `sources` accounts for 437/437 findings. |
| 3 | **Make the package a first-class shape** (A5 + the non-overlapping part of B8): `set <ids…> in-progress --branch --worker --worktree`, `check --branch` over the union of Files, and `branches` → issue ids with stale and "done → delete" marks. | This is how the loop actually ran. Today `check` fails every issue on a shared branch, which is why no `check` result was ever recorded. | M (~100 + ~90 lines, one shared Worker field) | The jarl-b scratch `check` passes with one call. Deleting a worktree makes the next `status` list the affected issues. |
| 4 | **Record who reviewed, and make the canon match** (B3): `review … --by fresh\|self\|coordinator` (required), with the split shown in `report` and `status`. | family.md:27 promises a fresh reviewer before every merge, and the record shows 17 of 221. This is an honesty-line gap in public canon. | S (~40 lines) + your decision (§6 Q1) | `report` prints `done N · fresh F · self S · coordinator C`, and the canon sentence matches it. |
| 5 | **Bulk ids on evidence, review, set, tag and prio** (A6), all-or-nothing under the lock. | 503 of 1241 evidence/review/done lines are identical same-minute copies. A misrouted copy in such a fan-out is what the 203-209 corrections had to undo. | S (~30 lines) | Closing a 4-issue package takes 4 calls instead of 16, with no partial writes on error. |
| 6 | **Record hygiene for committed loops whose code lives elsewhere** (B9 + B10): `status`, `handoff` and `close` report uncommitted `.jarl/` files, and `handoff read` computes in-flight work, waits, asks and heads live, showing the handoff's age. | 35 untracked issue files, while the committed log files them. A new session boots from a snapshot written 3 days and ~140 issues ago. | S (~30 + ~50 lines) | A boot today would print "stale by 3d". `status` shows 0 uncommitted loop files, or the exact count. |
| 7 | **Non-blocking `ask --kind ratify`** (A10), listed in `status` and the handoff. | Changes to yg-architecture.yaml (issue 185, which AGENTS.md says need your confirmation) and the prompt-limit change (72000 → 96000) were parked inside evidence prose. You had to collect them by hand in a working note. | XS-S (~20 lines + a SKILL paragraph) | `status` on this loop would have listed the item for 185, the prompt limit and the TS import policy on the morning of 24.09. |
| 8 | **An `After:` relation, and rulings that touch their issues** (B5). | 021, 073 and 100 have sat "in-progress" for days while really waiting on 022. 097 was settled by a ruling and is still open, and `next` offers it first. | S (~70 lines) | This loop shows `in flight 0 · waiting 3`, and `next` stops offering 097. |

Order of work: rec 1 comes first, because recs 2 (import), 3 and 5 write in bulk or in parallel. The medium-priority items A2, A4, A7, A9 and B4 follow; see the table.

## 3. Findings table

| id | kind | priority | title | where | proposal |
|---|---|---|---|---|---|
| jarl-1-A1 | defect | high | Concurrent calls lose evidence and duplicate issue numbers (no lock, read-modify-write) | jarl.mjs:308, :432/:438, :218, :343-352; SKILL.md:284-286 | `.jarl/.lock` + write to temp then rename; `new` with `wx` and retry on EEXIST; a 20-process test |
| jarl-2-B1 | opportunity | high | No research→issue import; finding ids unlinked across three id systems | jarl.mjs:297-316, :180-205; research/2026-09-2*/findings.json | Idempotent `import` with a **Source:** field (`<report-dir>#<id>`), `--group-by`, `sources` coverage view; runs under the A1 lock |
| jarl-2-B2 | defect | high | Issues filed at scale have no body; `acceptanceLineCount` has no caller | jarl.mjs:297-316, :411-414, :478-495; SKILL.md:43-46, :145-147 | Body flags on `new` + a `body` command; `set in-progress` refuses an empty Acceptance; wire up or delete acceptanceLineCount |
| jarl-2-B3 | inconsistency | high | The canon promises a fresh reviewer; the record shows 17/221, and the tool cannot tell reviewers apart | the canon (family.md:27 at the time); jarl.mjs cmdReview; log.md | Required `review --by`; `check --record`; split shown in report/status; reword the canon or restore fresh reviewers |
| jarl-1-A5 | inconsistency | high | The real unit of work is a package; no Branch/Worker field; `check` fails on a shared branch | jarl.mjs:643-685, :713-730, :335-355; SKILL.md:135 | `set <ids…> in-progress --branch --worker`; `check --branch` over the union of Files; `branches` → ids; Tier-vs-Model comparison optional |
| jarl-1-A2 | defect | medium | Parser swallows values starting with `--`; `--ran "--help"` exits 0 without writing; unknown flags ignored | jarl.mjs:821-833, :843 | Flag table per command, `--flag=value`, a bare `--` terminator, unknown flag = error |
| jarl-1-A4 | risk | medium | `done` gate met by filing-time evidence; a reopen keeps the old approve | jarl.mjs:341-342, :552-563 | Leaving done spends the approve; `done` needs a row newer than the last `→ in-progress`, or newer than filing when there is none (87 done issues never went through in-progress) |
| jarl-1-A6 | opportunity | medium | No bulk ops; 40% of evidence/review/done writes are copied text | jarl.mjs:421-441, :570, :335 | Id lists and ranges, applied all-or-nothing under the A1 lock; select by `--branch` |
| jarl-1-A7 | opportunity | medium | Merge SHA and CI state only in prose; the `merged` step is never logged (0 vs 221 done) | SKILL.md:277-283 | `merged <ids…> --sha --ci` fields; "merged, CI pending" count; ancestor check at `done` with a multi-repo fallback |
| jarl-1-A9 | inconsistency | medium | `decide`: no supersession; slug crashes the regex; false duplicates (`q.r` refused after `qxr`) | jarl.mjs:214-219, :869; SKILL.md:39 | Slugify and regex-escape; `--supersedes`, `--issue`, `--by`; `decisions --live` for boot |
| jarl-1-A10 | opportunity | medium | No non-blocking "decided under mandate, awaiting ratification" item | jarl.mjs:17, :744-758 | `ask --kind ratify --issue`; listed by status and handoff; `answer` turns it into a ruling |
| jarl-2-B4 | opportunity | medium | Tip/CI state across repos only as 122 pasted `gh run watch` rows; Horde red found only at the dry run | goal.md; dry-run G1/G9/G14; jarl.mjs cmdHandoffWrite | Read-only `tips [--json]` (gh optional); optional "reverify X after Y" edges; never gates `done`; shares its CI lookup with A7 |
| jarl-2-B5 | defect | medium | No "waits on" relation; in-progress misused as blocked; rulings leave issues open | issues 021/073/100/231, 022, 097; jarl.mjs:478-495, :210-216 | **After:** field; `next` shows "(waits on …)"; `status` counts waiting separately; `decide --issue` |
| jarl-2-B8 | opportunity | medium | No worktree/since on in-progress work; lost worktrees go unnoticed; stale branches not marked | jarl.mjs:335-355, :713-730; ruling worktrees-outside-tmp; dry-run G24 | Worktree/Since fields (Worker shared with A5); stale detection; "done → delete" in `branches`; no expiry or takeover |
| jarl-2-B9 | defect | medium | Committed loop whose code lives elsewhere: nothing commits `.jarl/`; 35 files untracked | SKILL.md:236-238, :268-283 | Porcelain check in status/handoff/close; `close` refuses while any remain; one merger-brief sentence |
| jarl-2-B10 | defect | medium | Handoff goes stale silently (written 09-22, last activity 09-25) | handoff.md; SKILL.md:127-129 | `handoff read` computes the mechanical parts live and prints age and changes-since |
| jarl-1-A12 | opportunity | low | Single-repo `Repo:`; absolute paths in 82 issues; `report` is not per repo; "found along the way" is noise | jarl.mjs:462-476, :699-711, :803-817 | Store Repo relative to the loop root (cheapest win); allow a list; `report --by-repo`; narrow "found" |
| jarl-2-B7 | opportunity | low | Merge queue only in prose; CHANGELOG is the recurring conflict | SKILL.md:227-293; log:285, :460, :471, :473, :1213 | Changelog fragments in the issue + `report --changelog <repo>` (the useful half); computed `queue` optional |
| jarl-2-B11 | risk | low | The lightness line is not written as a "will not grow" list | family.md; SKILL.md:12-14; README.md:103,126; Horde land.mjs/queue.mjs/wave.mjs | One paragraph: no check-running merge queue, no CI-gated `done`, no expiring leases, no release mode, no wave planner |
| jarl-2-B12 | opportunity | low | `status` is one line on a 231-issue, 7-repo loop; the release checklist lives in 022's prose | jarl.mjs:497-520; issue 022; dry-run §2 | `status --by repo\|tag\|kind --json`, `report --json`; `new --from-template` kept in the releasing skill |

## 4. Details for high-priority items

### jarl-1-A1: concurrent writes lose data and duplicate ids

- **Evidence.**
  - Scratch loop jarl-a: 20 parallel `evidence 005 --ran wN --saw ok` gave `rows in file: 14`, `log lines: 19`, and one call failed with `no such issue: 005`. 10 parallel `new` calls gave issue 006 four times and 007-009 twice each.
  - The skeptic's rerun (scratchpad/research/skeptic-jarl) was worse. 20 parallel writes left 1 row and 2 log lines, and 18 calls failed with `no such issue: 001`.
  - Code: jarl.mjs:308 computes the next id as max+1. Evidence is readFileSync → setSection → writeFileSync with no lock.
  - SKILL.md:285 admits that "a write that silently failed to land … has happened".
  - Up to seven Opus workers ran at once (a working note of 2026-09-23).
- **Why high.** It silently corrupts the record the whole tool exists to keep, and the skill's own concurrency model (SKILL.md:190, :277) triggers it. The real loop avoided duplicates only because the coordinator serialized most writes.
- **Fix.** Lock with `openSync('.jarl/.lock','wx')` plus backoff and stale-lock expiry. Write to a temp file and rename it into place. `new` claims its file with `wx`.
- **Cost.** ~40-60 lines plus a child-process test, zero dependencies.
- **Done when.** The experiment above gives 20/20 rows and log lines, and 10 parallel `new` calls give 10 distinct numbers.

### jarl-2-B2 + jarl-2-B1: issues have no body; research does not import

- **Evidence.**
  - 143 issues (089-231) have empty What, Acceptance and Where, and 34 have empty Files, including the 129-149 audit batch.
  - `new` accepts no body flags, and SKILL.md:43 forbids hand edits, so bulk filers left bodies empty.
  - `acceptanceLineCount` (jarl.mjs:411) has no caller.
  - The reviewer brief asks whether "the acceptance line is met literally" (SKILL.md:145-147), and on 143 issues there is no such line.
  - Eight reports hold 437 findings in one findings.json schema. Their ids exist as slugs, as report-local M/m/F/S/G ids (F1 collides between two reports) and as issue numbers, linked only through titles like `(M1-M5, M10, M12, m1-m11)`.
  - One pointer line, "Source: …" into the research folder (translated from Polish), is pasted into 13 issues.
- **Why high.** Weak bodies are the root cause behind B3's weak reviews and A4's empty gate. Mapping between numbering systems by hand is what produced the 203-209 mix-up, where issue 209 was closed with issue 203's evidence.
- **Fix, B2 (S).**
  - Add `--what/--why/--where/--acceptance/--body-from` and a `body <id> --section` command.
  - `set in-progress` refuses an empty Acceptance, and an empty Files when more than one issue is in flight. This is the same kind of refusal on the loop's own record that `done` already makes.
- **Fix, B1 (M).**
  - `import <findings.json> [--group-by] [--dry-run]` maps where, evidence, impact, suggested_fix and severity onto Where, What, Why, Acceptance and prio.
  - It writes `Source: <report-dir>#<id>` and is idempotent under the A1 lock.
  - `sources` lists each finding as either filed or unfiled. Leaving a finding out takes an explicit `decide` or `dropped`.
- **Done when.** A scratch replay of the 09-23 import gives 0 issues with empty What/Where, and `sources` accounts for 437/437.

### jarl-2-B3: the review-provenance gap against public canon

- **Evidence.**
  - Of the 221 `review approve` lines, 119 are self-reviews ("Own review"), 82 are coordinator reviews ("Coordinator:") and 17 name a fresh reviewer ("Fresh reviewer"); the labels are translated from Polish.
  - The whole loop has only 5 `review changes` verdicts.
  - `check` results were recorded 0 times, and the merger's `merged <id> <sha>` line appears 0 times.
  - family.md:27 says Jarl "merges a worker's branch only after a fresh reviewer approves it".
- **Why high.** It is an honesty-line gap in a public statement. The tool cannot distinguish the cases, so no one can see the gap without an audit like this one.
- **Fix.**
  - A required `--by fresh|self|coordinator` on `review`, and a **Reviews:** tally in the issue.
  - `check --record` appends its result as evidence.
  - `report` and `status` print the split.
  - The canon and practice choice is yours (§6 Q1). This absorbs A4's parts (a) and (d).
- **Done when.** The next loop's `report` prints the split and the canon sentence matches it.

### jarl-1-A5: the package as a first-class shape

- **Evidence.**
  - Log in-progress lines: `163..172 → in-progress · Opus worker, branch jarl/163-packages` (translated from Polish), `178..184 → … jarl/178-robustness`, `150,153,155,160 → … jarl/150-agent-layer`, `203..206 → … jarl/203-scale`. The last branch name came from the wrong mapping; the real scale work was 204-207.
  - cmdCheck (:671) computes `outside` from one issue's Files. Scratch jarl-b: `check 001` → `✗ diff inside declared files — outside a.txt: b.txt`, exit 2, and the same for 002.
  - `show --json` has no branch or worker field.
- **Why high.** It is the largest gap between the tool's model and how it was actually used. It explains why `check` was never used and why evidence was copied issue by issue.
- **Fix.**
  - `set <ids…> in-progress --branch <b> --worker <w> [--worktree <p>]`.
  - `check --branch <b>` over the union of Files.
  - `branches` prints `jarl/163-packages → 163-172`, and flags stale leases and done-and-merged branches (B8, no expiry or takeover).
  - SKILL.md documents packages.
  - Tier-vs-Model reporting is optional; the 207 figure was not confirmed.
- **Cost.** ~100-190 lines combined.
- **Done when.** The jarl-b scratch `check --branch` passes in one call, and a deleted worktree shows up as stale in `status`.

## 5. What is already good

- **The record was auditable.** From log.md and issues/ alone this research could count 221 approvals by kind, 503 fanned-out lines, 122 CI pastes, and which issues never went through in-progress. An append-only log with one line per state change is the right base; every proposal here builds on it rather than replacing it.
- **Refusals stay on the record, not on code.** `done` without evidence or review, and `close` with open issues, are refused (jarl.mjs:341-342), while code landing is never blocked. SKILL.md:12-14 and README.md:103,126 already draw the line against Horde ("no landing gate… When a repository needs rails, that is Horde's job"). Every fix above fits inside it.
- **It adapted without breaking.** The coordinator ran packages, self-review under a ruling, and cross-repo CI rules, and the tool never stopped the work. The drift is the cost of that flexibility, and it is fixable by recording more, not by constraining more.
- **Rulings are durable.** 28-29 `decide` entries kept cross-session decisions out of chat, including reversals (the ruling that a type import is a dependency). What is missing is supersession marking (A9), not the mechanism.
- **It stayed light.** It is one 884-line file with no npm dependencies, and during the loop it absorbed its own fixes (004-009, 023, 025, 051, 057, 058, 061, 063, 069, 083, 099, 121) without disruption.
- **It is honest about itself.** SKILL.md:285 already warns that a silent lost write has happened. The fix is to make that warning unnecessary.

## 6. Open questions for the owner

1. **Fresh review: fix the canon or the practice?** (B3)
   - (a) Reword family.md to "evidence and a recorded review before each merge". Cost: one edit, and the public promise becomes weaker but true.
   - (b) Go back to a fresh one-shot reviewer per package. Cost: roughly one extra Opus call per package, and slower loops.
   - (c) Both: fresh review is required only for issues tagged risky, and the canon says so. Cost: one tag convention plus the `--by` recording.
   - In every option the `--by` field ships, so the split is visible whichever you choose.
2. **Packages or one issue per worker?** (A5)
   - (a) Make packages first-class. Cost: ~100 lines and a SKILL rewrite of "one worker per issue".
   - (b) Keep one issue per worker and require it. Cost: more workers and more merges, which you already chose against in practice.
   - The recommendation is (a), because it matches what worked.
3. **May `set in-progress` refuse an issue with an empty Acceptance?** (B2b) It refuses on the loop's own record, like `done` does today, not on code.
   - (a) Yes, a refusal. Cost: bulk filers must fill a body or use `import`.
   - (b) A warning only. Cost: empty issues keep flowing.
4. **May `set done` check that the merge SHA is on the release branch?** (A7) It is a git ancestry check on the record and does not run anything.
   - (a) Yes, a refusal. It would have caught 209's premature close.
   - (b) A display in `status` only. That is safer against the "second Horde" drift, but 209-type errors stay silent.
5. **Do the small Jarl defects (A1 lock, A2 parser) go into 6.1.0 or the next release?** The release is paused before main.
   - (a) Into 6.1.0. Cost: two new issues, about a day, and another CI cycle on JarlSkill.
   - (b) Next release. Cost: 6.1.0 ships a Jarl whose own skill tells agents to write concurrently through a tool that loses concurrent writes.
6. **Clean up the current loop's record now?**
   - Commit the 35 untracked issue files (197-231).
   - Mark the ruling on working without subagents as superseded in decisions.md.
   - Link 097 to its ruling and set it done.
   - Move 021, 073 and 100 out of "in-progress".

   Doing it now by hand costs a few minutes but uses hand edits, which the skill discourages. Waiting for B5, B9 and A9 keeps the record misleading until then.
7. **May `tips` call `gh`?** (B4)
   - (a) Yes, optionally, degrading to "ci: unknown". Cost: one external-tool code path to test.
   - (b) No; CI stays in the release skill. Cost: the dry-run G1 class of miss (Horde red after 177, found only at the dry run) stays possible.
