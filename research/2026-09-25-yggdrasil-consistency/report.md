# Yggdrasil 6.1.0: whole-system consistency after the night of fixes

## 1. Verdict

The gate itself holds on release/6.1.0 at 65bfb396:
- The self-check is green: `yg check --no-approve` reports PASS on 505 nodes, 1808/1808 files and 6647 pairs.
- The schema register in `family-contracts.md` matches the source in both directions.
- The "executes no repository code" rows of the trust table held under a marker test on ten commands.

Two things stand out:
- **The surfaces disagree where they meet.** The overnight fixes made each command's output mostly consistent with itself. What still disagrees is the guidance agents act on: the `next:` line, `yg prime`, the glossary and the portal. The Next contract under-states what `yg check --approve` bills (1 reviewer pair announced, 3 pairs and 9 calls billed). It points the most common adoption error at the wrong file (`next: edit src/orphan.ts` for an unmapped file). The always-loaded protocol tells agents to run the paid fill without asking, while the CLI says to ask first.
- **The guards are too narrow to catch this kind of drift.** Most of them are enumerated lists that have gone stale:
  - the retired-terms test matches 22 phrases;
  - the portal's lock-writer ban names three functions that do not exist and misses the two that 6.1.0 added;
  - a rule declares `errs: over` while missing 95-108 hand-written plurals;
  - a reviewer rule prescribes the output contract that two enforced script rules now forbid, and it drew 612 paid reviews that way;
  - one earlier finding (m11), marked done in issue 189, still reproduces.

None of this corrupts a verdict. All of it misleads an agent or a reader. My recommendation is to fix the three high items and the cheap documentation contradictions (A4, A9) before tagging, which is about 2-3 days of work. Most of the rest can wait for the next release, apart from two free rule fixes (B2, B6 option b) and the 189 re-audit. Where to draw that line is the owner's call.

## 2. Top recommendations (ranked)

1. **Make the Next contract tell the truth about cost (A1).** Work out FillStep from every unverified, non-draft pair the named command would fill, not only error blocks. State reviewer cost as pairs and calls, and add `reviewerCalls` to `next.cost` as an additive field.
   - Why: the one line agents are told to act on currently under-bills a paid step by 3x in a simple fixture.
   - Effort: about 1 day.
   - Done when: an e2e test on three fixtures (script-only, mixed, advisory-only) shows `yg check --json`.next.cost equal to `yg check --approve --dry-run --json`.dryRunBudget.
2. **Get a ruling on consent for paid fills, then encode it once (A2).** Put it in the glossary "approval" entry and prime lines 7, 189, 193 and 230. Export fillStep so that `context`, `aspects --health` and `impact` stop printing a bare `yg check --approve`.
   - Why: prime says "Do not defer it". The CLI says "paid — ask the user to approve it first". Three other commands name the paid fill with no cost at all.
   - Effort: the ruling, plus about half a day.
   - Done when: a test scans every `next:`/`then:` line and finds no unannotated paid `--approve`, and a prime test asserts the missing-next-line rule.
3. **Stop deriving the next step by parsing English (A3).** Stopgap now: for coverage codes, emit `yg context --file <first>` as the step. Next release: give emitters an `IssueMessage.step` field and delete the `namedFile` regex and the verb heuristic.
   - Why: the most common adoption error tells the agent to edit the unmapped source file instead of a mapping.
   - Effort: the stopgap takes hours; the full model is M (1-2 days).
   - Done when: a table test over every registered code shows that `next.command` runs, or that `next.target` names a graph file (never a source file for coverage codes).
