# 563 · Grain: the type-name check and the count disagree in TypeScript on the release branch already: an a…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1206-cuok
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
Grain: the type-name check and the count disagree in TypeScript on the release branch already: an abstract class and a namespace are counted and never refused, a type alias is refused and not counted (probe: abstract class Ab {} counts Ab, refuses nothing; type Alias = {} counts nothing, refuses Alias)

## Why


## Acceptance


[test] In TypeScript the type-name check and the count agree: an abstract class, a namespace and a type alias are each both counted and checked the same way, red before and green after · by: cd plugins/grain && npm test

## Evidence

