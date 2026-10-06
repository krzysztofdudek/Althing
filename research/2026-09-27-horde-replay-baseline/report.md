# Horde replay baseline (run i)

Issue 465 of the release 6.1.0 loop. Written by the replay worker (Opus); saved here by the coordinator because the worker could not write report files. Materials (registered metrics, blind grading pool and key) are in [materials/](materials/).

## 1. Purpose and what was measured

This is run (i) of the replay measurement in §12 of [the family vision design](../2026-09-27-family-vision-design/design.md) (the 6.1.0 ruling that the measurement is a regression check). It records how Horde as it stands on `release/6.1.0` at `bbd50bb` (before issues 445 and 477) performs on a fixed set of closed Yggdrasil tickets whose later defects are known. Run (ii) (Horde after the rebuild) and run (iii) (Jarl with the repository check) compare against this record on the same set, from the same base shas, with the same metrics and operator rules.

## 2. The set

### 2.1 The first set could not run

The set chosen first was 080, 095, 105, 110, 119, 123, 332, 363 and 377. Six of them had follow-up tickets classed `fix-incomplete`, `new-bug`, `doc-drift` or `contract-drift` against their own change. All six have bases before `65bfb3967` (2026-09-25, the 6.1.0 version bump), and a CLI built at those bases reports `6.0.0`. Horde `bbd50bb` refuses such a CLI at the first graph read ("it reports version 6.0.0, and Horde needs 6.1.0 or newer"). The documents Horde reads (`yg-node/1`, `yg-context/1`, `yg-impact/1`) have existed since 2026-09-06, so the refusal is on the version number only. Pointing the old tree at a newer CLI would invalidate the committed verdict hashes (about 5,700 pairs) and need a full paid re-fill, so that route was not taken. The set was re-picked from bases that descend from `65bfb3967`, recorded before any mission of the final set was framed.

### 2.2 The final set

Eight tickets, disjoint from 473–478, 445–448, 431 and 436. 234 and 239 touch `yg advise`, which 476 also extends with a new signal; the concerns differ.

