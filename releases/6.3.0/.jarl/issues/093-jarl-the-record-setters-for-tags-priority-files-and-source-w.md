# 093 · Jarl: the record setters for tags, priority, files and source write their changes without a writer, and a Where change logs the whole old value

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 029
**Found by:** rev-jarl-029b-opus
**Where:** Review of 029 round 1 (2026-11-03): tests/record-contract.test.mjs pins every export's parameters; Horde refuses jarl-record/2 at load
**Branch:** jarl/187-writes-and-gaps
**Merged:** a981c807dab09c25e7e1444c1b09ad1ef46dfc88 in ../../../JarlSkill
**CI:** none

## What
setTags, setPriority, setFiles and setSource take no options argument (adding one fails the contract test), so a change made through the record library, Horde's setFiles among them, logs no author; a Where change logs the whole old value, unlike sections which log a first line and a length.

## Why
Library writes stay unattributed, and a long Where floods resume's log tail.

## Acceptance
- Library writes of those four fields can name a writer without a new contract version (for example through setField with opts.by), with a test and Horde's calls unchanged
- A Where change logs a bounded excerpt of the old value

## Changelog
- Fixed: A tool built on Jarl's record library can now name who changed a task's tags, priority, files or source, and the log shows that name.
- Fixed: Changing a long Where of a task now keeps only its first 120 characters and its length in the log, as a changed section does. Before, the whole old text went into the log.

## Evidence

- **ran:** node --test tests/description.test.mjs (before the fix, with the two new tests) · **saw:** pass 8 fail 2: setField with Tags refused as not a field this loop's profile declares; a Where change logged the whole 263-character old value
- **ran:** node --test tests/description.test.mjs tests/record-contract.test.mjs tests/library-parity.test.mjs tests/list-fields.test.mjs tests/resume.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs (at 8d3ab51) · **saw:** pass 79 fail 0: setField writes Tags, Priority, Files and Source with · by composer-x-architect, no writer when none is named; the contract test passes with no export changed
- **ran:** jarl field 093 Where 'the record setters' --by w-jarl-187-opus, on a copy of the 6.3.0 loop at 8d3ab51 · **saw:** 093 field Where · the record setters · was Review of 029 round 1 (2026-11-03): tests/record-contract.test.mjs pins every export's parameters; Horde refuses jarl-re… (134 characters) · by w-jarl-187-opus
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 60a06f7, the tip of jarl/187-writes-and-gaps) · **saw:** tests 1492, pass 1470, fail 0, cancelled 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 3e9a411, the branch with release/6.2.1 at 1d09fe3 merged in, one conflict in lib/log.mjs resolved by keeping both sides) · **saw:** tests 1518, pass 1496, fail 0, cancelled 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1534, pass 1512, fail 0, skipped 22, merge a981c80

