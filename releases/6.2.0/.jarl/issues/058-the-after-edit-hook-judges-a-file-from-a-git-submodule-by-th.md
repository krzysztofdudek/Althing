# 058 · The after-edit hook judges a file from a git submodule by the outer repository's index

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-ribw
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/grain-context.mjs, Grain/plugins/grain/engine/grain-check.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain.mjs:127 (check-hook) `findRoot({ repo: payload.cwd })`, the same at :264 (edit-hook), :316, :387 and :495; grain-context.mjs:408-409 relPath rejects only a path that leaves the root lexically; fileDirty :318 (`ls-files --error-unmatch` fails for a submodule file) and changedRanges :349-351 (untracked ⇒ [[1, Infinity]])
**Branch:** jarl/058-hooks-own-repo-and-new-files
**Merged:** 657e95d
**CI:** none

## What
Reproduction (Grain 6.1.0 ae6152f with `npm ci`, brocoders/nestjs-boilerplate @9620f15, sindresorhus/ky @0d59458; a runner runs the exact hook command from hooks.json through sh -c with the payload on stdin): `grain refresh` on the outer repo (248 files); ky added as a submodule in libs/ky and committed; a one-line edit of libs/ky/source/core/Ky.ts:52; PostToolUse Edit with cwd = the outer repo (GRAIN_HOOK_TTL_MS=1) → 5 findings about the whole file (1322 lines): 4 'new to the index' with exemplars from the outer repo's .install-scripts, and 'repo-wide (small packages merged) convention: files here indent with 2 spaces / 118/128 established files conform. Your file `Ky.ts` (line 1) indents with tabs — a value this repo has not used before … (preference gap 7.89 bits)'; ky's .editorconfig has indent_style = tab. The same result after refreshing the outer index at the commit with the submodule (`libs/ky` occurs 0 times in model.json), so it is not a stale index. With cwd = the submodule and ky's own index: only 'edits like this also touch: test/hooks.ts (co-changed in 40/137 commits)', and `grain check` there gives 0 deviations. With the default TTL, a comment appended to the never-checked source/utils/delay.ts: with the outer cwd 3 findings, with the submodule cwd silence. `grain check libs/ky/source/core/Ky.ts` from the outer repo gives the same findings plus 'libs/ky/ does not exist yet'. The index skips submodules on purpose (refresh skips them; tests/stress/edge-cases.mjs case 8: 'must be skipped, not descended'), and tests/check-hook.test.mjs tests 'foreign' only as an unindexed directory. Edit-hook (:264, co-changes only) is silent in this case, but it has the same root resolution from cwd. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-25/logs/02-posttooluse-edit-submodule-file-cwd-outer.log and 01 and 03-06 in that directory (runner <the session scratchpad, since lost>/bughunt/grain/verify-25/runhook.mjs).

## Why
README:262 promises silence for 'a foreign repo', and validation.md and README:450 promise 'degrade, never crash, never lie', with submodules among the tested cases. The hook tells the agent that existing code of someone else's library is its change and that it breaks an indentation convention that is not this file's convention, and it does so on the first edit of every submodule file.

## Acceptance
- Every hook compares `git -C dirname(file) rev-parse --show-toplevel` with f.root; when they differ, it stays silent or answers from the index of the file's own repository (its .grain), and a direct `grain check` on a file in a submodule refuses or says that the path is in a submodule.
- The reproduction with nest and libs/ky: PostToolUse Edit for libs/ky/source/core/Ky.ts with the outer repo's cwd reports no findings from the outer index; a test in tests/check-hook.test.mjs for a file in a submodule.

## Changelog
- Fixed: Grain no longer judges a file inside a git submodule (or another repository nested in yours) against your repository's index. The hooks say nothing about such a file, and `grain check` on it refuses and tells you to run it from inside that repository.

## Evidence

- **ran (history):** node --test tests/check-hook.test.mjs (new test: submodule file, outer cwd), on jarl/058 before and after 6bb20d4 · **saw:** before: fail, the outer hook said '[grain] architecture: your import of packages/infra/db.ts (line 1) is the FIRST edge libs/sub → packages/infra'; after: 6/6 pass (outer hook silent, Write of a new file in the submodule silent, grain check exit 1 naming 'the submodule libs/sub/', nested clone refused as 'a git repository of its own', hook from inside the submodule still speaks FIRST edge app → infra)
- **ran (history):** nest-outer (verify-25 copy in <the session scratchpad, since lost>/patch-611/grain-058, outer index rebuilt at f9b41e1 by 6.1.1) runhook PostToolUse Edit libs/ky/source/core/Ky.ts with cwd = outer; then grain check libs/ky/source/core/Ky.ts · **saw:** release/6.1.1: 9 findings (new to the index x4, camelCase method convention x3, 'files here indent with 2 spaces … Ky.ts indents with tabs'), as of f9b41e1+dirty; check printed 'libs/ky/ does not exist yet' and 4 known deviations. jarl/058: hook silent; check exit 1: 'libs/ky/source/core/Ky.ts is inside the submodule libs/ky/, which this repository's index leaves out, so nothing here can judge it — run grain check source/core/Ky.ts from inside libs/ky/ …'

docs: docs/reference.md: `check` — a file inside a submodule (or another git repository nested in this one) is refused, exit 1, with a sentence naming it and the command to run from inside it; Hooks paragraph — the hooks say nothing about a file that belongs to another git repository than the session's (a submodule, a nested clone)
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2056, pass 2055, fail 0, skipped 1, merge 657e95d

