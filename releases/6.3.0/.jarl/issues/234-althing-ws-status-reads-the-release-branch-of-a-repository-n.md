# 234 · Althing: ws status reads the release branch of a repository, not the driver's checkout

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261109T0954-gzgu
**Tags:** 
**Files:** 
**Found by:** jarl
**Where:**
**Branch:** jarl/234-status
**Merged:** b29f93255afab9027748c722892ea7b380b7957a
**CI:** none

## What
The row of a repository whose source is the driver's checkout reports the driver's commit, branch and changelog, so the status of the release is wrong.

## Why
ws status prints the Jarl row as off its declared branch with no changelog entries, because the jarl source now points at the pinned driver.

## Acceptance
- [test] ws status reports a repository at its release branch, from a checkout on it, also when the source the manifest names for the driver is a separate one
- [check] the workspace's tests pass · by: npm test

## Reviews
- **approve** · by rev-jarl-232-opus-prep (fresh) · 2026-11-09 · model claude-opus-5-5
  I read d2ca459. checkoutOnBranch takes the source when it is on the declared branch, else the worktree git lists on that branch, else the source, so the row still prints OFF when no checkout is on it. The new test fails at 0148fe8 and passes at d2ca459. The real ws status now prints jarl on release/6.2.1 at cc1782bc87c9. npm test has one failure at the pinned driver: blind-starts replacement expects the slice's open questions, which JarlSkill f47b846 added after the pin 6ecab42. With BLIND_SKILL at the release tip all 124 pass. The change does not cause that failure; the pin moves it. No findings.

## Evidence

### Proof

- **ran (line d63a3a121950):** TMPDIR=<scratch> node --test workspace/test/ws.test.mjs (the new test red at 0148fe8, green at d2ca459) · **saw:** ws status reports the jarl row on release/1.1.0 with the release branch's commit and changelog, no OFF ITS DECLARED BRANCH; 42 pass, 0 fail
- **ran (line 9dd0cee82c1e):** npm test in the issue's worktree · **saw:** 124 tests, 123 pass, 1 fail: workspace/test/blind-starts.test.mjs 'replacement: the slice's brief ...' (no 'Which screen goes first' in the driver Jarl's slice brief); the same test fails in the main Althing checkout without this change
- **ran (line d63a3a121950):** TMPDIR=<scratch> node --test workspace/test/ws.test.mjs, on an extraction of 0148fe8 and in the worktree at d2ca459 · **saw:** 0148fe8: 19 tests, 18 pass, the new release-branch test fails; d2ca459: 19 pass, the OFF test among them; ws status prints jarl on release/6.2.1 at cc1782bc87c9 with no OFF
- **ran (line 9dd0cee82c1e):** npm test in the worktree, then BLIND_SKILL=<extraction of JarlSkill 5e786c3>/skills/jarl npm test · **saw:** with the pinned driver 6ecab42: 124 tests, 123 pass, 1 fail (blind-starts replacement, the slice's open questions; JarlSkill f47b846 adds them after the pin). With BLIND_SKILL at the release tip: 124 pass, 0 fail

