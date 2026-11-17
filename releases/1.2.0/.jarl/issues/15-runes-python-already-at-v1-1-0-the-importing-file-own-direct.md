# 15 · Runes Python, already at v1.1.0: the importing file own directory is searched as a root even when i…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-pvwo
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
Runes Python, already at v1.1.0: the importing file own directory is searched as a root even when it is a namespace package directory under a discovered root, so in poetry src/poetry/poetry.py competes with the poetry package for every poetry.x import of src/poetry (factory.py, poetry.py): 7 uses have no edge and are answered ambiguous, one of them naming the importing file itself.

## Why


An ambiguity that names the importing file itself is a wrong answer a consumer cannot act on.

## Acceptance


[test] The importing file's own directory is not searched as a root when it is a package directory under a discovered root, so poetry.x in src/poetry/factory.py resolves to the poetry package and never names the importing file; a case and a unit test, red before and green after; every other answer stays as it is · by: npm run check

## Evidence

