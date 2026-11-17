# 15 · Runes Python, already at v1.1.0: the importing file own directory is searched as a root even when i…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-pvwo
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761

## What
Runes Python, already at v1.1.0: the importing file own directory is searched as a root even when it is a namespace package directory under a discovered root, so in poetry src/poetry/poetry.py competes with the poetry package for every poetry.x import of src/poetry (factory.py, poetry.py): 7 uses have no edge and are answered ambiguous, one of them naming the importing file itself.

## Why


## Acceptance


## Evidence

