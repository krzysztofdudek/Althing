# 131 · Jarl: the fill hint for Found by says only at filing while field writes it

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096-opus
**Where:** Review of 096 (rev-jarl-096-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Merged:** 2d4133b2b75089cecf7d5a9f1ebe98527f8198ad in ../../../JarlSkill
**CI:** none

## What
FILL_WITH in lib/issues.mjs says the Found by header is written only at filing, but the field command changes it.

## Why
A hint that contradicts what the tool does misleads the next reader.

## Acceptance
The hint names the field call that sets it, and a test reads the hint against the field command

## Changelog
- Fixed: when a new issue is filed with nobody named as having found it, the note on the empty field now gives the field call that sets it. Before, it said the name could only be given when filing.

## Evidence

- **ran:** node --test --test-name-pattern 'hint for an empty Found by' tests/jarl.test.mjs on the code before the change · **saw:** 1 failed: the hint was 'only at filing: new --found-by <who>', expected the field call
- **ran:** same test after the change, with the reply-of-new test · **saw:** pass 2, fail 0; the hint is jarl.mjs field 1 'Found by' "<who>" and running field 1 'Found by' rev-a fills it
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch after packages B and C, TMPDIR from mktemp -d · **saw:** tests 1337, pass 1315, fail 0, skipped 22, merge 2d4133b

