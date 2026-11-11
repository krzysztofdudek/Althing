# 563 · Grain: the type-name check and the count disagree in TypeScript on the release branch already: an a…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1206-cuok
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-294-fable
**Where:** the review of 294, 299, 300

## What
Grain: the type-name check and the count disagree in TypeScript on the release branch already: an abstract class and a namespace are counted and never refused, a type alias is refused and not counted (probe: abstract class Ab {} counts Ab, refuses nothing; type Alias = {} counts nothing, refuses Alias)

## Why


## Acceptance


## Evidence

