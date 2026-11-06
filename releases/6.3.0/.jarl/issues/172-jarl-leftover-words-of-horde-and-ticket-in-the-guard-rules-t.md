# 172 · Jarl: leftover words of Horde and ticket in the guard rules, the issue-number introducers and two README lines

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-136-sonnet
**Where:** tests/guard.test.mjs (horde in the guard rules), lib/ids.mjs and tests/ids.test.mjs (the word ticket as an introducer), README.md line 7 (the alt text says nothing closes without a fresh approval) and line 115 (compares jarl-record/3 with /1 and /2)
**Branch:** jarl/172-leftover-words-and-readme
**Worker:** w-jarl-172-sonnet-r2
**Worktree:** /home/me/Worktrees/JarlSkill/172-leftover-words-and-readme
**Since:** 2026-11-06 20:41

## What
After issues 136 and 151, the guard rules still name horde, the issue-number parser still accepts ticket as an introducer, and two README lines say more than the code does or compare contract versions that no reader needs.

## Why
A tool that left the family should not stay in the rules, and the README should say what the code does.

## Acceptance
The guard rules and tests name no tool that left the family, with the guard's meaning unchanged; the issue-number introducers are decided and the decision is written in the comment (kept as ordinary English or removed with a test); the two README lines say exactly what the code does

## Evidence

- **ran:** node --test tests/docs-true.test.mjs on the README before the change (new test: opening line and record contract line) · **saw:** fails: 'an approval of a fresh reviewer is needed for code, not for every issue' (the opening said a fresh reviewer's approval for every issue)
- **ran:** node --test tests/docs-true.test.mjs tests/guard.test.mjs tests/ids.test.mjs tests/tense.test.mjs after the change · **saw:** 51 tests, 51 pass, 0 fail; the guard test holds no mention of the departed tool (grep count 0 after, 3 lines before); the ticket introducer is kept and says why in a comment in lib/ids.mjs
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip) · **saw:** tests 1409, pass 1387, fail 0, skipped 22

