# 152 · Jarl: an approved lease that waits for its merge is shown idle after the liveness threshold

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261105T0821-xliy
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-042-opus
**Where:** Review of 042 and 068 (rev-jarl-042-opus), Minor finding of 042
**Branch:** jarl/169-review-gate-bugs
**Merged:** 969f84bc4dcd34903807abe5e9ac3814dcc2ec1c in ../../../JarlSkill
**CI:** none

## What
status and resume mark a lease that holds an approve and waits for the merger as idle once the Liveness minutes pass with no commit, row or log line. The changelog promises the idle mark for work or proof waiting for review, not for an approved lease waiting for its merge, and the merger's wait is not the worker's.

## Why
An idle mark on work that only waits for the merger is noise on the coordinator's list and teaches the reader to ignore the mark.

## Acceptance
A lease with a live approve that waits for its merge is not marked idle for that wait (it shows under the merger's list instead), with a test on a loop copy; a lease without an approve is marked as before

## Changelog
- Fixed: a task that is approved and waits for its merge is no longer flagged as idle; the merger's list shows it.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/liveness.test.mjs (lease code reverted, the new test in place) · **saw:** pass 9, fail 1: status lists both 001, which holds a live approve, and 002 as idle where only 002 should be
- **ran (history):** cd skills/jarl/scripts && node --test tests/liveness.test.mjs tests/modules.test.mjs tests/docs-true.test.mjs tests/resume.test.mjs tests/library-parity.test.mjs tests/next-views.test.mjs · **saw:** pass 60, fail 0; the new test: at 36 minutes status, resume and branches mark only the lease with no approve idle, and next --as jarl lists the approved one as a merge row
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip, all four issues committed) · **saw:** tests 1382, pass 1360, fail 0, skipped 22 (a first run failed only the timing test of resume under a machine load of 27, which passes alone; this is the clean rerun)
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; then node --test tests/refusals-walk-reviewers-a.test.mjs alone for the one failure · **saw:** tests 1382, pass 1359, fail 1 (ENOSPC on the shared temp filesystem while another suite ran), skipped 22; the failed file alone: pass 1 of 1; merge 969f84b

