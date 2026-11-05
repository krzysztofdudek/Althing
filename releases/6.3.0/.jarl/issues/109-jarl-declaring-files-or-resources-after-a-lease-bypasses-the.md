# 109 · Jarl: declaring files or resources after a lease bypasses the guard that refuses a file another lease holds

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 008
**Found by:** rev-jarl-008-opus
**Where:** Review of 008 (2026-11-03): files, field resources
**Branch:** jarl/074-merge-and-files
**Worker:** w-jarl-074-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/074-merge-and-files
**Since:** 2026-11-05 13:37

## What
The held-file refusal runs at the lease. Declaring files or resources with the files command or field resources after the lease is not checked against other leases.

## Why
The guard is only as good as the places that can set what it guards.

## Acceptance
files and field resources refuse a file or resource another lease holds, naming the holder, with tests

## Changelog
- Changed: Adding a file or resource that another worker holds to a task that is already started is refused, naming who holds it, as it is when the task is started.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/lease-holds.test.mjs, three new tests, lib/ before the fix · **saw:** pass 12, fail 3: field Files and field Resources (replace and --add) on a leased issue are accepted when another lease holds the file or resource, including a call over two issues
- **ran:** cd skills/jarl/scripts && node --test tests/lease-holds.test.mjs, on the branch · **saw:** pass 15, fail 0: the refusal names 'declares f.txt, which 1 holds in its lease (worker wA, branch jarl/1-one, since …)' and the handover call; own lease's files, free files and unleased issues pass
- **ran:** node --test tests/refusals-walk*.test.mjs tests/refusals.test.mjs tests/library-parity.test.mjs tests/record-contract.test.mjs tests/printed-texts.test.mjs tests/scope-after-lease.test.mjs tests/lifecycle-guard.test.mjs tests/lock-scope.test.mjs · **saw:** pass 69, fail 0

