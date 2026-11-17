# 14 · Runes Python, already at v1.1.0: a project manifest in a test fixture directory (poetry tests/fixtu…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-zxhe
**Tags:** python, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761
**Branch:** jarl/13-python-go-roots-2
**Worker:** w-13-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes Python, already at v1.1.0: a project manifest in a test fixture directory (poetry tests/fixtures/*/pyproject.toml) makes that directory a discovered root as if the fixture were installed, so a top-level module it holds captures the import of an installed package: poetry import build (the PyPA build package) matches three fixture build.py files and is answered ambiguous (unfollowed at v1.1.0) instead of outside, and a single such fixture would bind a false edge.

## Why


A fixture standing in for an installed package gives a false edge or a false ambiguity to every consumer reading such a repository.

## Acceptance


[test] A project manifest under a test fixture directory (a directory named tests, test or fixtures, or below one) makes no discovered root for imports from outside that directory, so import build in poetry answers outside again and no fixture module captures an installed package's import; a case and a unit test, red before and green after; imports inside the fixture itself keep their answers · by: npm run check

## Evidence