| Ticket | Asked for | Base sha | Merged sha | Known defect | Found by |
|---|---|---|---|---|---|
| 233 | Agent protocol agrees with the CLI on paid fills (consistency A2) | `c659d9d93` | `ba1cc6df0` (batch) | `docs/family-contracts.md` records a `requiresUser` meaning change "after 6.1.0" that never shipped | fresh Opus review, Important; fixed `20c46adb3` |
| 234 | `next` step as data, not parsed from fix prose (A3) | `65bfb3967` | `a06dee420` (batch) | `next` for an unmapped file always exits 1; `next.command` split on spaces | fresh Opus review, Important; fixed `ee5b524db` |
| 239 | One Next engine, one dead-rule check, one unknown-rule wording (A8) | `65bfb3967` | `a06dee420` (batch) | advise class ids renamed without aliases (duplicate tickets in Horde's ledger, `law-audit.test` broken) | same review; follow-up 361 |
| 308 | A stale key is never sent to a newly configured provider; the no-key message tells the truth (B1) | `a06dee420` | `d684a9733` | misleading key message for a keyless provider; key written under a tier a `yg-secrets` override sends elsewhere | review minor, then follow-up 362 |
| 332 | `marketplace check` refuses what `pack add` refuses (M24) | `d684a9733` | `4f00cfe13` (batch) | check passes a package with an ignored `node_modules` when the marketplace is nested inside another git repository | fresh Opus review, Important; fixed `5d27b46f2` |
| 363 | The rule-text hash covers dot files, `drills/` and nested dirs | `4f00cfe13` | `c659d9d93` (batch) | import tracing follows symlinks; imports outside the rule directory stay unhashed | fresh Opus review, Important; follow-up 367 |
| 377 | Dead-export gate in CI; un-export the 64 | `c5cdd8aeb` | `519dc1774` (batch) | `resolveCandidateGroup` made private although Grain vendors that file, so about 320 Grain tests stop loading | fresh Opus review, Important; fixed `55e4ff2c4` |
| 378 | Tests assert on codes and JSON, not prose; ratchet | `73bbebddd` | `9b7fd64f2` (batch) | conversion dropped the "free run makes 0 reviewer calls" invariant; `expectStalePairs` narrower than the old assertion | fresh Opus review; follow-up 405 |

For batch merges the base is the merge base of the batch branch with `release/6.1.0`, and Horde is given only the one ticket.

## 3. Metrics (registered before any run of the final set)

1. **Owner time per ticket (primary).** Questions or approvals the run needed from the client: framing questions the ticket does not answer, charter or stuck asks, chairman-level decisions. The frame's "go" is reported separately; operator repairs of the environment on their own line.
2. **Known defect caught before landing.** The landed tree must not exhibit the known defect, checked by a probe fixed per defect and calibrated on base and history. A mission that lands nothing counts as "not caught".
3. **Red CI after merge.** `scripts/repo-check.sh` plus `lock-history-audit.mjs` on the horde trunk after the last landing, against the same run on the base.
4. **Blind diff grade.** A fresh Opus reviewer sees the ticket and unlabeled, shuffled diffs (Horde and historical) and grades each 1–5 on correctness, completeness, tests and scope.

Operator rules added after the cut stage and before any worker ran or anything landed:
- **Budget:** at most 20 agent spawns per mission; a plan that needs more stops and scores "not landed".
- **Chairman asks the record does not answer:** answered with the narrowest option that keeps the ticket's scope; each one counts.
- **Throttling** (from 14:05, at the coordinator's request): one mission at a time; gate, fast check and single-file runs wait for 1-minute load ≤ 12 and cap vitest at 4 threads; the worker fast check runs `vitest --changed` against the horde trunk. The landing gate still runs the full `repo-check.sh`.

Setup: a scratch clone per ticket in the dev container (`<container home>/wt/replay-465/r<N>`, no remote), a base branch `replay/<N>-base`, one horde `r<N>`; `ygCommand` is the CLI built at the base; the landing gate is `repo-check.sh` preceded by `npm ci --ignore-scripts`; parallelism 1. Architects, heavy classes and the grader ran on Opus; standard and light classes on Sonnet; every spawn had an explicit model.

## 4. Per-ticket results

| Ticket | Outcome | Spawns | Owner asks (+go) | Defect caught | CI after merge | Blind grade (Horde vs historical) |
|---|---|---|---|---|---|---|
| 233 | Stopped after cut: 8 territories after three cut rounds; needs at least 26 spawns | 1 | 1 | not landed | n/a | n/a |
| 234 | Stopped after consult: 4 territories, 17 ticket files, 7 queued | 5 | 2 | not landed (its planned e2e would have caught the defect) | n/a | n/a |
| 239 | Stopped after consult: 6 territories, 18 ticket files, 3 queued | 7 | 5 | not landed (the consultant did plan the old-id alias) | n/a | n/a |
| 308 | **Landed**: 6 tickets, 8 change rounds | 18 | 2 (+1) | **no** | green (base green) | **3.0** vs 4.5 |
| 332 | **Landed**: 4 tickets, 9 change rounds | 14 | 2 (+1) | **yes**; a new over-refusal defect | green (base green) | **3.5** vs 4.5 |
| 363 | Blocked at plan review: all 3 tickets rejected | 5 | 1 | not landed | n/a | n/a |
| 377 | Stopped after cut: 25 territories; 3 single leaves over the cap | 1 | 1 | not landed | n/a | n/a |
| 378 | Stopped after consult: 4 territories, 17 tickets | 5 | 1 | not landed | n/a | n/a |

### 4.1 Probe evidence for the two landed missions

**308.** In a scratch repo, `yg-secrets.yaml` holds an `api_key` for the tier and `init --provider claude-code` is re-run on the same provider. Base `a06dee420`: nothing. Historical `d684a9733`: "Kept the api_key … the reviewer will send it." (the defect). Horde trunk `a213718e0`: "The reviewer will use config.api_key from .yggdrasil/yg-secrets.yaml for claude-code." — the same defect, since `claude-code` sends no key. The blind grader independently found a related wrong hint in Horde's diff. The ticket's core behaviour works: a stale key is removed on a provider or endpoint switch.

**332.** The review-fix e2e property test from `5d27b46f2` (12 variants). Historical pre-review `160d55ebc`: 11/12, failing only the nested-marketplace case (the known defect). Horde trunk `d76be66f2`: 11/12, the nested case passes (caught), but it fails "installs: an ignored node_modules at the root of a git repository" — check refuses a package `pack add` installs. Horde's own landing caught two further real regressions before merge (an uncaught EACCES in `marketplace check` and in `installPackage`).

## 5. Aggregate

- **Landed:** 2 of 8. Six stopped in planning on the territory cap, the ticket node cap and the spawn budget.
- **Owner asks:** 15 across 8 tickets (mean 1.9, range 1–5), plus 2 frame "go"s; the 2 landed missions needed 2 each.
- **Operator environment interventions (not owner time):** a longer gate timeout, `gates.testFile`, throttling, a director ruling to keep `yg-events.llm.jsonl` out of branches, one tool-instructed hand edit of a `Depends on` field, two acceptance rewordings around a `land.mjs` bug, five empty commits to re-run the gate on a new sha.
- **Known defects caught:** 1 of 8.
- **Red CI after merge:** 0 of 2.
- **Blind grade:** Horde below historical on both (mean 3.25 vs 4.5).
- **Cost:** 308 took 18 spawns plus about 12 resumptions and about 7 hours of wall time (landing gate 7–22 min, mean about 11); 332 took 14 spawns plus about 10 resumptions; about 73 spawns in all.

## 6. What drove the outcome

- **The 400 KB territory cap counts rule text and logs.** `root/project-config` (CHANGELOG about 720 KB), `docs/guides` (about 600 KB) and three single leaves fit no territory, so on this repository no Horde mission can write the CHANGELOG or the docs pages.
- **A ticket names at most 2 nodes, and Yggdrasil keeps tests in separate test nodes.** A fix that changes behaviour pinned by tests in two other nodes (363) cannot land in one green merge.
- **Decomposition cost.** One loop ticket becomes 4–25 territories and up to 17 tickets; the spawn budget stopped most missions there.

## 7. Horde defects observed (inputs for 445/450 and run ii)

1. The CLI version gate refuses 6.0.0 although the documents Horde reads exist since 2026-09-06.
2. The territory cap excludes CHANGELOG, docs and the largest leaves; no path for trunk-level files.
3. The 2-node ticket cap with separate test nodes blocks atomic change-plus-test.
4. The scope check ignores the committed `yg-events.llm.jsonl` (owned by no node), so every branch that ran a paid `check --approve` is refused.
5. The gate result is keyed by sha: a flaky red can be retried only with an empty commit, and the gate's output is not kept.
6. `revertBaseRef` reads "red on \`ref\`," in acceptance text as the git ref, backticks and comma included.
7. `review-close` counted Important 0 while an Important finding was logged (twice in 308).
8. No tool edits a ticket's `Depends on` after creation; a dropped producer keeps its port edge.
9. A catch-up merge that only invalidated prose verdicts was counted as a round.
10. `issue.md` Status stays `changes` after the queue item is merged.

## 8. Limits

- Small n: 8 tickets, 2 landings; metric 2 rests on 2 probes.
- The operator is an agent that applied judgement in framing charters, answering asks and giving rulings; lessons it added mid-run made later tickets in 308 and 332 easier than a first pass.
- The budget rule was added after the cut stage and decided five outcomes; (ii) and (iii) must apply the same rule, or (i) must be extended.
- The container was shared with the live release loop; about 38 gate reds under load were confirmed as load and retried with empty commits.
- Historical diffs are path-filtered from batch merges and still contain neighbouring issues; one grader, no repeats.
- 308's second defect (the interactive tier-override path) could not be probed non-interactively.
- `horde.mjs done` and the retrospective were not run; they do not bear on the four metrics.

## 9. Reuse for runs (ii) and (iii)

In the dev container under `<container home>/wt/replay-465/`: base branches `replay/<N>-base` in clones `r<N>`, CLI builds `cli-<base>`, `gate.sh`, `fast.sh`, `testfile.sh`, `waitload.sh`, probes `probe308.sh`, `probe308b.sh`, `probe332.test.ts`, and the base CI logs. The blind grading pool and key are in [materials/grade/](materials/grade/). Runs (ii) and (iii) use the same bases, probes, budget and throttling rules, and add their diffs to the same shuffled pool.

## 10. Is the baseline usable

Partly. Usable: frozen bases, ready clones and CLI builds, calibrated probes for 308 and 332, registered metrics and operator rules, an untouched grading pool. Not usable for comparing Horde's value on known defects: 1 caught of 8, n=2 on quality, and the result dominated by tool failures. Comparing (ii) with (i) is meaningful on owner asks and on the two landed missions; (iii) must run on exactly the same bases with the same rules.
