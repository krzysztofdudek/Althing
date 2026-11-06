# 172 · Jarl: leftover words of Horde and ticket in the guard rules, the issue-number introducers and two README lines

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-136-sonnet
**Where:** tests/guard.test.mjs (horde in the guard rules), lib/ids.mjs and tests/ids.test.mjs (the word ticket as an introducer), README.md line 7 (the alt text says nothing closes without a fresh approval) and line 115 (compares jarl-record/3 with /1 and /2)

## What
After issues 136 and 151, the guard rules still name horde, the issue-number parser still accepts ticket as an introducer, and two README lines say more than the code does or compare contract versions that no reader needs.

## Why
A tool that left the family should not stay in the rules, and the README should say what the code does.

## Acceptance
The guard rules and tests name no tool that left the family, with the guard's meaning unchanged; the issue-number introducers are decided and the decision is written in the comment (kept as ordinary English or removed with a test); the two README lines say exactly what the code does

## Evidence

