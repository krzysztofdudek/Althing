# 221 · Yggdrasil: after a rebase or squash (with no merge commit) a missing required log entry gives only a warning — 189 covered only merge

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, merge
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-206
**Where:**
**Branch:** jarl/221-rebase-squash-and-ports
**Worker:** ygg-221-small
**Worktree:** /home/node/wt/221-small
**Since:** 2026-10-05 13:00

## What
The reviewer of package 206 (189): the title of 189 names rebase and squash; the fix covers a merge made in this clone. Rebase and squash leave no merge commit, so check only warns.

## Why



## Acceptance
After a rebase or squash that joins log history with an older baseline, yg check (and --approve) demands an entry or merge-resolve just as after a merge; test red→green.

## Changelog
- Fixed: after a rebase, a pull --rebase or a squash merge that combined two branches' entries in a log_required component's log, yg check reports the entry it owes as log-entry-missing (in any clone, once committed) and yg check --approve records nothing over it, until an entry is written for the combination: one written after the rebase or squash settles it as soon as it exists, committed or not and before any fill, while the entries replayed or squashed in with the branch do not (git keeps whole seconds; an entry written into the squash commit itself and not yet filled still reads as part of what was squashed, so fill before that commit or write one more after it); yg log merge-resolve --node <node> --ours <ref> --theirs <ref> can run first. A rebase that combined no log asks for nothing. Before you upgrade: a repository whose HEAD already sits on such a combination with no entry written since fails yg check once; write the entry with yg log add --node <node> and run yg check --approve.

## Evidence

Ruling 189-merge-only: 189 in 6.1.1 covers a merge made in this clone (including one stopped on a conflict): yg check and yg check --approve demand a merge entry. Rebase and squash (with no merge commit) move to a separate issue 221, because they leave no trace in history by which they could be recognised the same way.
- **ran:** npx vitest run tests/unit/core/log-combined-history.test.ts tests/unit/io/lock-store-merge.test.ts (new tests, source unchanged) · **saw:** 2 + 2 failed: the entry written after the combination and committed with no fill is asked for again, and the baseline is not the oldest of the three
- **ran:** npm run build; npx vitest run tests/e2e/cli-merge-driver.test.ts -t '10|11' (source unchanged) · **saw:** 10d rebase and squash, 11 and 11b failed (log-entry-missing asked for again after the entry was committed; log-integrity on the interleaved multi-commit rebase with the restore-from-HEAD step); 10, 10b, 10c passed
- **ran:** npm run build; npx vitest run tests/e2e/cli-merge-driver.test.ts tests/unit/core/log-combined-history.test.ts tests/unit/io/lock-store-merge.test.ts tests/unit/utils/git-introspect.test.ts tests/unit/repo tests/e2e/cli-log-integrity.test.ts (fix applied) · **saw:** 27 files, 285 tests passed, including the scratch-repository rebase (1, 2 commits, interleaved) and squash cases, 10d, 11 and 11b run with the advice as given
- **ran:** npx vitest run tests/unit/utils tests/unit/io tests/unit/core/log-integrity.test.ts tests/unit/core/type-log.test.ts tests/unit/core/check-lock.test.ts tests/e2e/cli-log-integrity.test.ts tests/e2e/cli-log-integrity-extended.test.ts tests/e2e/cli-log-remaining.test.ts tests/e2e/cli-log-type.test.ts · **saw:** 87 files, 1502 tests passed; typecheck and eslint on the touched files clean

