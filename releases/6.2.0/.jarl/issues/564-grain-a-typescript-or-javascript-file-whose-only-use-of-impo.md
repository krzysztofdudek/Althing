# 564 · Grain: a TypeScript or JavaScript file whose only use of import is import.meta is refused by a must…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1206-xdut
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-294-fable
**Where:** the review of 294, 299, 300
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain: a TypeScript or JavaScript file whose only use of import is import.meta is refused by a must-import rule though it records no import (present on the release branch; the import check takes the meta property for an import seen)

## Why


## Acceptance


[test] A TypeScript or JavaScript file whose only use of import is import.meta is not taken for an import by a must-import rule, red before and green after · by: cd plugins/grain && npm test

## Evidence

