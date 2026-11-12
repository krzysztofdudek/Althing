# 726 · Yggdrasil aspect-test: assembleTestPrompt (source/cli/src/cli/aspect-test.ts:1052-1058) replaces a …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0536-xciv
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-690-opus
**Where:** the review of 690, 699

## What
Yggdrasil aspect-test: assembleTestPrompt (source/cli/src/cli/aspect-test.ts:1052-1058) replaces a subject file it cannot read with empty text and goes on, so a dry run or a live run previews or judges an empty file and ends clean instead of naming the unit as not assembled; the new incomplete stamp does not cover it.

## Why


## Acceptance


## Evidence

