# 343 · Horde: Horde 6.2.0 vendors Runes 1.1.0 and Jarl 6.2.1, on a release branch of its own

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Horde
**After:** 326
**Found by:** coordinator
**Where:**

## What
Horde vendors Runes at v1.0.0 and Jarl's record library at v6.1.0, and has no release/6.2.0 branch. The family ships on one Runes (the ruling on one Runes across the family, checked by 258), and Horde takes Jarl's record library at a release tag; the owner, 2026-10-28, suggested Horde 6.2.0 take Jarl 6.2.1 with all its fixes.

## Why
Horde is the only other user of Jarl's record library and of Runes outside the CLIs; a mismatch shows first as a mission that stops in the field.

## Acceptance
- Horde has release/6.2.0 cut from main
- Its Runes pin names the Runes 1.1.0 tag and its Jarl pin the Jarl 6.2.1 tag, both re-vendored by the vendoring script, and Horde's full suite is green on them
- The Horde CHANGELOG says what changed for people who use Horde

## Evidence

correction to What: there is no ruling named for one Runes across the family; the requirement comes from issue 258, which checks that every tool points to the same Runes version

2026-10-28: Horde's main is red because its CI compares the vendored Jarl with Jarl's main (issue 355); re-vendoring here turns it green

