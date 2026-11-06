# 176 · Jarl: the README's review labels and the done-gate sentence do not yet name relayed, bot and the clears setting

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-007-opus-d3
**Where:** README.md line 67 (the review-split sentence and the sentence on what clears an issue) and tests/docs-true.test.mjs:263 (the renderSplit object)

## What
After group D3 the code prints the labels fresh, waived by the owner, coordinator, self, relayed, bot, retracted and unrecorded, then a count of relayed and bot verdicts, and a done gate can name bots that clear. The README sentence lists six labels, says a fresh approve is needed when the issue carries code, and the README test feeds renderSplit an object with no relayed or bot.

## Why
The README should say what the code does, and its label test should fail when the README misses a label the code prints.

## Acceptance
The README names relayed and bot among the labels and says what the clears setting does; the test object carries relayed and bot and expects every label the code prints; the sentence about what clears a code issue is true for a loop whose clears names a bot alone

## Evidence

