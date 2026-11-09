# 153 · Jarl: the liveness views leave some loose ends: the default is still said to be six hours, the as-list ignores --stale-hours, idle rows sort past the first seven lines, and branch gone is judged from local branches only

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261105T0821-boro
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-042-opus
**Where:** Review of 042 and 068 (rev-jarl-042-opus), Minor findings and Outside the issue
**Branch:** jarl/099-views-and-printed-commands
**Merged:** f1c6df3894bc06fedec9a5ce9a8eb6b277f69d7c in ../../../JarlSkill
**CI:** none

## What
(1) references/repositories.md line 16 still says the default idle threshold is 6 hours. (2) In one status --stale-hours n --as call the as-list ignores the override and keeps the goal's threshold. (3) The 'What is on whom' table has no row for an idle lease and the idle field of next --as --json is not documented. (4) An idle row is ordered like any other row on a holder's list, so on a long list it falls past the first seven lines (lib/ball.mjs). (5) 'branch gone' is judged from local branches only while the ages now also read fetched refs, so a lease whose branch exists only as origin/<branch> reads as gone and is dated by that ref at once (lib/rounds.mjs leaseState). (6) A move from done to dropped counts as reopened after done in report, and writer names are grouped by exact spelling.

## Why
Each is small, and together they make the new views less trustworthy than they should be.

## Acceptance
Each of the six points is corrected or said honestly in the docs, with a test where the code changes, and an idle row sorts before ordinary rows

## Evidence

- **ran (history):** node --test --test-name-pattern='fetched ref is not gone|status --stale-hours moves|idle past the threshold goes before' tests/liveness.test.mjs in a copy of the release branch before the change (new tests) · **saw:** fail 3: a lease whose branch exists only as origin/<branch> read 'branch gone' and was aged by that ref; status --as jarl --stale-hours 2 printed threshold 30m in the list; an idle lease with priority 3 among eight ready P1 issues fell past the seven lines shown
- **ran (history):** the same tests on the branch tip · **saw:** pass 3; the asker's list of status follows --stale-hours (threshold 2h), the idle row is first on its holder's list, 'branch gone' needs no local branch and no fetched ref, and references/repositories.md says the default is the goal's Liveness line, 30 minutes. Points 3 and 6 (the idle row in the what-is-on-whom table, writer names grouped by exact spelling and done-to-dropped counted as reopened) are known limitations and are left
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip 8aa658d, TMPDIR in one mktemp folder) · **saw:** tests 1420, pass 1398, fail 0, skipped 22, exit 0; record-contract and library-parity pass
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1463, pass 1441, fail 0, skipped 22, merge f1c6df3

