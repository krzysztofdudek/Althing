# 18 · Runes corpus tooling: the Python oracle searches each manifest directory and its src/, not the root…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-sxqj
**Tags:** corpus, python, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761

## What
Runes corpus tooling: the Python oracle searches each manifest directory and its src/, not the roots pyproject.toml and setup.cfg name since 1.2.0, so once a repository with a configured root (a lib/ layout) enters the corpus, a test import that resolves into lib/ is reported as a false edge.

## Why


A corpus oracle that disagrees with a correct reader blocks the release gate with a false red.

## Acceptance


[test] The corpus's Python oracle searches the roots that pyproject.toml and setup.cfg name, as the readers do since 1.2.0, so a test import that resolves into a configured lib/ root is not reported as a false edge; a unit test of the oracle's root list, red before and green after · by: npm run check

## Evidence

