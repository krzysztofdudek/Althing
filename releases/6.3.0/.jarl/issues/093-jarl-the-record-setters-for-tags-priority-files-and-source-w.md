# 093 · Jarl: the record setters for tags, priority, files and source write their changes without a writer, and a Where change logs the whole old value

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 029
**Found by:** rev-jarl-029b-opus
**Where:** Review of 029 round 1 (2026-11-03): tests/record-contract.test.mjs pins every export's parameters; Horde refuses jarl-record/2 at load

## What
setTags, setPriority, setFiles and setSource take no options argument (adding one fails the contract test), so a change made through the record library, Horde's setFiles among them, logs no author; a Where change logs the whole old value, unlike sections which log a first line and a length.

## Why
Library writes stay unattributed, and a long Where floods resume's log tail.

## Acceptance
- Library writes of those four fields can name a writer without a new contract version (for example through setField with opts.by), with a test and Horde's calls unchanged
- A Where change logs a bounded excerpt of the old value

## Evidence

