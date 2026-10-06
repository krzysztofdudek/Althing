# Yggdrasil 6.1.0: architecture and code quality audit

Scope: release/6.1.0 @ c659d9d93 vs v6.0.0 @ f9a922bbc (2026-09-26). One Opus pass, measured with git, rg/wc and throwaway node scripts; spot-checked by the coordinator.

## Verdict

**It is large and very busy, not tangled.**

What is healthy:
- **Dependencies.** I rebuilt the import graph from the code itself (1,907 imports). Between graph nodes there are 839 dependency edges and none of them forms a cycle. All 839 are declared in the graph, and none breaks the type rules in `yg-architecture.yaml`.
- **Cycles.** Only one file-level cycle exists among runtime imports: 5 files, all inside one node.
- **The engine layer.** `core/` never imports `node:fs` or `child_process`, and never calls `process.exit` or `console`.
- **Duplication is low.** Only 10 near-duplicate function pairs cross file boundaries, out of 1,084 functions of 12+ lines.
- **Most of the duplication flagged on 09-23 is gone** (the log gate, the port constant, the portal importing the CLI preamble).

What is actually getting worse:
- **Big functions got bigger.** Since 6.0.0, functions over 400 lines went from 6 to 10, functions over 100 lines from 93 to 113, and files over 600 lines from 26 to 42.
- **The command-support type keeps growing.** It holds 7,788 lines, up from 7.3k on 09-25, with only hygiene rules on it, and the portal now depends on it.
- **The output wording was rewritten about 8 times in 3 days.** The golden output corpus was regenerated 11 times.
- **Exits follow two conventions side by side.** There are 84 raw `process.exit` calls against 87 calls through the helpers.

The "hell of a lot of commits" is really **few, very large commits**:
- 81 non-merge commits since 6.0.0.
- The median commit touches 24 files; the largest touches 324 files and 15.6k lines.
- 282 of the 375 source files were touched.

## Measurements

### Size and shape

| | v6.0.0 | now |
|---|---|---|
| source lines / files | 82,029 / 348 | 97,875 / 375 (+19%) |
| test lines / files | 189,791 / 774 | 208,365 / 852 (+10%) |
| files over 600 lines | 26 | 42 |
| functions over 100 / 200 / 400 lines | 93 / 31 / 6 | 113 / 40 / 10 |

Lines per directory now: core 28,762, cli 20,624, relations 11,294 (was 7,362), io 9,871, templates 8,822, portal 4,475, structure 3,378, utils 3,283, formatters 2,178, llm 2,044, model 1,393, ast 1,345.

Most of the growth is in `cli/` (+3,519 net), the language extractors in `relations/extractors` (+3,190), `io` (+1,759) and `core/` (+1,742).

Lines per declared node type: engine 28.4k, command 12.9k, relations-adapter 11.3k, **command-support 7.8k in 19 files**, knowledge-doc 6.9k.

Largest functions:

