# 242 · Yggdrasil: a multi-commit rebase (main's entry older than the branch's second-to-last entry) gives log-integrity with advice that does not remove it, although the documentation says it is handled

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** yggdrasil, merge, log
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-221
**Where:**
**Branch:** jarl/221-rebase-squash-and-ports
**Merged:** 993ad064a7f9504087b4d824157431cdef68752c in ../../../Yggdrasil
**CI:** pending

## What
The reviewer of package 221: a rebase of a branch with several log entries onto a main whose newest entry is older than the branch's second-to-last entry gives error[log-integrity]; the advice given (merge-resolve / log add) does not remove the error. State from before package 221; the documentation (the-lock.md, log-management) claims that rebase is handled (024).

## Why
Honest work on a branch ends with a red check and no way out — a false red that the user cannot fix.

## Acceptance
A multi-commit rebase with interleaved entry dates (the reviewer's scenario) either passes or gives an error with advice that actually removes it (an e2e test runs the advice and gets a green check); the documentation tells the truth about what is handled.

## Changelog
- Fixed: a rebase of several commits whose log entries interleave by date with the target branch's no longer ends in log-integrity with a step that changes nothing: the lock merge driver now keeps the oldest baseline of the three versions it merges, so such a rebase asks only for the entry it owes; a repository that already committed the broken state is told the step that removes it, yg log merge-resolve --node <node> --ours <the branch it was built on> --theirs <the branch as it was before> (ORIG_HEAD right after a rebase), and the documentation says what is handled.

## Evidence


- **ran:** npx vitest run tests/unit/core/log-combined-history.test.ts tests/unit/io/lock-store-merge.test.ts (new tests, source unchanged) · **saw:** 2 + 2 failed: the entry written after the combination and committed with no fill is asked for again, and the baseline is not the oldest of the three
- **ran:** npm run build; npx vitest run tests/e2e/cli-merge-driver.test.ts -t '10|11' (source unchanged) · **saw:** 10d rebase and squash, 11 and 11b failed (log-entry-missing asked for again after the entry was committed; log-integrity on the interleaved multi-commit rebase with the restore-from-HEAD step); 10, 10b, 10c passed
- **ran:** npm run build; npx vitest run tests/e2e/cli-merge-driver.test.ts tests/unit/core/log-combined-history.test.ts tests/unit/io/lock-store-merge.test.ts tests/unit/utils/git-introspect.test.ts tests/unit/repo tests/e2e/cli-log-integrity.test.ts (fix applied) · **saw:** 27 files, 285 tests passed, including the scratch-repository rebase (1, 2 commits, interleaved) and squash cases, 10d, 11 and 11b run with the advice as given
- **ran:** npx vitest run tests/unit/utils tests/unit/io tests/unit/core/log-integrity.test.ts tests/unit/core/type-log.test.ts tests/unit/core/check-lock.test.ts tests/e2e/cli-log-integrity.test.ts tests/e2e/cli-log-integrity-extended.test.ts tests/e2e/cli-log-remaining.test.ts tests/e2e/cli-log-type.test.ts · **saw:** 87 files, 1502 tests passed; typecheck and eslint on the touched files clean
- **ran:** devcontainer: cd source/cli && npm test (the repository hook on the merge commit, with coverage) · **saw:** the hook's repo-check passed with coverage above the 90.2% bar, merge 993ad064a

