# 675 · Yggdrasil progressive mode: the HEAD-relative reference pattern (source/cli/src/core/progressive-sc…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2314-nvlk
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-226-opus
**Where:** the review of 226, 243, 267, 344, 345, 598, 599
**Branch:** jarl/226-yggdrasil-rest
**Merged:** e81ccc0b4 in Yggdrasil
**Merge check:** bash scripts/repo-check.sh (in the dev container, on the merged release/6.2.0) · saw [repo-check] All checks passed

## What
Yggdrasil progressive mode: the HEAD-relative reference pattern (source/cli/src/core/progressive-scope-resolve.ts:449) misses reflog forms such as HEAD@{0} and @{0}; a reference so written, committed or from --reference/YG_PROGRESSIVE_REFERENCE, measures the branch against itself and passes quietly instead of being refused like HEAD.

## Why


## Acceptance


[test] A progressive reference given as a reflog form of HEAD (HEAD@{0}, @{0}) is refused like HEAD and @, so a branch is never measured against itself, red before and green after · by: cd source/cli && npm test

## Reviews
- **approve** · by rev-226b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0012-jabu
  Tip 631c427ec, a narrow re-check of round 1's findings and the joined 675 and 681 (the scope the director set). Round 1 closed: docs/progressive-mode.md:67-72 now says keep the block and let the pipeline's reference win, and that with no block the mode is off; the code agrees (a pipeline reference in a project with no block gives the 'not used' notice and the whole project), and the section 'A reference the pipeline names' agrees too. Fetch advice by hand, every case as the worker says: origin + origin/main gives 'git fetch origin main'; origin + release/nope gives 'git fetch origin release/nope'; one remote 'upstream' gives 'git fetch upstream nope' and 'git fetch upstream main'; two remotes a, b without origin give no command for 'nope' and 'git fetch a main' for 'a/main'; no remote gives no command; origin/-x gives no command; -x is refused before any git call. safe.directory: the new unit test covers the path git names and a graph below the top level. The pack refusal test stubs EACCES and reaches the 'not writable' message. 675 and 681: red on d6c28086b and green on the tip, rows recorded. Tried to get past 681: '--end-of-options' as the value is refused; '^main', 'main..HEAD', 'main...HEAD', ':/', 'main^{tree}', 'HEAD:src', 'head', and values with a space or a newline (including 'main<newline>--upload-pack=touch <file>' from the variable) all reach git as one name after --end-of-options, fail to resolve, and fall to the whole project (nothing ran, the file was not created). ':/edit' and the branch's own name pass quietly, which is the same thing as naming one's own branch, the case the pipeline reference closes. A committed dash-led block does not brick the check: the run completes on defaults, fails, and reports config-invalid naming the file and the key to set, with --full, --json and --reference too. --end-of-options needs git 2.24; yg already needs 2.31 (rev-parse --path-format), so no new floor. Not re-run here: 598, 599 (round 1 and the jarl's repo-check cover them); pack.test.ts passed again with the touched files. Not run: lowercase 'head' on a case-insensitive filesystem (macOS), where git may resolve it to HEAD; here it does not resolve. Record, outside this scope: 675 and 681 still hold no row by the lease holder, which the brief ranks Important; the jarl decides. | Minor: source/cli/src/core/progressive-preflight.ts:138-151, fetchCommand checks only the first character, so a reference that is not a branch name is printed as is in the fix a person copies: 'main --all' gives 'git fetch origin main --all', 'main --upload-pack=<command>' would carry that option into the pasted command, '^main' gives a negative refspec, 'main..HEAD' and 'HEAD:src' print commands that cannot work, and a value with a newline splits the command over two lines. yg itself never runs it. Fix: print a command only when the branch part follows git's ref-name rules (no whitespace or control characters, none of ~^:?*[\, no '..', no leading dash), else the general sentence. Minor: docs/progressive-mode.md:522-523 says an empty --reference is refused but not that a reference starting with a dash is refused from the flag, the variable and the file. Minor: source/cli/src/core/progressive-scope-resolve.ts:275, when the committed block is refused as config-invalid, a run with --reference says 'this project's committed config names none', but the file names an invalid one (the config-invalid error is printed in the same run).

## Evidence

### Proof

- **ran (line c9920811497a):** cd source/cli && npx vitest run tests/e2e/cli-progressive-ci-reference.test.ts (with the other progressive e2e and unit files), on d6c28086b with the tip's test file and on 631c427ec, as node in the dev container · **saw:** d6c28086b: the five reflog cases fail (HEAD@{0}, @{0}, HEAD@{1}, ORIG_HEAD@{0} from --reference, and the variable and committed-block case): the run measured the branch against itself instead of refusing; 631c427ec: all pass (8 files, 142 tests, none skipped). By hand on the tip: @{u} and @{-1} are refused the same way; main@{0} is measured normally
- **ran (line c9920811497a):** cd source/cli && npx vitest run tests/e2e/cli-progressive-ci-reference.test.ts (the six reflog cases: HEAD@{0}, @{0}, HEAD@{1}, ORIG_HEAD@{0} by --reference, plus a reflog form from YG_PROGRESSIVE_REFERENCE and from the committed block) · **saw:** red before the change: 5 of the cases failed (exit 0 where 1 was expected, and no 'Give --reference the branch' notice) because the reflog forms were measured against the checked commit; green after the pattern also matches reflog forms: all pass, each form refused like HEAD with the notice naming the flag, the variable or progressive.reference

