# Jarl: one store of state (design note for issue 332)

The design note issue 332 asks for before any code: which of the two stores (the issue files' header fields and the journal, `log.md`) is the state the views and the gate read, and what that costs and changes. Line numbers are those of `skills/jarl/scripts/jarl-lib.mjs` at the release tip of JarlSkill's `release/6.2.0` (`0afdb65`, issues 328 to 331 merged). Measurements were made on a scratch loop built with that tip and on a frozen copy of the 6.2.0 release loop (337 issues, 2,783 log lines, written by Jarl 6.1.0).

## 1. The problem in the code's own terms

### 1.1 Where each fact is read

Every view gets its issues from `parseIssue` (664), which sets `issue.status` from the `**Status:**` header (676) and every header field into `issue.fields`. `loadIssues` (691) and `readLoop` (2563, through `issuesAt`, 696) both hand these objects on unchanged. The done gate gets its facts from `loopEvents` (2516), the one reader of the log, typed by `eventParser` (2480): moves with `from` replayed per issue, lease lines, rows, verdicts, retractions, merges and CI lines.

| Fact | Read from the issue file | Read from the journal | Where they come apart |
|---|---|---|---|
| Status | `statusOf` counts, waiting, in flight, ready, stale (2280-2309); `inFlightRows` (2367); `nextRows` taken files and offers (2214-2221); `cmdQueue` (4080); `cmdList` (1451); `cmdReport` sections and rows (4583-4604); `cmdResume` (4471-4480); `reviewSplit` (2763); `closedGateFlags` selection (2785, 2792); `checkState` skip (2878); `metricsOf` closed set (3017); `cmdClose` (2406, 2412); `cmdArchive` (1150); `leaseProblems` (3843); `cleanUpAfterMerge` packages (1820); `cmdCheck --branch` (3687); `loopRepos` (3793); `doneMark` (3877-3880); `cmdTips` (3990-4009) | `gateWindow` anchor and cut from each move's `from` and `to` (2671); `metricsOf` claims, closes, reopens (3001-3005); `closedGateFlags` `doneAt` (2806) | A hand edit of Status changes every view and none of the gate (probe A) |
| Branch | `carriesCode` (2606), hence the fresh-review rule in `doneRefusalIn` (1648), `inFlightMark` (2355) and `closedGateFlags` (2797, 2808); `branchWorkersOf` (2630); `selfWorkers` (2646); `cmdQueue.branchOf` (4095); `inFlightRows`, `cmdResume`, `cmdReport` (2369, 4475, 4604); `leaseProblems` (3849-3860); `cleanUpAfterMerge` (1805); `branchesIn`, `cmdTips`, `cmdCheck` (3903, 4009-4014, 3687) | `eventParser` reads a lease's branch only when the line names a worker (2491), and no reader uses it for state | Removing Branch by hand turns a code issue into one a coordinator may close (probe C) |
| Worker | `selfWorkers` and `branchWorkersOf` add the file's Worker to the self set (2634, 2645); `inFlightRows`, `cmdResume` (2369, 4475, 4480) | `leaseWorkers` (2618): every worker any lease line ever named | The self set is the union of both, so it only grows; the views print the file's |
| Model | `inFlightRows`, `cmdResume`; `cmdRound` (3655) | `leaseModelOf` (2474), `leaseModels` (3157) for `models` | Same shape as Worker |
| Worktree | `leaseProblems` (3849-3852); `cleanUpAfterMerge` (1823); `branchesIn` (3912) | written on the lease line, read by no one | Ruling `worktree-paths-before-push` made it a machine-local hint, not part of the lease |
| Since | `leaseProblems` idle (3862); `inFlightRows`, `cmdResume` | the stamp of the move line | `cmdSet` takes `stamp()` for Since (1559) and `appendLogLines` takes another (928): two writes can fall in two minutes |
| Verdict and its kind | `issueView` prints the Reviews section and windows it only when its entry count equals the gate's trail (2093) | `gateOf` (2685): every verdict, its kind recomputed stricter by today's names (2700), retractions, the live approve; `reviewSplit`, `inFlightMark`, `cmdQueue`, `cmdReport` read the gate | Already one store for state. The file's section is text: Jarl 6.1.0 wrote none (0 of the 337 files of the 6.2.0 loop carry one, against 349 verdict lines in its log) |
| Evidence rows | `workEvidence` non-empty (1643, 1974); `evidenceRows` for an untracked issue (1644) and for `doneNote` (1689); the numbering `show` prints and `--retract` takes (1939) | `gateOf` rows since the anchor (2714, 2746); `alignRows` (1926) maps file rows to journal lines for a retraction; `retractEvidence` refuses when the counts differ (2046) | Rows deleted by hand still count for the gate; rows added by hand count for `doneNote` and the untracked gate |
| Merged, CI | `mergedOf` (1701): `carriesCode`; `mergeRefusal` for `requires-merged` (1661); `doneNote` (1692); `inFlightMark` (2356); `statusOf` CI pending and red (2311); `cmdReport` (4594, 4602); `cmdTips` (3989-4041); `doneMark` (3888); fallbacks in `closedGateFlags` (2793, 2808), `checkState` (2880) and `metricsOf` (3014) | `lastMerge` (2854) for `checkState` and `doneNote`'s "decided" (1694); `closedGateFlags` merges after done (2807); `metricsOf` (3010) | A Merged line written by hand satisfies a `requires-merged` done gate (the sha must still be in the base) |

### 1.2 What was measured and probed

- On the frozen 6.2.0 loop, the journal and the files agree everywhere the tool wrote both: the replayed status of 337 of 337 issues equals the header; 246 of 246 Merged shas and CI states equal the last merge and CI lines; 250 of 250 Branch fields equal the last lease line's branch; the Worker and Since of the 10 issues in progress equal their lease lines; 254 of 254 row counts agree. The Worker of a closed issue is absent from its file and present in the journal, because `cmdSet` removes the lease fields when an issue leaves a status that holds the claim (1573): the projection of Worker, Model and Since exists only while the claim is held.
- Probe A, hand edit: issue 001 leased on a branch, then its Status edited from `in-progress` to `done`. `status` printed `open 0 · in flight 0 · done 1`, and the line issue 328 added, `closed, gate does not hold: 001 · no --ran/--saw row since it was moved → in-progress; it holds no approve; a code issue done with no merge recorded — repair: jarl.mjs set 001 open …`. The views treat the edit as a close whose gate fails; nothing says the status never moved.
- Probe B, forged journal: `log "002 evidence row · echo forged"`, `log "002 review approve · by r9 (fresh) · forged"`, one free-text note, then `set 2 done`: accepted. The gate already trusts any well-formed line, and the free `log` command (and `record.appendLog`) writes any line.
- Probe C, a field removed by hand: issue 003 leased on `jarl/3-probe`, a row recorded, the Branch line deleted, `review 3 approve --by jarl`, `set 3 done`: accepted. The fresh-review rule reads Branch from the file.
- Horde writes every status, lease, merge, row and round through `record.mjs` (`moveTicket`, `closeMerged`, `ticketEvidence`, `roundTicket` in its `loop.mjs`). Its `editTicket` (loop.mjs:165) writes under the lock, with no Jarl log line, only fields Jarl does not read for state: Team, Files, Boundary proposal, Consumes, Produces, its own `**Evidence:**` header field, No new tests, and the body. Its text-level `setStatus` helper (tk.mjs:336) has no caller. It reads Status back with its own `parseField(text, 'Status')` at about a dozen sites (tick, queue, audit, status, blame, refine, wave, tk).
- Cost of a replay: on the frozen loop `status` takes 0.10 s, `report --json` 0.11 s and `resume` 0.95 s wall time (most of it git), each already reading the whole log at least once.

## 2. The options

### (a) The journal is the record; the header is its rendering

Every view derives status, lease, merge and CI from the same replay the gate uses, and the header fields are what the tool writes beside each line in the same locked call.

- Views: no view changes. The issue objects every view reads are built from the replay in one place (`issuesAt`), so `issue.status` and `issue.fields` already carry the journal's values. Commands that read issues without `readLoop` (`nextRows`, `cmdClose`, `cmdArchive`, `cmdCheck`, `cmdBranches`, `cmdImport`, `cmdSources`, `findIssue` in the writers) read the log once more.
- Merge drivers: the decisions driver is untouched. In the committed mode the log merges by union and is now what status reads: when two branches moved one issue, the line that lands last after the union decides, which is the order the gate already replays. The issue file, which has no driver, conflicts on its Status line and is resolved by hand; a resolution that differs from the union is reported, not believed.
- Horde and other composers: no change for correctness, because no derived field is written outside record operations. Horde's own `parseField` readers still believe a file; that is Horde's to change (section 5).
- Readers by hand: the header is still written, so a reader sees what the tool sees. Editing the header no longer changes the record; the edit is printed as a disagreement until it is settled.
- Record format: no step (section 6).
- Performance: the replay is linear in the log and the events are already in memory for `readLoop`. One extra parse for the standalone loaders.
- Frozen earlier reader: it reads the header, which the tool writes as before, so it reads the same values on every loop moved through the tool.
- What Jarl will not grow: no command, flag, profile key or file; one refusal (`log` refuses an event-shaped line) and one derivation, inside "records, derives and displays".

Variant (a′), the header dropped from the files: the 6.1.0 reader would read every issue as `open`, Horde's readers would break and a reader by hand would lose the status. Rejected.

### (b) The issue file is authoritative; the journal is its audit

The views keep reading the header; a check reports every transition with no line.

- The gate cannot move to the file: its windows need order (the anchor and the cut of `gateWindow`, approves spent by a later round, restart or changes, the self set across takeovers), and the file has none (Since is per lease, review entries carry a day, rows carry nothing). So the gate keeps replaying the journal and the record keeps two stores, with an auditor between them.
- Probe A then stays believed: status counts the issue done and the audit names the missing line. Acceptance line 2 of issue 332 (status and resume do not count it done) fails.
- Merge drivers: an authoritative store with no merge driver; mergeable issue files would need a driver per header field, which is growth.
- Horde, readers, format, performance and the frozen reader: unchanged. The forged-journal hole of probe B stays open for the gate, and probe C stays open.

### (c) The file for the current value, the journal for history and windows, one reconciling function

This is the design as it stands plus the reconcile that issue 251 would add: every disagreement is reported, the views believe the file and the gate believes the journal.

- It fails acceptance line 2 for the same reason as (b), and it keeps `carriesCode`, `mergeRefusal` and `inFlightMark` on the file (probe C, a hand-written Merged). The reconcile only names the symptom; which value a view prints still depends on which function asks.

## 3. The choice

**Chosen: (a), with two bounded fallbacks and a report.** The journal is the record for every fact the gate reads or the tool writes a line for: Status, the lease (Branch, Worker, Model, Since), Merged and CI, rows and verdicts. The header fields Status, Branch, Worker, Model, Since, Merged and CI are its rendering, written by the same call. The file stays the only home of everything the journal does not record as state: the title, Kind, Priority, Tier, Tags, Files, Repo, After, Found by, Source, Where, Resources, the profile's own fields, Worktree, and the text of every section.

The two fallbacks: an issue the journal does not hold (no filing line and no move, `tracked: false` as the gate already says) reads its header, and is reported as not in the log; and Worktree reads the file, because ruling `worktree-paths-before-push` keeps it out of the lease and the 6.2.0 loop's lease lines are being rewritten to its last segment (issue 284).

**Rejected: (b) and (c).** Both leave the gate on the journal, so neither has one store; both fail the acceptance of issue 332 on probe A; and both keep the fresh-review rule and the merged gate readable from a hand edit (probe C). (a) is the only option that removes the disagreement at the root while leaving every byte a tool-moved loop prints unchanged, because the header the views read today is already, measurably, the journal's rendering.

Why the journal and not the file wins: the gate needs order and the journal is the only store that has it; the journal is append-only and merges by union without a driver; and the gate already trusts it (probe B), so making the views trust it too adds no new surface. It does mean that a well-formed line written into `log.md` by hand moves the views as it already moves the gate. That is closed for the tool's own `log` command (section 4), and reported for edits of the file itself by issue 251's strict parse; a forged line that parses cleanly cannot be told from a real one, and the note does not claim otherwise.

## 4. What changes and what does not

### 4.1 The derivation

One pure function in the log-reader section, `issueState(profile, events)`, folds one issue's typed events, mirroring what `cmdSet` and `cmdMerged` write:

- `status`: the `to` of the last move; else `profile.initial` after a filing; else none (untracked).
- On a move into a status that holds the claim: `since` is the line's stamp; a named worker replaces `worker`, and `model` becomes the line's model or none (a new worker named without a model does not inherit one, 1567-1569); a model named without a worker replaces `model` alone; a named branch replaces `branch`. On a move into any other status: `worker`, `model` and `since` become none and `branch` stays (`cmdSet` removes `LEASE_FIELDS`, never Branch, 1573).
- `merged`: the last merge line's sha and repository; `ci`: that line's CI, or none when it named none (1770), replaced by any later `<id> CI <state>` line.

`eventParser` gains one additive key: a move into a claim carries `branch` whenever the line names one, with or without a worker (today it is read only inside a worker's lease, 2491). No line kind and no grammar is added.

`issuesAt(recordDir, profile, events)` applies it: for a tracked issue it writes the folded values into `issue.status` and the existing keys of `issue.fields` (in place, so key order and JSON stay the same; a key absent from the fold is removed, a key absent from the file is added only when the fold has a value), and keeps the header as read in a non-enumerable `issue.onFile`. `readLoop` passes the events it already read; `loadIssues` and `findIssue` read the log themselves. `parseIssue`, a function of the text alone, is unchanged.

`cmdSet` takes one stamp for Since and for its line (`appendLogLines` takes an optional stamp), so the two can no longer fall in two minutes.

### 4.2 The report

One function, `recordDisagreements(loop)`, compares `onFile` with the fold for the seven rendered fields, and lists untracked issues. Each disagreement is one line, printed by `status` and `resume` (and under the header by `show <id>`), and is a `disagreements` array in `status --json` and `resume --json` present only when it is not empty:

`record: 001 Status reads done in the file and in-progress in the log, which is the record — settle: jarl.mjs set 001 in-progress (the file follows the log) or jarl.mjs set 001 done (the move, through its checks)`

The settling command per field, all of them existing commands: Status, `set <id> <status>` (the log's value rewrites the file; the file's value is a move through the gate); Since, `set <id> <status>`, which stamps both; Branch, Worker or Model, `set <id> <status> --branch|--worker|--model <value>`; Merged, `merged <id> --sha <sha> --keep`; CI, `merged <id> --ci <state>`; an untracked issue, `set <id> <status>`, after which the journal holds it. A write that does not own a field never re-renders it, so a hand edit stays visible until someone settles it.

Verdicts are not compared with the Reviews section (older loops have none, and the section is text). Row counts are not compared here: the row's state is already the journal's, and where an entry belongs is issue 333's to decide.

### 4.3 The journal's own door

The free `log` command and `record.appendLog` refuse an event-shaped line: one that `parseEvent` types as anything but `other` (a filing, a move, a round, a verdict, a retraction, a row, a merge, a CI line, a body change). The refusal names the command that writes that line. Every line a reader of state reads is then written by its own command, with its own checks.

### 4.4 Behaviours that change

- A hand edit of Status, Branch, Worker, Model, Since, Merged or CI on a tracked issue changes no count, mark, offer, queue row, report row, landing banner, metric or gate decision; it prints one disagreement line in `status`, `resume` and `show`.
- The fresh-review rule and `requires-merged` read the journal's Branch and Merged: probe C refuses, and a hand-written Merged no longer closes an issue under a composer's merged gate.
- `log` and `appendLog` refuse event-shaped lines: probe B refuses at the first forged line.
- A lease line naming a branch and no worker now sets the branch the views show (the file already showed it; the journal did not).
- After a committed-mode merge in which both branches moved one issue, the views follow the union order of the log, and a hand resolution of the issue file that differs is reported.

### 4.5 Behaviours that do not change

- Every byte any view prints on a loop moved only through the tool: the fold equals the header there, measured above on the 6.2.0 loop and tested as the oracle in section 7.
- Every file write and every log line the tool makes, except that Since and its line share one stamp.
- The done gate's decisions on a tool-moved loop, its windows, kinds and retractions; `gateOf` is untouched.
- The decisions merge driver, the union merge of the log, the lock and the atomic writes.
- `RECORD_API`, every export of `record.mjs`, its parameters and `opts` keys.
- Horde's reads of the raw text, because the header is still written.

### 4.6 Invariants true by construction

- I1: for every tracked issue, every view and the gate read one value of status, lease, merge and CI, because they read one issue object built from one fold of one parse of the log.
- I1a: no edit of an issue file changes the record's state; it is either the tool's rendering (agreeing) or a reported disagreement.
- I1b: every state line in the journal written through Jarl was written by the command that owns it, with that command's checks.
- I1c: every fact has one home: the journal for the state above, the file for the plan and the text.

What stays outside construction, and is said so: a well-formed line written into `log.md` by hand, which only issue 251's strict parse and a reviewer can catch.

## 5. Horde and the record contract

Horde keeps working through record operations alone today: every derived field it touches goes through `setStatus`, `recordMerged`, `addEvidence` and `addRound`, and `editTicket` writes only fields that stay the file's. Nothing in Horde has to change for its missions to read and print as before.

In `record.mjs` nothing is exported, removed or re-shaped, and `RECORD_API` stays `jarl-record/1`. What is added is behaviour and its documentation: the header comment says that `loadIssues` and `findIssue` return the record (status, lease, merge and CI from the journal) while `parseIssue` reads the text alone; that `appendLog` refuses an event-shaped line; and that `statusData` and `resumeData` carry `disagreements` when the files disagree with the log. `record-contract.test.mjs` is not edited and stays green: its `appendLog` call logs `an event`, and its `findIssue` checks read loops moved through the library.

What Horde changes at its next vendoring (issue 326):

1. Read status through the record (`loopTickets()` or `R.findIssue(...).status`) instead of `parseField(text, 'Status')` at its dozen sites, so a hand edit is not believed in Horde either.
2. Remove the unused text-level `setStatus` helper (tk.mjs:336), so no path in Horde can write Status by text.
3. Never pass an event-shaped line to `appendLoopLog` (its two current callers log a profile change and a ruling written into a graph log, both typed `other`).
4. Add to its `jarl-contract.test.mjs`: an `editTicket` write of a Horde field gives no disagreement; an `editTicket` write of Status gives one and changes no count of `R.statusData`.

One risk is Horde's own: `refreshProfile` adds a top-level key a stored profile lacks; if that key is `initial`, every issue that never moved replays into the new initial status and is reported as a disagreement. Horde's profile should keep `initial` stated from the mission's first day.

## 6. Migration and the record format

None to the files: no file is rewritten, no line is added, nothing is renamed. The first read of an existing loop prints what it printed, byte for byte, wherever the tool wrote both stores, which on the 6.2.0 loop is every issue.

No format step. The record format is raised only by a write a reader on the base would misread silently. This change adds no write: every header field is still written beside its line, so the frozen 6.1.0 reader reads, on any loop this Jarl writes, the values this Jarl derives. A loop whose files a person edited is read differently by the two (the old one believes the file), but that file was not written by this Jarl, and the old reader read it the same way before. `format-marker.test.mjs` stays green unchanged; a test in `one-store.test.mjs` runs the frozen reader's `status` and `list` over a tool-moved loop and compares its counts with this Jarl's.

## 7. Implementation plan

Before the first commit: copy the 6.2.0 loop to a scratch directory and write its golden outputs with the base, the release tip (the `live-loop.test.mjs` set: status, resume, next, report, models, list, tips, queue, branches, text and JSON). The oracle of every commit is the suite (`cd skills/jarl/scripts && timeout 600 npm test`) and `live-loop.test.mjs` with `JARL_LIVE_LOOP` and `JARL_LIVE_GOLDEN` set to that copy, recorded as a row. `tips` and `branches` read git, so the copy's goldens are taken and compared on the same machine within the same hour.

1. **The fold.** `issueState` and the additive `branch` on claim moves. Test: a scripted loop through every lease form (worker and model, worker alone, model alone, branch alone, bare re-lease, release, takeover), merges with and without CI, CI alone, under the built-in profile and a Horde-shaped one, asserting after each step that the fold equals the parsed header; and, with `JARL_LIVE_LOOP` set, that it equals the header for every issue of the copy. No view changes, so the goldens hold.
2. **One stamp.** `cmdSet` passes its `since` to `appendLogLines`. Test: Since equals its lease line's stamp after every move of step 1's script.
3. **The views read the record.** `issuesAt` applies the fold, `readLoop` passes its events, `onFile` is kept. Tests that fail on the base: probe A (status, resume, list, next, queue and report count 001 in progress), probe C (`set done` refused for the coordinator approve), a hand-written Merged under `requires-merged` refused. The goldens hold byte for byte; the frozen reader's counts equal this Jarl's on a tool-moved loop.
4. **The report.** `recordDisagreements` and the lines in `status`, `resume` and `show`, the JSON key only when not empty. Tests: one line per field kind naming the disagreement and its settling command; running that command leaves no line; the probe-A line is exactly one; the copy prints none.
5. **The journal's door.** `log` and `appendLog` refuse event-shaped lines. Tests: probe B refused at its first line, every typed kind refused, a line about the loop and a ruling line accepted; `record-contract.test.mjs` unchanged and green.
6. **A composer's flow.** `one-store.test.mjs` drives a Horde-shaped profile (statuses set by the record, `requires-merged`, approve none) through `newIssue`, `setStatus` with a lease, `addEvidence`, `recordMerged`, `setStatus` with a base and `addRound` alone, and asserts that `statusData`, `resumeData` and `gateOf` agree on every issue; a `withLock` plus `writeAtomic` edit of a declared field gives no disagreement and one of Status gives one.
7. **The words.** SKILL.md states the source once, in the present tense, where the record is described (after issue 337's split, in the file that holds the record chapter): "The log is the record: an issue's status, lease, merge and CI, its rows and its verdicts are what its lines say. The header fields are the tool's rendering of them, written in the same call; a header that disagrees is reported by status, resume and show, and never believed." The other places that restate the rule link to it; `record.mjs`'s header comment, the help of `status`, `resume`, `show` and `log`, and the changelog say the same.

### Risks and how each is detected

| Risk | Detection |
|---|---|
| An older loop where the two stores differ (a Since across a minute, a reason holding ` · worker ` written before issue 320, a merge recorded without a line by an older Jarl): views change and disagreements appear | The golden comparison on the 6.2.0 copy (measured zero today); the report run over frozen copies of the 6.0.0 and 6.1.0 loops before step 3 lands, every line explained or filed as an issue |
| The fold misses a write path of the tool | Step 1's script and step 3's goldens; any path missed shows as a disagreement on a loop moved only through the tool, which step 6 asserts is empty |
| A composer writes a derived field by text | Step 6 for the shape; Horde's contract test (section 5) for Horde itself |
| A union merge reorders two moves of one issue | Reported as a disagreement with the hand-resolved file; a committed-mode test merges two branches that moved one issue |
| Cost of the extra parse | `time` of status, resume and report on the copy before and after, recorded as a row; more than 20% slower is a finding |
| The refusal of `log` blocks a line someone relied on | The suite (one test calls `log` with prose); Horde's two callers checked above |
| A profile's initial changes after filing | A burst of Status disagreements of one pair, all on issues that never moved |

## 8. What this means for issues 333 and 251

**Issue 333 (Proof and Notes).** It follows the same rule: what the gate reads lives in the journal, and the file holds its text under headings. Proof is the journal's row lines (and the attachments of issue 321, by their lines) rendered under `## Proof`; Notes are file text with no state. The merge record 333 places beside Merged and CI is the journal's merge line, which already carries `check <ran>` and `landed red, cause <id>`, rendered into the header; the merger's check stops being written as an `evidence row` line (`cmdMerged` calls `cmdEvidence`, 1766) and so can never be counted as the worker's proof. How 333 reads the rows of an existing loop, where the merger's check is an ordinary row line, is 333's to decide; with 332 that decision is made in one place, the fold, not in every view. 333 changes the file layout, so a 6.1.0 reader that looks for `## Evidence` would misread a split issue: 333 raises the format, and 332 does not.

**Issue 251 (verify).** Its consistency check of the store becomes `recordDisagreements` run over every issue, plus the strict parse of every reader; it needs no comparator of its own and adds no grammar. Its remaining work is what 332 cannot construct: lines in `log.md` that parse as events but could not have been written by their command (an id with no issue file, a verdict or row line with no matching entry in the file, a line out of date order that only a hand could have placed), the root commits of declared repositories, and the rulings cited by open issues.
