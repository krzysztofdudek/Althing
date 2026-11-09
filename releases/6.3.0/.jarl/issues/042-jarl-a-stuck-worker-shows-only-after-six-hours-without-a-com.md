# 042 · Jarl: a stuck worker shows only after six hours without a commit

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0838-osol
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-0d440c8f
**Where:** JarlSkill/skills/jarl/scripts/lib/rounds.mjs (leaseProblems), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4794 at a1132a8
**After:** 035, 052, 085
**Branch:** jarl/042-liveness-and-reopens
**Merged:** fa23bbd in ../../../JarlSkill
**CI:** none

## What
Claim: Workers sat stuck on a permission prompt or idle on a shared lock while the record said in flight. Corrected by the sceptic: Severity medium rather than high: a 30-minute warning is available today through the flag; what is missing is reading the row and log ages, a goal line for the threshold, and the same threshold in resume.

A lease is idle only after STALE_HOURS (6) with no commit on its branch; the last evidence row and log line are not read, and the threshold is a flag, not a goal line. Map row fr-07.

## Why

A worker stuck on a prompt nobody answers, or idle while holding something shared, was the largest waste of time in the field; the record's own ages can show it within minutes.

## Acceptance
- One goal line sets a liveness threshold in minutes (default 30), read by status, resume and next --as (052); --stale-hours stays as a one-call override
- Ages read the lease's rows, log lines and commits, and say which clone and which fetched refs they read
- Past the threshold a lease, or a proof with no verdict since, shows on its coordinator's list (the slice's coordinator, 085; the jarl's with no slice) with the command to act; a held resource shows its holder and that age (057)
- Tests with a test-only clock seam, a sliced loop among them; red at 71ebc5b, where resume shows nothing at 30 minutes

## Changelog
- Added: Jarl now flags a task that seems stuck after 30 minutes instead of six hours: work with no commit, proof or note for that long, or proof waiting that long for a review, shows as idle in the status, the resume and its coordinator's list, and a task waiting on a shared resource shows how long ago the task holding it last moved. A line such as Liveness: 60 in the goal changes the minutes.

## Evidence

- **ran (history):** cd skills/jarl/scripts && nice -n 15 node --test tests/liveness.test.mjs (the new test file on 7d13f3d, the release/6.2.1 tip, before the change) · **saw:** tests 8, pass 0, fail 8: resume printed '- 1 one · worker w1 · model not recorded · since ...' with no STALE for a lease 45 minutes old; goal --set 'Liveness: 20' refused as not a machine line; W.setClock is not a function
- **ran (history):** cd skills/jarl/scripts && nice -n 15 node --test tests/liveness.test.mjs (at d9e9eea) · **saw:** tests 9, pass 9, fail 0: idle 31m (threshold 30m) in status, resume and next --as with the handover form; a row resets the age; Liveness: 45 and --stale-hours 0.5; sliced loop on odin vs jarl; commits read in the clone and origin/jarl/1-one; held resource 'last active 31m ago, past the 30m threshold'; frozen 6.1.0 and 6.2.0 readers read the goal
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test (at 2ea7cb8, the branch tip) · **saw:** tests 1193, pass 1173, fail 0, cancelled 0, skipped 20 (the release tip had 1181: the 12 new tests of liveness and report-slips)
- **ran (history):** jarl status, resume and next --as jarl on a scratch copy of releases/6.3.0/.jarl (this branch's jarl.mjs), first at the default, then after goal --set 'Liveness: 1' on the copy · **saw:** default 30m: no stale line, liveness.leases for 042 and 068 read their last commit 25s ago on jarl/042-liveness-and-reopens in the JarlSkill clone, no fetched ref; at Liveness: 1: 'stale 042 · idle 1m (threshold 1m): last log line 24m ago, last row none, last commit 1m ago on jarl/042-liveness-and-reopens; read in the clone <JarlSkill>: jarl/042-liveness-and-reopens, no fetched ref', the same STALE in resume's In flight, and next --as jarl showed 042 with the handover form set 042 in-progress "<why-the-worker-changed>" --worker "<the-new-worker>" --handover
- **ran (history):** npm test in skills/jarl/scripts of the release worktree, at fa23bbd with 042 and 068 merged into release/6.2.1 (TMPDIR a mktemp -d folder under the system temporary directory) · **saw:** tests 1193, pass 1173, fail 0, skipped 20, exit 0

