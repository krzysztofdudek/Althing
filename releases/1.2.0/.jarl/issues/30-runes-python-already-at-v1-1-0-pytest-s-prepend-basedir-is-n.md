# 30 · Runes Python, already at v1.1.0: pytest's prepend basedir is not read as a root below a flat projec…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1533-crox
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-13-opus
**Where:** the review of 13, 14, 15, 16, 17, 18
**Branch:** jarl/13-python-go-roots-2
**Worker:** w-13-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 16:01

## What
Runes Python, already at v1.1.0: pytest's prepend basedir is not read as a root below a flat project's root: a workspace member's tests/ with no __init__.py whose subdirectories are packages (m/tests/unit/test_a.py with m/tests/unit/__init__.py: from helpers import make, m/tests/helpers.py) answers absent outside at v1.1.0 and on the 1.2.0 branch of 13 to 18, though pytest inserts m/tests; a gap v1.1.0 had, so the next Runes version under runes-1-2-0-cut-for-new-findings, unless the fix of the basedir regression found in the review of 16 covers it

## Why


## Acceptance


[test] In a flat project (no src/ or configured root), a test module or conftest.py below a directory without __init__.py has pytest's basedir as a root (m/tests/unit/test_a.py: from helpers import make resolves to m/tests/helpers.py), in a unit test, red at v1.1.0 and green after · by: npm run check

## Evidence

### Notes

Deferred: To the next Runes version: a gap v1.1.0 already had (ruling runes-1-2-0-cut-for-new-findings); the pytest rule 16's round adds may cover it, and its worker says so if it does

