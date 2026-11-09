# 176 · Jarl: the README's review labels and the done-gate sentence do not yet name relayed, bot and the clears setting

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261106T1955-dqek
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-007-opus-d3
**Where:** README.md line 67 (the review-split sentence and the sentence on what clears an issue) and tests/docs-true.test.mjs:263 (the renderSplit object)
**Branch:** jarl/172-leftover-words-and-readme
**Merged:** b6f670c892c08d95601b77d2d0154884c4686afd in ../../../JarlSkill
**CI:** none

## What
After group D3 the code prints the labels fresh, waived by the owner, coordinator, self, relayed, bot, retracted and unrecorded, then a count of relayed and bot verdicts, and a done gate can name bots that clear. The README sentence lists six labels, says a fresh approve is needed when the issue carries code, and the README test feeds renderSplit an object with no relayed or bot.

## Why
The README should say what the code does, and its label test should fail when the README misses a label the code prints.

## Acceptance
The README names relayed and bot among the labels and says what the clears setting does; the test object carries relayed and bot and expects every label the code prints; the sentence about what clears a code issue is true for a loop whose clears names a bot alone

## Evidence

- **ran (history):** node --test --test-name-pattern='labels of the review split' tests/docs-true.test.mjs with the new test against the README before the change · **saw:** fails: 'the README lists the review label "relayed" the code prints'
- **ran (history):** the same test against the README after the change, then once per removal in a scratch copy of the README: each of the eight labels, relayed and bot each from the count clause, and the clears clause · **saw:** passes on the README as it stands (pass 1); each of the eleven removals fails with the message naming what is missing (label fresh, bot, unrecorded, the relayed verdicts, the bot verdicts, the clears setting, and the rest)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip) · **saw:** tests 1409, pass 1387, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1446, pass 1424, fail 0, skipped 22, merge b6f670c

