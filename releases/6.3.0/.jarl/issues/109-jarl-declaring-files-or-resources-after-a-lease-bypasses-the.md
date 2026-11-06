# 109 · Jarl: declaring files or resources after a lease bypasses the guard that refuses a file another lease holds

**Status:** done
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
**Merged:** e550b7849e00a6e4e5a78022729204d776d886eb in ../../../JarlSkill
**CI:** none

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
- **ran:** cd skills/jarl/scripts && node --test tests/lease-holds.test.mjs, with two new tests and lib/ before the fix · **saw:** pass 16, fail 2: field 3,2 resources db-server --add wrote Resources on the unleased issue 3 and its log line before issue 2 was refused; field 2,3 files new.txt --add over two issues in two leases wrote Files on issue 2 before issue 3 was refused (the log gained the field lines)
- **ran:** cd skills/jarl/scripts && node --test tests/lease-holds.test.mjs, on the branch · **saw:** pass 18, fail 0: a call over several issues is refused whole in the dry pass for files and resources, in either order, naming the holder, with the log and every issue unchanged; two issues in two leases cannot both take a file or resource nobody holds yet; issues in one lease can
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs · **saw:** second run: tests 1294, pass 1270, fail 2, both from the shared temporary disk filling up (ENOSPC) and a timing limit missed under machine load; library-parity and resume test files rerun alone: pass 10, fail 0; the first run had 50 failures, all from ENOSPC
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1294, pass 1272, fail 0, skipped 22, merge e550b78

