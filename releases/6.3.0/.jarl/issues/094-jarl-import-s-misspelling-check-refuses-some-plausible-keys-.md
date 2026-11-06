# 094 · Jarl: import's misspelling check refuses some plausible keys by accident, treats CLAIM and claim differently, and its acceptance still says unknown key

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 077
**Found by:** rev-jarl-077b-opus
**Where:** Review of 077 round 1 (2026-11-03): lib/import.mjs
**Branch:** jarl/094-import-and-files
**Merged:** 8bd98ee27c71e3b1c301218d570e7ecf6e24b624 in ../../../JarlSkill
**CI:** none

## What
A key within two edits of a mapped key is refused, so file (title), line (kind), find, kid, ids (id), effect and fixed are refused though they may be intended extras; CLAIM passes while claim is a mapped key (case matters); sources' refusal says nothing was filed; 077's acceptance line still says unknown key.

## Why
A rule that refuses a legitimate extra key by accident teaches people to stop using extra keys.

## Acceptance
The check compares case-insensitively, refuses only a distance-one miss of a mapped key of five or more letters or an adjacent transposition, lists the extras it let through when it files, and the acceptance and the references say the rule as it is, with a test per case

## Changelog
- Fixed: A field name in a research findings file that differs from a field Jarl reads only in capital letters, that is one letter off a name of five letters or more, or that has two neighbouring letters swapped is refused as misspelled. Any other extra field passes, and the import lists the extra fields it let through.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/import-keys.test.mjs (red: import.mjs before the change, tests added) · **saw:** tests 7 · pass 2 · fail 5: CLAIM, Title, ID and Fix pass as keys, short keys one letter off are refused, a swap of two neighbouring letters is not refused, sources says nothing was filed, no extra keys are listed
- **ran:** cd skills/jarl/scripts && node --test tests/import-keys.test.mjs (green, branch jarl/094-import-and-files) · **saw:** tests 7 · pass 7 · fail 0: one test per rule (case, one letter off a key of five letters or more, two letters off and short keys pass, neighbouring swap, angles shape with a dry run and sources, wording and form of the refusal on import and on sources, extra keys listed in text, JSON and dry run)
- **ran:** import <findings with a CLAIM key> --source scn --dry-run on a copy of the 6.3.0 loop, release tip and then this branch · **saw:** release tip: scn: 1 finding(s) · would file 1 (the claim is lost); this branch: finding scn-case-1 has CLAIM (did you mean claim?), which look like misspelled keys, ending with the form jarl.mjs import <findings.json> --dry-run
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1414 · pass 1392 · fail 0 · skipped 22
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on two import lines and one flag-list sentence, resolved by keeping both sides, then a follow-up commit added the parent flag to the import entry · **saw:** tests 1442, pass 1420, fail 0, skipped 22, tip 8bd98ee