| lines | where | at 6.0.0 |
|---|---|---|
| 623 | `relations/pass.ts:233 runRelationPass` | 604 |
| 558 | `cli/check.ts:128` (the check command's body) | 453 |
| 542 | `io/aspect-parser.ts:327 parseAspect` | 620 |
| 536 | `core/fill.ts:167 runFillHoldingLock` (76% of the file) | 388 |
| 503 | `relations/extractors/csharp.ts:651 extractCsharpRefs` | — |
| 433 | `cli/impact.ts:50` (the impact command's body) | 453 |
| 418 | `cli/aspect-test.ts:858 runLlmAspectTest` | 390 |
| 345 | `core/pairs.ts:409 computeExpectedPairs` | — |
| 322 | `core/check.ts:261 runCheck` | — |
| 302 | `io/config-parser.ts:373 parseConfigInner` | — |

### Dependency structure

| measure | value |
|---|---|
| file-level cycles, runtime imports only | 1: the `core/advise-*nominations*` cluster, 5 files in one node |
| file-level cycles, counting type-only imports | 3 (the extra two are 2 files each) |
| cycles between graph nodes | 0 |
| dependency edges between nodes / undeclared / breaking type rules | 839 / 0 / 0 |
| declared relations with no import behind them | 78 of 917 (09-25 counted 140) |
| modules nothing imports | 3, all legitimate entry points |
| most imported | `model/graph.ts` (166 importers), `utils/posix.ts` (85), `utils/debug-log.ts` (79) |
| most importing | `cli/build-context.ts` (40 imports), `cli/aspects.ts` (36), `core/fill.ts` (36) |

At directory level there are two loops, both allowed by the type rules:
- `core ↔ relations ↔ structure`, through `core/allowed-relation-types.ts` and `core/pair-hash.ts`.
- `portal → cli`, through `cli/group-issues.ts` and `cli/rules-artifacts.ts`.

### Change health since v6.0.0

- **Commits:** 132, of which 51 are merges; 124 of them landed in one week (ISO week 39).
- **Commit size:** 22 of the 81 non-merge commits touch 50 or more files.
- **Where the added and removed lines went:** source +24.9k/−8.7k, tests +30.3k/−6.4k, graph +12.0k/−1.5k (58% of the graph lines are `yg-events.llm.jsonl`), docs +8.1k/−1.8k.
- **Files that change most, weighted by size:**

| file | commits since 6.0.0 | lines |
|---|---|---|
| `templates/knowledge/cli-reference.ts` | 26 | 1,806 |
| `core/advise-nominations.ts` | 12 | 1,289 |
| `cli/init.ts` | 13 | 1,112 |
| `core/fill.ts` | 20 | 702 |
| `cli/advise.ts` | 11 | 1,160 |
| `cli/check.ts` | 14 | 687 |

- **Repeat fixes over the whole history:** `cli/check.ts` 37 fix commits, `core/check.ts` 34, `core/fill.ts` 28. Overall, 30% of source-touching commits are fixes.

### Consistency of core patterns

- **Output:** `console.*` is used nowhere; direct `process.std*.write` appears only in `utils` (10) and `cli` (2).
- **Exits:** see finding 4.
- **Errors:** thrown errors are concentrated in `io` and `utils` (95 and 48), and custom error classes are used unevenly. Swallowed errors are few: 14 empty `catch` blocks and 8 `.catch(()=>{})`, each with a comment.
- **Config:** read through one path (`parseConfigDetailed`, used by 7 files). There are 24 separate `*_KEYS` known-key tables across the parsers.

### Tests

- **Split by kind:** unit 119.5k lines, integration 18.4k, **end-to-end 65.3k (31%)**. 177 of the 185 end-to-end files start the real CLI.
- **Prose coupling:** 1,497 assertions match a literal of five or more words, in 237 files. 8,176 of 24,907 `expect` calls are `toContain` or `toMatch`.
- **Golden corpus:** 52 files, born in this release, regenerated by 11 commits; one commit rewrote 40 of the 52.
- **Thin spots:** `model/` has 1,393 source lines against 95 unit-test lines, and `portal/` has no unit tests (it has end-to-end and integration tests).

## Top findings (ranked)

**1. The biggest functions keep growing.**
- **Where:** `core/fill.ts:167`, `cli/check.ts:128`, `relations/pass.ts:233`, `io/aspect-parser.ts:327`, `csharp.ts:651`, `cli/aspect-test.ts:858`.
- **Evidence:** functions over 400 lines went from 6 to 10. The 09-23 audit (m21) named the same functions; `runFill` grew from 388 to 536 lines and the check command's body from 453 to 558.
- **Why it matters:** `fill.ts` and `check.ts` attract the most repeat fixes, and each fix lands inside one 500-line function.
- **Fix:** add an advisory rule capping function length at about 150 lines. Split the fill run into phases (the `fill-*-phase.ts` files already exist) and cut the command bodies down to parse → run → render.
- **Effort:** M per function. **Confidence:** high.

**2. The command-support type has become a second, unenforced layer (B7 is worse).**
- **Where:** 19 files in `cli/`, 7,788 lines.
- **Evidence:** it now holds rendering (`check-render-*`, 1,881 lines), engine logic (`impact-handlers.ts`, 761 lines, 10 imports from `core/`), and file and git access (`pack-source.ts`, `progressive-scope-resolve.ts`). Its only rules are the three hygiene ones (`yg-architecture.yaml:59-78`), and `portal/engine-api.ts` imports from it.
- **Fix:** move the rendering files and `group-issues.ts` under the formatter rules, move the logic into `core/` and `io/`, and keep the remainder as thin support.
- **Effort:** M. **Confidence:** high.

**3. The output wording is still moving at release time.**
- **Evidence:** issues 188, 191, 192, 177, 228 (two commits), 231, 232 and 316 all rewrote the same output surface in 3 days. `cli-reference.ts` is the top file for churn weighted by size, and the golden corpus was regenerated 11 times. `computeNext` (`check-render-views.ts:384`) is exported but nothing imports it.
- **Why it matters:** every wording change spreads to the golden files and to about 1,500 prose assertions, which is what makes the commits so large.
- **Fix:** freeze the wording for the tag, and review golden updates as diffs.
- **Effort:** S. **Confidence:** high on the churn, medium on the cause.

**4. Commands exit in two different ways.**
- **Evidence:** 84 raw `process.exit` calls in `cli/` against 49 calls to `exitAfterFlush` and 38 to `failAndExit`. 60 places write the error and then call `process.exit(1)` inline, although `failAndExit` (`cli/output.ts:401`) does exactly that. `aspect-test.ts` alone has 25 raw exits.
- **Why it matters:** `exitAfterFlush` exists to stop output being cut off on a pipe and to avoid a crash on Windows, and half the call sites bypass it. I did not measure whether any raw exit actually cuts output short.
- **Fix:** replace the inline pairs mechanically, then add a rule that bans raw `process.exit` in `cli/`.
- **Effort:** S-M. **Confidence:** high on the counts, low on the real-world impact.

**5. Commits are too big to bisect or revert.**
- **Evidence:** median commit 24 files and 569 lines; p90 95 files and 2,905 lines; the largest 324 files and 15.6k lines. Subjects bundle up to 10 issues ("issues 164-172", "m6-m10, m12, m19-m23, m25").
- **Fix:** one issue per commit, and review fixes as separate commits.
- **Effort:** S (a process change). **Confidence:** high.

**6. The tests are tied to prose.**
- **Evidence:** the 1,497 multi-word literal assertions and the 31% end-to-end share above; the Glossary change (issue 177) had to touch tests across the tree.
- **Fix:** new tests assert on error codes and JSON fields; prose stays in the golden corpus only.
- **Effort:** M, applied gradually. **Confidence:** medium, because matching five-word literals is only a rough stand-in for "tests assert on prose".

**7. The one runtime cycle is a half-finished split.**
- **Where:** `core/advise-nominations.ts:71-82` and its four satellite files.
- **Evidence:** the satellites import four helpers (`CLASS_RANK`, `hashEvidence`, `quoteData`, `asApprovalNext`) back from the hub file.
- **Fix:** move those helpers and the `Nomination` type into an `advise-shared.ts`.
- **Effort:** S. **Confidence:** high.

**8. Exact copies of two helpers.**
- **Where:** `reachExtraForType` is in both `core/companion-resolve.ts:59` and `core/fill-det.ts:51`. The path-escape check `escapesRepo`/`escapesRoot` has three copies: `io/aspect-parser.ts:311`, `io/node-parser.ts:266` and `io/package-manifest-parser.ts:46`.
- **Why it matters:** it is the same "one truth, several copies" pattern the 09-23 audit found, and the path-escape check is security-relevant.
- **Fix:** keep one copy of each.
- **Effort:** S. **Confidence:** high.

**9. Many exports serve no other file.**
- **Evidence:** 64 exported values are used by no other source or test file, and 168 are exported only so tests can reach them. No module is orphaned.
- **Fix:** add a dead-export check in CI (for example knip) and un-export the 64.
- **Effort:** S. **Confidence:** medium, because some of the 64 are used inside their own file, so they are unnecessary exports rather than dead code.

**10. The parsers keep swelling.**
- **Evidence:** `io/config-parser.ts` grew from 701 to 1,011 lines (+44%), and there are 24 hand-written known-key tables.
- **Fix:** generate validation from a single schema per file kind.
- **Effort:** L. **Confidence:** medium.

**11. The committed event log floods the history.**
- **Evidence:** `yg-events.llm.jsonl` is 6,956 of the 12,007 graph lines changed (58%). This is m24 from 09-23, still open.
- **Fix:** rotate it or take it out of git.
- **Effort:** S-M. **Confidence:** high.

**12. Two small seams between directories.**
- **Where:** `core/allowed-relation-types.ts` is imported by `relations/` and `structure/`; `structure/observations.ts` imports `core/pair-hash.ts`.
- **Why it matters:** low risk today, but it lets a future bad dependency slip in unnoticed.
- **Fix:** move the allowed-relation-types table into `model/`.
- **Effort:** S. **Confidence:** high.

## What changed since the 09-23 and 09-25 audits

**Fixed** (confirmed by measurement):
- The duplicated log gate (`build-context.ts:360` now calls `computeLogGateState`).
- `DEFAULT_PORT_NAME` now has one definition.
- The portal no longer imports the CLI preamble.
- The `drill` ↔ `drill-add` import cycle is gone.
- `relations/audit.ts`, `hashPath` and `perFileHashes` are deleted.
- Deterministic checks now have a time budget.
- Lock writes are batched.
- Declared relations with no import behind them fell to 78.

**Worse:**
- B7: command-support went from 7.3k to 7.8k lines.
- m21: the god functions grew (finding 1).

**Unchanged:**
- The failed restore in `adopt-transaction.ts:307-308` is still silently ignored (`.catch(() => {})`).
- The event log (m24) is still committed.

## Plan

**Before tagging 6.1.0 (cheap and safe only):**
- Freeze the output wording.
- Log the failed restore in `adopt-transaction.ts` (the cheap half of B7).
- File findings 1, 2, 4, 5, 7, 8 and 9 as issues, with these numbers as the baseline.
- Do no structural refactoring: every moved file triggers paid re-review for no gain users would see. Findings 7 and 8 are pure moves and could go in, but only if the cost of paid re-review is accepted.

**Next release:**
- Split command-support.
- Break up the fill function and the `check`, `impact` and `aspect-test` command bodies.
- Add the function-length rule and the dead-export check.
- Unify exits and add the rule against raw `process.exit`.
- Move to one issue per commit.
- Write new tests against codes and JSON rather than prose.
- Handle the event log.

**Leave alone:**
- The language extractors: large, but each language sits in its own file and growth is additive.
- The roughly 8.8k lines of templates and knowledge text stored in TS.
- The directory seam in finding 12, until someone is in that code anyway.
- The size of the portal.

**Not measured:** runtime and test-suite duration, line coverage, whether any raw `process.exit` actually cuts output short, and the current `yg check` status (not run; 09-25 reported it green).

## Commands used

- `git rev-list --count [--merges] v6.0.0..HEAD`
- `git diff --numstat v6.0.0 HEAD` (grouped by area with awk)
- `git log --no-merges --format= --name-only v6.0.0..HEAD -- source/cli/src | sort | uniq -c | sort -rn`
- `git log --no-merges --numstat v6.0.0..HEAD` (commit sizes)
- `git archive v6.0.0 … | tar -x` (the 6.0.0 baseline)
- `find … -exec wc -l`
- `rg -c` for `process.exit`, `exitAfterFlush`, `node:fs` and prose `toContain`
- the scripts listed at the top (`funcs.cjs`, `graph.cjs`, `analyze.cjs`, `dup.cjs`, `dead.cjs`)
