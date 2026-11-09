# 269 · Jarl: CLAUDE.md points to Althing, the real-loop test reads only JARL_LIVE_LOOP, and the README's family section gains the Althing sentence

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261006T0609-cbex
**Tags:** jarl, test
**Files:** JarlSkill/skills/jarl/scripts/tests/resume.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** JarlSkill/skills/jarl/scripts/tests/resume.test.mjs:220 (the default loop path climbs out of the repository into the author's private practice repository)
**After:** 252
**Branch:** jarl/252-format-marker
**Merged:** 43f596beaf0ed61fcc5b6ac82484745b95985866 in ../../../JarlSkill
**CI:** pending

## What
The move's step M9 for Jarl, split under the ruling jarl-release-alone-with-every-jarl-issue and the architect's scope review of 2026-10-18 (section 1, Q7): this issue is now the test half only, and goes into Jarl 6.2.0's first package with 252, because 247, 287, 251 and 276 rely on it. The real-loop test in resume.test.mjs drops its default path into the private repository and reads its loop only from JARL_LIVE_LOOP, which Althing's ws env supplies, skipping with that reason when it is unset. The docs half (CLAUDE.md's pointer to Althing and the canon's Althing sentence in README's family section) is a stated dependency on Althing's first push (266), since a public pointer to an unpushed repository points nowhere; it moved to 316, which waits on 266. The title still names both halves because Jarl 6.1.0 has no command to change a title. On Jarl's release/6.2.0, in a worker worktree, never in the driver checkout, whose branch stays put for the whole release (jarl-pinned-in-loop). Pushed only on the owner's word, with the release.

## Why
A test in a public repository that looks for its input inside a private one is skipped everywhere but one machine, and a skipped test proves nothing; and the public file must not name a path into the author's private repository.

## Acceptance
- resume.test.mjs holds no path outside the repository; with JARL_LIVE_LOOP unset the test is skipped with a reason that names the variable, and with it set to a copy of a loop the test runs
- No committed test in JarlSkill names a path outside the repository (a search of the tests for paths that climb out of it finds none), so the later packages' real-loop tests read JARL_LIVE_LOOP the same way
- cd skills/jarl/scripts && npm test is green on the commit

## Evidence

- **ran (history):** cd skills/jarl/scripts && npm test, on the release branch release/6.2.0 at the merge 43f596b · **saw:** 253 tests, 251 pass, 0 fail, 2 skipped (live-loop tests without JARL_LIVE_LOOP); the pinned 6.1.0 fixture refuses a format 2 loop with its own message

