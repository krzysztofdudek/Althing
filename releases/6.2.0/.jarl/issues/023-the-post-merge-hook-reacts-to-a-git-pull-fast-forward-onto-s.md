# 023 · The post-merge hook reacts to a git pull fast-forward onto someone else's merge commit: it rewrites the lock, turns yg check red and tells the one pulling to add an entry and amend the pushed merge; the git add command it prints also fails

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts, Yggdrasil/source/cli/src/cli/log.ts, Yggdrasil/source/cli/src/cli/init-scaffold.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/log/log-merge-resolve.ts:764 (`else if (await isMergeCommit(repoRoot, 'HEAD'))` in logMergeResolveAll; docstring :749-751); source/cli/src/cli/init-scaffold.ts:162 (the hook runs merge-resolve on every post-merge); source/cli/src/cli/log.ts:525 (the hard-coded `git add .yggdrasil/yg-lock.logs.json .yggdrasil/yg-lock.types.json`), :526 (the --amend advice always when merge === 'commit')
**Branch:** jarl/023-merge-hooks-lock
**Merged:** 387472893ddf9a332a7fbcf60fa9f762ab92c46b
**CI:** none

## What
Git runs post-merge also after a fast-forward, and logMergeResolveAll treats every merge commit at HEAD like a merge made in this clone. Reproduction (npm @chrisdudek/yg 6.1.0, git 2.50.1, no reviewer, isolated HOME; each 'me' clone fresh, with `yg init --upgrade`): Case 1: a teammate (core.hooksPath, so no yg hook) merges two branches that both added log entries, and pushes; there `yg check: PASS 1 warning`, the lock has `"app": {}`. On my side `git pull --ff-only`: 'Fast-forward', then 'Verified .yggdrasil/model/app/log.md; baseline recorded.', 'next: yg log add --node app --reason '<why these changes were merged — ask the user>'' and 'then: git add .yggdrasil/yg-lock.logs.json .yggdrasil/yg-lock.types.json, then git commit (or git commit --amend on the merge commit, before it is pushed), then yg check --approve'; `git status`: ` M .yggdrasil/yg-lock.logs.json`; `yg check`: FAIL error[log-entry-missing] at app, for a merge I did not make. Case 1b: the teammate pushes an ordinary commit; my next `git pull --ff-only` fails with exit 1 ('Your local changes to the following files would be overwritten by merge: .yggdrasil/yg-lock.logs.json … Aborting'). Case 2: the teammate has the hook and follows the documented path (merge entry, check --approve, amend, push; PASS there); my fast-forward prints `error[log-merge-entries-unknown]: log.md contains 1 new entry not present in either merge parent` and 'next: Remove the fabricated or altered entries: <timestamp>', pointing at the teammate's legitimate entry 'merged feature h into main n'. Case 3 (a merge without the driver and the hook, like a button on a forge): the tree is clean, check PASS, but the stage/commit/amend instruction appears anyway. Control: a fast-forward onto a non-merge commit says 'HEAD is not a merge commit and no merge is in progress — no log to reconcile.' In the post-merge of a real merge MERGE_HEAD is set and HEAD@{1} == HEAD^1; after a fast-forward onto the same commit MERGE_HEAD is absent, HEAD@{1} != HEAD^1 (hook-probe.log). A second defect: after an ordinary local merge the printed `git add .yggdrasil/yg-lock.logs.json .yggdrasil/yg-lock.types.json` fails with `fatal: pathspec '.yggdrasil/yg-lock.types.json' did not match any files` (exit 128), nothing is staged, and `git commit` says 'no changes added to commit'; this affects every project without a type log (the default). No pull/fast-forward tests in tests/e2e/cli-merge-driver.test.ts and tests/unit/core/log-merge-resolve.test.ts. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-20/logs/ffpull.log, stage-types.log, hook-probe.log, case1-teammate-merge-check.log, case2-flagged-entry.log; scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-20/scripts/.

## Why
The main branch is a merge commit in most PR flows, so this happens on an ordinary `git pull`: a green commit turns red on the puller's machine, the lock blocks further pulls, the tool says to amend a pushed commit and calls legitimate entries fabricated (an agent may remove them). docs/cli-reference.md:1073 and the logMergeResolveAll docstring say that a fast-forward has nothing to reconcile.

## Acceptance
- The hook (or the commit branch in logMergeResolveAll called from the hook) acts only for a merge made in this clone (MERGE_HEAD present or HEAD@{1} == HEAD^1); a fast-forward onto someone else's merge does not change the tree and prints neither an instruction nor an error (cases 1, 2 and 3); scripted callers after `git merge` (Jarl's merger, Horde's land) still get the commit branch.
- The printed staging command lists only lock files that exist or were written; in a project with no type log the `git add` from that line passes; e2e tests for a fast-forward pull and for the staging line.

## Changelog
- Fixed: A pull that fast-forwards onto somebody else's merge no longer rewrites your lock: yg log merge-resolve with no log named (the post-merge hook) leaves a merge commit your clone did not make alone, so the tree stays clean, yg check stays as green as it was, no entry is asked for and the next pull is not blocked; the git add step it prints after a merge you did make names only the lock files it wrote, so it no longer fails in a project with no type decision log.

## Evidence

merged into release/6.1.1 at 387472893, gate green
- **ran:** git commit (merge of jarl/023-merge-hooks-lock into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 387472893] Merge jarl/023-merge-hooks-lock

