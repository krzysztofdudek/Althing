# 644 · Grain: grain check reads the checked file's dependencies with relFactsFor (engine/check.mjs:41), wh…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1940-xjll
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-573-opus
**Where:** the review of 573, 587, 588, 605, 606, 612, 631
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain: grain check reads the checked file's dependencies with relFactsFor (engine/check.mjs:41), which swallows an extractor error (engine/relations.mjs:176-182), so a file whose relation extraction throws is checked as having no dependencies and nothing says so, while the index now names such a file under 'dependencies not read' (605). Found by reading; 640 names only Vue and Svelte.

## Why


## Acceptance


[test] grain check names a checked file whose relation extraction throws as not read, with the reason, instead of checking it as having no dependencies, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: when Grain cannot read a file's dependencies, grain check now says so for that file, with the reason, instead of checking it as a file with no dependencies. Can turn a repository red: no; it adds a note.

## Evidence

### Proof

- **ran (line 07082caf32d5):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/check-names-unread-dependencies.test.mjs tests/extractor-error-read-again.test.mjs tests/check-unparsed-like-index.test.mjs (before the fix the two new tests failed: the check printed no mention of the file's unread dependencies) · **saw:** tests 8, pass 8, fail 0 after the fix

