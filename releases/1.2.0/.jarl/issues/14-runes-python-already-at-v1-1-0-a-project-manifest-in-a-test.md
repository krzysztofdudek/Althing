# 14 · Runes Python, already at v1.1.0: a project manifest in a test fixture directory (poetry tests/fixtu…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-zxhe
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761

## What
Runes Python, already at v1.1.0: a project manifest in a test fixture directory (poetry tests/fixtures/*/pyproject.toml) makes that directory a discovered root as if the fixture were installed, so a top-level module it holds captures the import of an installed package: poetry import build (the PyPA build package) matches three fixture build.py files and is answered ambiguous (unfollowed at v1.1.0) instead of outside, and a single such fixture would bind a false edge.

## Why


## Acceptance


## Evidence

