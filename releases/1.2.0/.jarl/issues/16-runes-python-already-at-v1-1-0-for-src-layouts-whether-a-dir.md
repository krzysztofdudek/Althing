# 16 · Runes Python, already at v1.1.0 for src layouts: whether a directory is a sys.path root is judged a…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-ihnt
**Tags:** python, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761

## What
Runes Python, already at v1.1.0 for src layouts: whether a directory is a sys.path root is judged against the source roots of the projects, not their project directories, so beside a src/ root (and from 1.2.0 a configured one) scripts/ becomes a root for its subdirectories (import util in scripts/sub/run.py binds scripts/util.py, which Python would not load), and below a root manifest a tests package beside src/ loses tests.helpers, which the pytest basedir insertion makes importable.

## Why


A lost true edge, or a false one, misleads every consumer that checks dependencies with the readers.

## Acceptance


[test] Whether a directory is a sys.path root is judged against each project's directory as well as its source roots, so beside src/ or a configured root, scripts/ is not a root for its subdirectories (import util in scripts/sub/run.py does not bind scripts/util.py) and a tests package beside src/ keeps tests.helpers; cases and unit tests, red before and green after; every other answer stays as it is · by: npm run check

## Evidence