4. **Make the always-loaded texts agree, and pin them with tests (A4, A9, A6, A7).**
   - A4 (status and advisory): fix glossary.js and prime:25/109, including the prompt-too-large exception, and generate prime's status paragraph from the glossary.
   - A9 (trust model): add `yg simulate` to the trust table and fix the "on every check" wording in pack help and packages.md.
   - A6 (taxonomy): add glossary entries for "stale" and "finding / block".
   - A7 (covered): make the headline "covered" leave out excluded files.
   - Why: agents read prime and the glossary as law, and the glossary promises one meaning per word.
   - Effort: hours each, about 1.5 days in total.
   - Done when: a string-equality test covers the glossary and prime sentences, and a table-driven marker test backs the trust table (it turns issue 199's ad-hoc experiment into a guard).
5. **Replace enumerated guards with inverted or registry-based ones (B2, A5, A10, B6).**
   - B2 (lock-writer ban): turn it into an allowlist of readers. It is a script rule, so it is free.
   - A5 (retired-terms test): widen it, with an allowlist for flags and JSON keys. Map the frozen `/1` machine tokens (`llm`, `deterministic`, `approved`, `aggregate`) in the glossary.
   - B6 (plural counting): correct `errs: over` to `errs: under` now, for free.
   - A10 (error codes): build a complete code registry with a test that every emitted code is registered.
   - Why: each of these is a list that silently fell behind 6.1.0.
   - Effort: B2 and B6(b) take 1-2 hours and are free; A5 about 1 day; A10 1-2 days.
   - Done when: a scratch file importing `writeLockSync` is refused; the widened term guard is green; the registry-completeness test is green.
6. **Keep one engine for Next and one place that writes CheckResult (A8, B3).**
   - Delete `core/check-suggested-next.ts`, which is computed up to three times per run and then overwritten.
   - Move the reasonless-suppress warning into runCheck behind an injected option, and move the suppression scan out of `portal/api` into core.
   - Add a mechanical rule: outside `core/check*.ts`, no module writes to `result.issues` or `suggestedNext`.
   - Why: this is the post-runCheck pattern behind M9 (the portal/check coverage-count mismatch), back again through a new warning. The same repository shows a warning in `yg check --json` that the portal worklist lacks.
   - Effort: about 1.5 days, plus a paid re-review of the moved files. Run `--dry-run` first.
   - Done when: a parity test on a fixture shows the `yg check --json` issue codes equal the portal worklist codes, and no command imports `portal/api/*`.
7. **Add a cross-rule consistency test and rewrite the stale reviewer rule in one batch (B1, B10).** Every `satisfies-*` drill case must pass every enforced script rule attached to the type it simulates.
   - Why: it catches the next case of one rule contradicting another for free. Batching the content.md rewrites (cli-command-contract ~30 pairs, diagnostic-logging 64, what-why-next 135) means paying the re-review once.
   - Effort: 2-3 hours of text, plus a paid re-review. Run `--dry-run` first.
   - Done when: `yg drill --aspect cli-command-contract` passes and the corpus test is green.
8. **Re-audit issue 189 against live output before tagging (A11).** Also consider a process rule: an issue closes only when its original repro is re-run against the built dist.
   - Effort: 1-2 hours.
   - Done when: every m-item in the 2026-09-23 CLI-comm report has a live re-run recorded in 189.

## 3. Findings table

| id | kind | priority | title | where | proposal |
|---|---|---|---|---|---|
| A1 | defect | high | Next cost counts error blocks only: the paid step is announced as 1 pair while it bills 3 pairs / 9 calls | cli/check-render-views.ts:200, :309, :347; docs/cli-reference.md:366 | Compute FillStep from all unverified non-draft pairs; add `reviewerCalls`; parity test against dryRunBudget |
| A2 | inconsistency | high | Prime says run `--approve` unprompted; the CLI says ask first; context, health and impact print a bare paid fill | prime lines 7, 189, 193, 230; glossary.md:203-205; check-render-views.ts:375; cli/aspects.ts; formatters/context-node.ts | Owner ruling; encode it once; export fillStep to the other commands; next/then scan test |
| A3 | defect | high | Next target is parsed from prose: an unmapped file gives `edit src/orphan.ts` | check-render-views.ts:158, :248-255; core/check-coverage-phase.ts | Stopgap `yg context --file <first>`; then `IssueMessage.step` as data |
| A4 | inconsistency | medium | Glossary, prime and knowledge disagree on who sets status, whether advisory can block, and "rendering only" | glossary.md:73, :85; prime 25, 71, 109; knowledge aspect-status; aspect-status.md:41-46 | Correct glossary.js and prime from the knowledge text; generate prime from the glossary; string test |
| A5 | inconsistency | medium | Retired vocabulary survives in the portal, validator messages, JSON and topic ids; the guard matches only 22 phrases | no-retired-terms.test.ts:36-58; portal views; aspect-contracts.ts:103-151; context-node.ts:123 | Machine-token lines in the glossary; fix ~10 strings; widen the guard; knowledge aliases |
| A6 | inconsistency | low | "stale" is a verdict and a cause and also "pruned"; an infrastructure failure is labelled "Refused"; the draftSkipped sentence contradicts itself | check-json.ts:267-273; cli-reference.md:312-322, :741; the-lock.md:167; prime 79 | Glossary entries; document the verdicts split; reword the prune line and prime:79 |
| A7 | inconsistency | medium | "Covered" counts excluded files (a fresh init shows 4/7 with 0 nodes); the JSON split is null without type-level; Horde works around it | check-coverage-phase.ts:137-145; check-json.ts:262-264; Horde node.mjs:680-686 | Headline (owned+typed)/(files−excluded); always emit the split; Horde drops its fallback |
| A8 | inconsistency | medium | Two Next engines; a dead rule gives 2 warnings plus 2 nominations; unknown rule id gets 6 wordings and 2 codes; `uncovered-hot-spot` misuses "covered" | core/check-suggested-next.ts; check-render-views.ts:555; checks/aspects.ts:287; aspect-contracts.ts:390; advise-nominations.ts:1051, :782 | Delete the old engine; one dead-rule finding; shared `aspectNotFound`; rename to `unguarded-hot-spot` with an alias |
| A9 | inconsistency | medium | The trust table omits `yg simulate`, which runs check.mjs; prime calls it read-only; pack help and docs say plain check runs package code | the-lock.md:94-103; prime 144; cli/pack.ts:334; packages.md:13-19 | Add a simulate row; reword prime, pack and packages; table-driven marker test |
| A10 | opportunity | low | No error-code registry: ~70 of 143 tokens undocumented; one fix prints a literal `\n` | output-diagnostic.ts:108; io/aspect-parser.ts:843 | Complete REGISTRY plus a completeness test; generate the docs table; fix `\n` now |
| A11 | risk | low | m11 is marked fixed in issue 189 but still reproduces: "jumps 2 levels … no declared contract" for declared siblings | cli/structure.ts:140; core/graph-metrics.ts:116-150 | Reword to "no named port"; don't count siblings as tunnels; re-audit 189 |
| B1 | inconsistency | medium | The reviewer rule cli-command-contract prescribes what two enforced script rules forbid; its own satisfies case is refused | aspects/cli-command-contract/content.md:7-9, 16-17, 29; drills/satisfies-stdout-trycatch | Rewrite around what no script checks; cross-rule satisfies-corpus test; batch the paid re-review |
| B2 | defect | medium | The portal lock-writer ban misses `writeLockSync` and `createVerdictWriter`; 3 of its 6 names do not exist | aspects/portal/no-lock-writer-import/check.mjs:22-35 | Invert to a reader allowlist; ban fill-writer wholesale; new drill cases (free) |
| B3 | defect | medium | `yg check` appends a warning after runCheck in the CLI body, so the portal worklist diverges; the gate imports the portal facade | cli/check.ts:16-17, :109-143, :631/:693/:730; portal/engine-api.ts:172-196 | Move the suppression scan to core; emit inside runCheck; rule against writing CheckResult outside core |
| B4 | opportunity | low | 140 declared relations have no code edge (66 non-test); fan-out allowances were raised on nodes carrying them | model/**/yg-node.yaml; relations/pass.ts:139-151, :617-619 | Prune 66 now (free); lower the allowances; later an advisory `relation-declared-unused` |
| B5 | defect | low | Dead exports and a duplicated `count()` left by the 188-192 and 230 merges; dead re-export shims | check-render-header.ts:178; check-render-groups.ts:619; group-issues.ts:109; output.ts:281; fill-text.ts:17; adopt.ts:81 | Delete; use utils/count; migrate importers; dead-export CI gate |
| B6 | inconsistency | low | output-through-layer claims `errs: over` but misses 95-108 ternary plurals, including pair counts | aspects/output-through-layer/check.mjs; fill-llm-phase.ts:187 | (b) now, free: `errs: under` plus a scoped description; (a) later: AST pattern plus conversion |
| B7 | risk | medium | The command-support type holds 7.3k lines of domain logic under hygiene rules only; adopt-transaction swallows a failed restore | yg-architecture.yaml:67-85; adopt-transaction.ts:305-307 | Owner decision: split the type or attach diagnostic-logging; log the swallowed restore now |
| B8 | inconsistency | low | Stale node descriptions; nothing checks descriptions against code | model/cli/core/pair-inputs, migrator-runner, check-render-header, llm/subprocess-base, tests/.../fill | Fix 5 descriptions; advisory script rule: backticked identifiers must exist |
| B9 | opportunity | low | 12 relation allowances in the architecture are unused, including upward reaches (ast-adapter → engine, relations-adapter → llm-shared) | yg-architecture.yaml relation blocks | Owner-confirmed removal; check detected edges first (type-only imports create edges since 230) |
| B10 | inconsistency | low | Three more rule texts contradict the code or other rules | no-direct-console/yg-aspect.yaml:2; diagnostic-logging/content.md:15; what-why-next/content.md:5 | Retire or reword no-direct-console (owner); batch the content.md edits with B1 |

## 4. Details for high-priority items

### A1: Next under-states the cost of the command it names

- **Evidence:**
  - Scratch project `$TMPDIR/consist-c` holds 1 enforced prose pair, 2 advisory prose pairs, 1 stale script pair and 1 advisory script pair not yet run. Consensus is 3.
  - `yg check` prints `next: yg check --approve --only-deterministic  (unverified — 1 script pair · free)` and `then: yg check --approve  (1 reviewer pair · paid — ask the user to approve it first)`. The JSON gives `next.cost {free:1, reviewerPairs:0}`.
  - `yg check --approve --dry-run` on the same tree prints `fill  5 pairs · 2 script (free) · 9 reviewer calls (consensus included)`.
- **Cause:** `isFill` (check-render-views.ts:200) requires `severity==='error'`, and `fillStep` sums only those blocks. Prime:81 says `--approve` fills every unverified pair, advisory included. cli-reference.md:366 says `cost` is "the whole command, never one block's share of it".
- **What issue 228 already did:** it fixed free-vs-paid but not scope. This is not a duplicate, and it was re-run by the verifier.
- **Fix:** derive the counts from `pairs[]` (kind plus verdict), classified the same way as the dry run. Show reviewer cost as `3 reviewer pairs · 9 calls · paid`. Add `reviewerCalls` as an additive field. Leave `remaining` unchanged, since it counts errors by design.
- **Cost:** about 1 day in check-render-views.ts plus tests.
- **Acceptance:** the three-fixture parity test against `dryRunBudget`.

### A2: The protocol and the CLI disagree about consent, and about the `next:` line

- **Evidence, prime against itself and the CLI:**
  - Prime line 7 says every report "ends with a `next:` line". `$TMPDIR/consist-b` (1 error block, 4 warnings) prints none, because of `repeatsFix = pool.length === 1 && …` (check-render-views.ts:375). That behaviour is documented only in cli-reference.md:544 and knowledge cli-reference:87.
  - Prime:189 says "run `yg check --approve` exactly ONCE at the end … Do not defer it", and prime:193 says "resolve every unverified pair".
  - Prime:230's list of things needing the user's signature (suppress, architecture, status, review_by, advise) leaves out paid fills. So does the glossary's "approval" entry.
  - Meanwhile the CLI prints `paid — ask the user to approve it first` with `requiresUser:true`.
- **Evidence, other commands:** `yg aspects --health` ends `next: yg check --approve` with 3 reviewer pairs pending. `yg context --node cart` ends `then: yg check --approve`. `yg impact --aspect prose-adv` says "then run yg check --approve". None carries a cost or an ask.
- **Why it is high priority:** this is the always-loaded agent protocol contradicting the tool on money. `decisions.md` holds no ruling on consent for paid fills.
- **Fix:** get Krzysztof's ruling (section 6, question 1), then write it in one place: the glossary "approval" entry, plus prime lines 189, 193 and 230. Replace line 7 with the real rule: "when there is one error block, its fix is the step". Export `fillStep` and its cost wording, and use them in context, health and impact.
- **Cost:** the ruling, plus about half a day.
- **Acceptance:** a scan test finds no paid `--approve` without the annotation while reviewer pairs are pending, and a prime test asserts the missing-next-line rule.

### A3: Next targets the wrong file for unmapped sources

- **Evidence:**
  - `$TMPDIR/consist-a` and `$TMPDIR/consist-i` (one unmapped file) print `next: edit src/orphan.ts  (unmapped)`, with JSON `next.target.file = "src/orphan.ts"` and `command: null`. Renaming the file gives `edit src/zz.ts`.
  - With four unmapped files, the output is the whole fix sentence: `next: Add each file to a node's mapping, or create a new node for it — yg context --file src/o1.ts lists candidate owners  (unmapped)`.
- **Cause:** `blockAction` matches a leading English verb (`/^(?:fix|edit|…|add|…)/`), then `namedFile` (check-render-views.ts:158, :248-255) takes the first path-like token. The fragility described in CLI-comm M9 was not removed; it moved into the renderer.
- **Why it is high priority:** unmapped files are the most common adoption error, and the headline step sends the agent to the wrong file.
- **Fix:**
  - Stopgap for 6.1.0, a few hours: for coverage codes, emit `yg context --file <first>` (read-only, lists candidate owners) with target kind `mapping`.
  - Next release, 1-2 days: add `IssueMessage.step: {command?, target?, verb}`, set by the module that knows the remedy. `Diagnostic.fix.command` already exists at output-diagnostic.ts:30. Delete `namedFile` and the verb heuristic once every T1/T2 code sets a step.
- **Acceptance:** the per-code table test described in recommendation 3.

## 5. What is already good

- **Self-check:** `yg check --no-approve` reports PASS on the Yggdrasil repo itself: 505 nodes, 1808/1808 files, 6647 pairs.
- **Schema register:** `family-contracts.md` matches the source exactly in both directions.
- **One error shape:** `yg-error/1` for `node-not-found` is uniform across node, impact, context and log: one `what`, one `next: yg find`. It is the model A8 proposes for `aspect-not-found`.
- **merge-resolve:** on a real conflicted rebase it wrote the union and pointed at `git rebase --continue`.
- **Trust model "No" rows:** these commands wrote no marker from a marker-writing check.mjs and companion.mjs: `check`, `--no-approve`, `--approve --dry-run`, `context`, `impact`, `aspects --health`, `aspects --json --reach`, `advise`, `structure`, `portal --static`. `marketplace check` parses and does not import.
- **Issue 230 relations:** none of the 104 relations it added is declared-only. The 140 unused relations are older leftovers.
- **Issue 228:** the free-vs-paid split in Next is right. A1 is about scope, not direction.
- **M9 coverage split:** the fix holds. The split now lives in core/check.ts:388. B3 is the same pattern arriving through a different warning, not a regression of M9.
- **Grain:** its vendored relations engine is in sync with Yggdrasil (vendored from 3cedc47f8, with no changes under `relations/` or `model/` since).

## 6. Open questions for the owner

1. **Does an agent need your consent before a paid fill (A2)?**
   - (a) Always ask. The CLI already assumes this. Cost: an autonomous loop, a Jarl worker or a Horde worker stalls at its end and waits for you.
   - (b) Never ask; prime stays as it is. Cost: the CLI's "ask the user first" wording and `requiresUser:true` become false and must change, and spend becomes invisible.
   - (c) Ask above a budget, or when no `auto_approve` or budget is configured. Cost: a small config surface plus docs, but it matches how the release loop actually runs.

   Whichever you pick, the fix is about half a day of text.
2. **What gates the 6.1.0 tag?**
   - (a) Minimal gate: A1, A3 stopgap, A2 text, A4, A9, A11 re-audit, plus the free rule fixes B2 and B6(b). About 2-3 days.
   - (b) Everything medium and above. About 6-8 days, plus paid re-reviews for B1, B3 and B7.
   - (c) Ship as is and file everything for 6.2. Cost: agents keep receiving the wrong cost and target in `next:`.
3. **Architecture changes that need your confirmation under AGENTS.md:**
   - B7: split `command-support` (half a day, plus about 19-40 paid reviewer calls), or at minimum attach diagnostic-logging (cheaper).
   - B9: remove 12 unused relation allowances (30 minutes). Check detected edges first.
   - B10: retire `no-direct-console`, which is redundant with output-through-layer, or reword it.
4. **When do you pay for the reviewer-rule rewrites?** Rewriting cli-command-contract, diagnostic-logging and what-why-next re-bills about 30 + 64 + 135 pairs.
   - (a) Batch all three now, after a `--dry-run` shows the bill.
   - (b) Defer to the next planned re-review. Until then the reviewer keeps judging against text the code no longer follows: 612 reviews at 98% passed in two days.
5. **Is changing the "covered" headline acceptable in a minor release (A7)?** The JSON change is additive: nulls become numbers. The printed ratio would drop, for example from 4/7 to 0/3 on a fresh init.
   - (a) Change it now.
   - (b) Keep the headline and only add the "N excluded" qualifier. That is cheaper, but the number stays misleading.
6. **Should "done" require a live re-run?** A11 shows issue 189 closed on a claim covering m1-m11 that the built dist does not meet.
   - (a) Require every issue that cites a report finding to record the original repro re-run against dist before closing. Cost: minutes per issue.
   - (b) Keep the current practice and rely on synthesis audits like this one.
