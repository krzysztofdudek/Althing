# 681 · Yggdrasil: a progressive reference that starts with a dash (from --reference, the variable or the committed block) reaches git merge-base as an option, with no input refusal

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** light
**Key:** 20261111T2332-mqbp
**Tags:** yggdrasil, progressive, security
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** w-226-sonnet, round 2 report
**Branch:** jarl/226-yggdrasil-rest
**Merged:** e81ccc0b4 in Yggdrasil
**Merge check:** bash scripts/repo-check.sh (in the dev container, on the merged release/6.2.0) · saw [repo-check] All checks passed

## What


## Why
A reference is user and pipeline input; passed to git as an argument it can be read as an option, changing what git does instead of refusing the value.

## Acceptance
[test] A progressive reference starting with a dash, from the flag, the variable and the committed block, is refused with a message naming the value and the way to give a real reference, and no git command receives it as an argument, red before and green after · by: cd source/cli && npm test

## Reviews
- **approve** · by rev-226b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0012-jabu
  Tip 631c427ec, a narrow re-check of round 1's findings and the joined 675 and 681 (the scope the director set). Round 1 closed: docs/progressive-mode.md:67-72 now says keep the block and let the pipeline's reference win, and that with no block the mode is off; the code agrees (a pipeline reference in a project with no block gives the 'not used' notice and the whole project), and the section 'A reference the pipeline names' agrees too. Fetch advice by hand, every case as the worker says: origin + origin/main gives 'git fetch origin main'; origin + release/nope gives 'git fetch origin release/nope'; one remote 'upstream' gives 'git fetch upstream nope' and 'git fetch upstream main'; two remotes a, b without origin give no command for 'nope' and 'git fetch a main' for 'a/main'; no remote gives no command; origin/-x gives no command; -x is refused before any git call. safe.directory: the new unit test covers the path git names and a graph below the top level. The pack refusal test stubs EACCES and reaches the 'not writable' message. 675 and 681: red on d6c28086b and green on the tip, rows recorded. Tried to get past 681: '--end-of-options' as the value is refused; '^main', 'main..HEAD', 'main...HEAD', ':/', 'main^{tree}', 'HEAD:src', 'head', and values with a space or a newline (including 'main<newline>--upload-pack=touch <file>' from the variable) all reach git as one name after --end-of-options, fail to resolve, and fall to the whole project (nothing ran, the file was not created). ':/edit' and the branch's own name pass quietly, which is the same thing as naming one's own branch, the case the pipeline reference closes. A committed dash-led block does not brick the check: the run completes on defaults, fails, and reports config-invalid naming the file and the key to set, with --full, --json and --reference too. --end-of-options needs git 2.24; yg already needs 2.31 (rev-parse --path-format), so no new floor. Not re-run here: 598, 599 (round 1 and the jarl's repo-check cover them); pack.test.ts passed again with the touched files. Not run: lowercase 'head' on a case-insensitive filesystem (macOS), where git may resolve it to HEAD; here it does not resolve. Record, outside this scope: 675 and 681 still hold no row by the lease holder, which the brief ranks Important; the jarl decides. | Minor: source/cli/src/core/progressive-preflight.ts:138-151, fetchCommand checks only the first character, so a reference that is not a branch name is printed as is in the fix a person copies: 'main --all' gives 'git fetch origin main --all', 'main --upload-pack=<command>' would carry that option into the pasted command, '^main' gives a negative refspec, 'main..HEAD' and 'HEAD:src' print commands that cannot work, and a value with a newline splits the command over two lines. yg itself never runs it. Fix: print a command only when the branch part follows git's ref-name rules (no whitespace or control characters, none of ~^:?*[\, no '..', no leading dash), else the general sentence. Minor: docs/progressive-mode.md:522-523 says an empty --reference is refused but not that a reference starting with a dash is refused from the flag, the variable and the file. Minor: source/cli/src/core/progressive-scope-resolve.ts:275, when the committed block is refused as config-invalid, a run with --reference says 'this project's committed config names none', but the file names an invalid one (the config-invalid error is printed in the same run).

## Evidence

### Proof

- **ran (line 79890a51c1f2):** cd source/cli && npx vitest run tests/e2e/cli-progressive-dash-reference.test.ts, on d6c28086b with the tip's test file and on 631c427ec, as node in the dev container; plus yg check by hand with a recording git first on PATH · **saw:** d6c28086b: all five cases fail, and the recording git shows 'merge-base HEAD --all' and 'merge-base --is-ancestor HEAD --all' from both the flag and the variable; 631c427ec: all pass; by hand on the tip the flag (--reference=-x, --reference -x, --reference=--end-of-options) and the variable are refused before any git call, a committed '--all' or ' -x' is reported as config-invalid naming the file and the key while the run still completes and fails, and git only ever receives a reference after --end-of-options
- **ran (line 79890a51c1f2):** cd source/cli && npx vitest run tests/e2e/cli-progressive-dash-reference.test.ts (five cases: --all, -x and --output naming a file in the system temporary directory by --reference, --all by YG_PROGRESSIVE_REFERENCE and by the committed block, each run with a recording git first on the PATH) · **saw:** red before the fix: 5 of 5 failed, the run only gated the whole project with a 'could not be measured against --all' note and the recording git had received the dash-led value; green after: 5 of 5 pass, exit 1, the message names the value and says it starts with a dash and how to give a real reference, and no recorded git argument equals the value

