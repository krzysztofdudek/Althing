# 181 · Jarl: the README opening and the picture text leave out the owner's waiver, which also closes an issue with no approve

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261106T2052-uazu
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-172-opus-d4b
**Where:** README.md opening line and the picture's alt text; skills/jarl/references/profile.md the waiver paragraph
**Branch:** jarl/122-wording-and-canon
**Merged:** d65727c039b363b868994b0278112710367f6805 in ../../../JarlSkill
**CI:** none

## What
The README opening says nothing closes without an approval unless the done gate asks none and a merge is enough, but the owner's waiver of review also closes an issue with no approve.

## Why
The README should say every way an issue closes.

## Acceptance
The opening line and the alt text name the waiver in few words, the test that holds them is extended, and the guidance budget does not grow beyond a clause

## Evidence

- **ran (history):** git checkout README.md, then node --test --test-name-pattern "README's opening" tests/docs-true.test.mjs (red), then the new README (green) · **saw:** red: the extended assertion fails on the old opening (it lacks 'or the owner waives the review'); green: the opening line and the picture's alt text both end 'unless the loop's done gate asks no approve and a merge is enough, or the owner waives the review.' and docs-true and seams pass (47 pass, 0 fail)
- **ran (history):** diff of the README family section against family/canon.md between the CANON:FAMILY-SECTION markers with Jarl unlinked in prose and ' (this one)' in its table row · **saw:** no difference after the one change (the client's dashes); the License section after the block is the only extra; the block holds no version token
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on the branch tip · **saw:** tests 1557, pass 1535, fail 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1571, pass 1549, fail 0, skipped 22, merge d65727c

