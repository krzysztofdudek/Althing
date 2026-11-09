# 122 · Jarl: the ruling that a decide with no author is the coordinator's no longer applies once decide requires an author

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261104T1135-gwdf
**Tags:** needs-owner
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-096-opus
**Where:** Found by the worker of 096 (the branch's decide change)
**Branch:** jarl/122-wording-and-canon
**Merged:** d65727c039b363b868994b0278112710367f6805 in ../../../JarlSkill
**CI:** none

## What
Issue 096 makes --by required on decide, so ruling decide-without-by-is-the-coordinators (and its ratification, ask-012) describes a case that can no longer occur. The guidance and tests that mention an unnamed decide read as the coordinator's still carry it.

## Why
A ruling that describes behaviour the tool refuses misleads the next reader; superseding an owner-ratified ruling is the owner's word.

## Acceptance
The owner is asked, in one ratify item, to supersede the ruling; once he has, a superseding ruling is recorded and no guidance or test text speaks of a decide without an author

## Evidence

- **ran (history):** node --test tests/owner-quote.test.mjs tests/ratify-batch.test.mjs tests/library-parity.test.mjs, in skills/jarl/scripts on the branch tip · **saw:** 57 tests, 56 pass, 1 skipped, 0 fail; the comments in questions.mjs, merge-driver and ratify-batch tests and the owner-quote test title now say that the command line needs --by and the library records the coordinator when it names nobody; the changelog drops the sentence that made an unnamed ruling the coordinator's
- **ran (history):** grep for decide near coordinator, unnamed, without --by, no author in skills/jarl (SKILL.md, references, jarl.mjs, lib, tests) · **saw:** no guidance left that describes an unnamed decide at the command line; what remains is true: the composers row and its twin case state that the library records the coordinator for a decide that names nobody, and an older ruling with no By shows no author and is never read as the coordinator's; no assertion changed, only test titles and comments
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on the branch tip · **saw:** tests 1557, pass 1535, fail 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1571, pass 1549, fail 0, skipped 22, merge d65727c

