# 673 · Yggdrasil: a companion that got no tree because the parser ran out of memory is still reported unde…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2240-raya
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561b-opus
**Where:** the review of 561, 610
**Branch:** jarl/561-parser-abort
**Worker:** w-561-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 22:42

## What
Yggdrasil: a companion that got no tree because the parser ran out of memory is still reported under code aspect-companion-runtime-error. The fill's closing summary says "A companion.mjs crashed, returned an invalid result, or its observations changed mid-run" and "Fix the failing companion.mjs", and the check's next line says "edit .yggdrasil/aspects/<rule>/companion.mjs". The pair's own report gives the right reason; the summary and the next line blame the companion's code. The companion counterpart of issues 639 and 655. Minor.

## Why


## Acceptance


[test] When a companion got no tree because the parser ran out of memory, the fill summary and check's next line name the rule and the file, never companion.mjs, red before and green after · by: cd source/cli && npm test

## Evidence

