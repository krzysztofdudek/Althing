# 128 · Jarl: a profile may declare a section named like a header field or like Reviews, and field then hides the header or overwrites the review history the file shows

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261104T1245-jiin
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096-opus
**Where:** Review of 096 (rev-jarl-096-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Merged:** 2d4133b2b75089cecf7d5a9f1ebe98527f8198ad in ../../../JarlSkill
**CI:** none

## What
A profile section named Tags, Where or Priority (the validator accepts them) hides that header field from the field command. A section named Reviews lets field, and body --section before it, overwrite the review history the issue file shows; the done gate is unaffected (lib/profile.mjs:239).

## Why
A section that shadows a header field or the proof sections makes the file disagree with the log, and the shown review history can be rewritten.

## Acceptance
The profile validator refuses a section named like a header field or like a section the tool writes (Evidence, Notes, Reviews, Proof), with the list of reserved names, and a test holds it

## Changelog
- Fixed: a new profile that declares a section named like a header field of an issue (such as Tags, Where or Priority), or Notes, Reviews or Proof, is now refused when you open a loop with it or check it, with the list of names it cannot take. A loop you already run with such a section keeps it.

## Evidence

- **ran (history):** node --test tests/profile-sections.test.mjs on the code before the change · **saw:** 2 of 3 failed: a profile with a section Tags, Where, Reviews, Notes or Proof was accepted
- **ran (history):** npm test in skills/jarl/scripts on the branch tip (TMPDIR in a mktemp folder) · **saw:** tests 1312, pass 1292, fail 0, skipped 20; init --profile and profile <file> refuse the section with the reserved names; a loop already open with a reserved section keeps it
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch after packages B and C, TMPDIR from mktemp -d · **saw:** tests 1337, pass 1315, fail 0, skipped 22, merge 2d4133b

