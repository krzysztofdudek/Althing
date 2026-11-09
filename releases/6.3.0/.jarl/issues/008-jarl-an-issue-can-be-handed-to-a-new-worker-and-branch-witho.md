# 008 · Jarl: an issue can be handed to a new worker and branch without a stale-lease alarm

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261022T0715-wick
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035
**Branch:** jarl/008-handover
**Merged:** ffef4cc in ../../../JarlSkill
**CI:** none

## What
Replacing a worker is done by leasing the issue again with a new branch; status then reports the old lease as stale with its branch gone. There is no verb for a handover, and nothing records why the worker changed. The lease also has no place for what the coordinator knows of a worker's cost (a context grown far beyond the others).

## Why
A handover is routine in a long loop; the record should say who took over and why, and the views should stop alarming about a branch that was retired on purpose.

## Acceptance
- Under the lock, a move into a status that holds the claim re-reads the record and refuses an issue already leased, unless the call names a takeover or handover with its reason, which is logged
- It refuses files or resources another lease holds, naming the holder, and the held issue's slice tag when that issue has one
- A handover records why the worker changed and raises no stale-lease alarm for the old lease
- Tests: a double lease refused, a held file refused, a takeover with its reason accepted; red at 71ebc5b, where all three are accepted

## Changelog
- Added: a task can be handed to a new worker on purpose, with the reason it changed hands, and the old worker's branch and folder are no longer reported as a problem. Changed: a task another worker holds, or one that touches a file or resource another worker holds, is refused when started, naming who holds it.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

Waits on 035 (analysis session): the model refuses a second lease on a leased issue unless the call names a handover or takeover with its reason (technical critique C1 of research/2026-11-03-jarl-as-a-loop-tool), and its replacement row carries who holds the work; 008's handover is that path, so its shape comes from the model.
- **ran (history):** jarl.mjs at JarlSkill 71ebc5b on a scratch loop: set 1 in-progress A --branch jarl/001-one --worker wA; set 1 in-progress B --branch jarl/001-one-b --worker wB; set 2 in-progress 'held file' --branch jarl/002-two --worker wC (issues 1 and 2 both declare f.txt) · **saw:** all three accepted: 1 → in-progress · jarl/001-one · wA; 1 → in-progress · jarl/001-one-b · wB; 2 → in-progress · jarl/002-two · wC; exit 0
- **ran (history):** node --test tests/lease-holds.test.mjs, the new test file run on release/6.2.1 6da01f0 before the change · **saw:** red: tests 10, pass 2, fail 8 — a double lease, a held file, a held resource and a takeover with --handover all accepted or refused as an unknown flag; the old lease's Worktree kept on a handover
- **ran (history):** jarl.mjs set on a copy of releases/6.3.0/.jarl: set 008 in-progress B --branch jarl/008-other --worker w-other, release tip against jarl/008-handover 42a3257, then the same with --handover and a reason · **saw:** release tip: accepted, the old lease's Worktree field kept; this branch: refused '008 is leased already (worker w-jarl-008-opus, branch jarl/008-handover, since 2026-11-03 15:11) ... --handover', then '008 → in-progress · jarl/008-other · w-other · handed over', log line '· handover · branch jarl/008-other · worker w-other', Worktree gone; verify findings 8 before and after (all pre-existing)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test, at jarl/008-handover 42a3257 (lease-holds.test.mjs included) · **saw:** green: tests 966, pass 943, fail 0, skipped 23; lease-holds 10 of 10 pass (double lease refused, held file and resource refused with holder and slice tag, handover with its reason accepted, old Worktree gone, old branch HANDED OVER, frozen 6.1.0 and 6.2.0 readers read the lease)
- **ran (history):** node --test tests/lease-holds.test.mjs with the composer's-loop test added, on the code of e6cd0da (before the skip) · **saw:** red: pass 10, fail 1 — in a Horde-profiled loop the second running ticket of one node refused: '002 declares .yggdrasil/model/orders/log.md, which 001 holds in its lease'
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test, at jarl/008-handover d19c4d8 (release/6.2.1 merged; composer's loop skips both lease refusals) · **saw:** green: tests 1009, pass 986, fail 0, skipped 23; lease-holds 11 of 11, a Horde-profiled loop accepts two running tickets on one node log and a reassignment
- **ran (history):** npm test (in skills/jarl/scripts of the release worktree, at ffef4cc with 008 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1014 tests, 991 pass, 0 fail, 23 skipped

