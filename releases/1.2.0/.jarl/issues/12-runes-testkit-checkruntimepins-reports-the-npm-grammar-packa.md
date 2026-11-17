# 12 · Runes testkit: checkRuntimePins reports the npm grammar packages of the given languages as not inst…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1313-yvpp
**Tags:** api, grammars, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-752-opus
**Where:** the review of 752
**Branch:** jarl/752-shipped-grammars
**Worker:** w-752-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:13

## What
Runes testkit: checkRuntimePins reports the npm grammar packages of the given languages as not installed even where the installed @chrisdudek/runes ships those grammars built and checked by sha256 (1.2.0, issue 752), so a consumer that drops the packages the package no longer needs fails the pin check README tells it to run; reproduced in an empty consumer installed from the packed tarball: 'tree-sitter-go (go): pinned 0.25.0, not installed'

## Why


## Acceptance


[test] In a project that installed the packed @chrisdudek/runes and no npm grammar package, checkRuntimePins reports no npm grammar package as missing for a language whose grammar the package ships, while a consumer that installed a grammar package of another version than the pin still gets its report; a test over the packed package, red before and green after · by: npm run check

## Evidence

