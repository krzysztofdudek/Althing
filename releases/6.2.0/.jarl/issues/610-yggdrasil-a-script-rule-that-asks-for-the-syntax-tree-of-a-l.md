# 610 · Yggdrasil: a script rule that asks for the syntax tree of a large dense file ends as check-failed-t…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1541-motj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340c-fable
**Where:** the review of 340
**Branch:** jarl/561-parser-abort
**Worker:** w-561-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 17:47

## What
Yggdrasil: a script rule that asks for the syntax tree of a large dense file ends as check-failed-to-run with "Aborted()", and the report tells the author to fix a bug in check.mjs. Seen with a rule that reads file.ast on a .json file holding an array of about 33 million numbers, at 67108864 and at 67108865 bytes, on release/6.2.0 at 41e944cd6 and on the branch of issue 340 alike: "check.mjs threw an exception while running. Aborted(). Build with -sASSERTIONS for more info." A 65 MiB .json of one long string parses and is judged, so the size of the tree is what fails, as the tree builder runs out of its own memory. The rule has no bug and cannot catch it; the pair stays unverified with no advice that fits. Probably the same cause as issue 561, met through a rule's tree where 561 met it in the relation check.

## Why


## Acceptance


[test] A script rule that asks for the syntax tree of a file the parser aborts on (a dense 64 MiB JSON array) gets the file marked as having no tree with the reason, not a check-failed-to-run that blames check.mjs, red before and green after · by: cd source/cli && npm test

## Evidence

