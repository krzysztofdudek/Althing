# 012 · Jarl: new with a misspelled field is refused, never filed with an empty Why

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261022T0716-fygz
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/012-new-refuses-unknown
**Merged:** 64d2cb6 in ../../../JarlSkill
**CI:** none

## What
Through the tools, new with a misspelled field for Why was accepted, and only the parsed summary showed that Why was left empty; body with an unknown field is refused. Not yet reproduced.

## Why
A silent drop loses what the coordinator wrote, and an issue without a Why is hard to judge later.

## Acceptance
- The case is reproduced or shown not to exist, with the call recorded
- Any unknown field is refused by every tool alike, naming the fields it takes
- A test for the refusal

## Changelog
- Fixed: Every tool now refuses a field it does not take, including the help tool, and names the fields it does take.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran (history):** tool-level probe: jarl_new with whyy / Why, on the unchanged tip · **saw:** both refused: unknown field, naming the fields it takes; no issue filed. The misspelled-field case does not exist for new or body; the one gap found was jarl_help, which ignored any field
- **ran (history):** node --test tests/mcp.test.mjs (every tool refuses an unknown field), before the fix · **saw:** red: jarl_help refuses an unknown field, actual undefined
- **ran (history):** same file after the fix; then TMPDIR set to a free volume, npm test · **saw:** green: 30 pass 0 fail; full suite 824 tests, 801 pass, 0 fail (the system temporary directory was out of inodes)
- **ran (history):** jarl_help with root, on the previous commit · **saw:** refused: unknown field root, though the docs pass root on every call
- **ran (history):** node --test tests/mcp.test.mjs, then npm test with TMPDIR under ~/Temp/tmp, after the fix · **saw:** green: help takes root and json, refuses bogus; full suite 825 tests, 802 pass, 0 fail
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 825, pass 802, fail 0, skipped 23 (merge 64d2cb6 on release/6.2.1)

