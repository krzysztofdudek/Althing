# 029 · Jarl: every part of an issue's description can be changed by one command that logs the old value, and nothing in its history can be changed at all

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261102T2129-mzws
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** Jarl 6.2.0: body <ids> --title changes the title and logs the old one; field takes only Resources and profile fields, so 'field 001 Tier strong' prints 'Tier is not a field'; Kind and Found by have no command at all. Jarl 6.1.0, the driver of the 6.2.0 and 6.2.1 loops, has no way to change a title: issue 181 of the 6.2.0 loop keeps a Polish title.
**Branch:** jarl/029-edit-every-description-field
**Merged:** d55f773 in ../../../JarlSkill
**CI:** none

## What
The commands that change an issue grew one by one: body for the text and the title, prio, tag, files, repo, after and source for some header fields, field for profile fields. Tier, Kind and Found by have none, and each command logs a change in its own way.

## Why
An issue describes the work to be done, so any part of that description must be correctable when it was wrong. Its history (evidence, verdicts, merges, rulings, answers) proves what happened, so it is never changed, only retracted or superseded. One rule for each side keeps the done gate meaningful and saves the coordinator from hunting for the command.

## Acceptance
- Every part of the description (title, What, Why, Where, Acceptance, Changelog, priority, tier, kind, tags, files, repository, after, found by, source, profile fields) can be changed through a command, and every such change writes a log line with who changed it and the old value
- Status changes stay with set, which keeps its rules; evidence, verdicts, merges, rulings and answers have no edit command, only retract or supersede, and the reference says so in one place
- The help lists the description commands together, and a field name that cannot be changed is refused with the names that can
- Tests for each field, for the log line with the old value, and for the refusal

## Changelog
- Added: Every part of an issue's description can now be corrected, including its tier, its kind and who found it, and the record keeps who changed it and what it said before. What happened to an issue, such as its test results, reviews and merges, is never edited, only taken back or replaced.

## Evidence

Ruling one-edit-rule-for-issues: Krzysztof, 2026-11-02 (translated from Polish), asked whether Jarl should be able to edit anything in an issue, as one consistent system, and on the proposal that every part of an issue's description is changeable with the old value logged while its history is only retracted or superseded, answered: "Yes". Issue 029 carries it into Jarl 6.2.1 and takes in 017.
- **ran (history):** node --test tests/description.test.mjs (against the release-branch jarl.mjs, lib/commands.mjs and references, before the change) · **saw:** tests 6, pass 0, fail 6: unknown flag --by for field and prio; field Status not refused with the names field writes; the help does not list the description commands together
- **ran (history):** node --test tests/description.test.mjs (after the change) · **saw:** tests 6, pass 6, fail 0: every header field through field with a was/by log line, the dedicated commands and body log old value and who, refusals name the writable fields, the pinned 6.1.0 reader lists and counts the edited loop as before, verify clean
- **ran (history):** copy of releases/6.3.0/.jarl: field 029 Tier strong (before) / field 029 Tier standard --by w-jarl-029-opus (after); then the driver's status and list --all on both copies · **saw:** before: Tier is not a field: Resources, or one this loop's profile declares; after: 029 Tier: standard and the log line '029 field Tier · standard · was strong · by w-jarl-029-opus'; driver status and list (other issues) identical on both copies, verify findings identical (6, all pre-existing)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip 87802e6) · **saw:** tests 840, pass 817, fail 0, skipped 23
- **ran (history):** node --test tests/description.test.mjs (review fixes, against 87802e6) · **saw:** tests 7, pass 3, fail 4: an unnamed write logged 'by jarl'; body logged the whole old section with no length; an unchanged value wrote a line; record setBody/setAfter lines without the excerpt; the reference lacked the hand-written field line note
- **ran (history):** node --test tests/description.test.mjs and the ten touched test files (after the fixes) · **saw:** tests 199, pass 198, fail 0 (1 skipped): unnamed writes carry no author, opts.by on setField/setBody/setRepo/setAfter is logged, unchanged values write nothing, · kept as ∙, a section logged as its first line (cut at 120) and its length
- **ran (history):** copy of releases/6.3.0/.jarl: field 029 Tier standard, again with --by x, body 029 --what short --by w-jarl-029-opus; driver status and list --all against an unedited copy · **saw:** '029 field Tier · standard · was strong' (no author), the repeat wrote nothing, '029 body · what · was "The commands … and so…" (256 characters) · by w-jarl-029-opus'; driver status and list identical, verify findings identical
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip 1788041) · **saw:** tests 841, pass 818, fail 0, skipped 23
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 853, pass 830, fail 0, skipped 23 (merge d55f773 on release/6.2.1)

