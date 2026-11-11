# 644 · Grain: grain check reads the checked file's dependencies with relFactsFor (engine/check.mjs:41), wh…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1940-xjll
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-573-opus
**Where:** the review of 573, 587, 588, 605, 606, 612, 631

## What
Grain: grain check reads the checked file's dependencies with relFactsFor (engine/check.mjs:41), which swallows an extractor error (engine/relations.mjs:176-182), so a file whose relation extraction throws is checked as having no dependencies and nothing says so, while the index now names such a file under 'dependencies not read' (605). Found by reading; 640 names only Vue and Svelte.

## Why


## Acceptance


## Evidence

