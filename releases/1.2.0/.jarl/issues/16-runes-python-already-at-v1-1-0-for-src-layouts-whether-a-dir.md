# 16 · Runes Python, already at v1.1.0 for src layouts: whether a directory is a sys.path root is judged a…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-ihnt
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
Runes Python, already at v1.1.0 for src layouts: whether a directory is a sys.path root is judged against the source roots of the projects, not their project directories, so beside a src/ root (and from 1.2.0 a configured one) scripts/ becomes a root for its subdirectories (import util in scripts/sub/run.py binds scripts/util.py, which Python would not load), and below a root manifest a tests package beside src/ loses tests.helpers, which the pytest basedir insertion makes importable.

## Why


A lost true edge, or a false one, misleads every consumer that checks dependencies with the readers.

## Acceptance


[test] Whether a directory is a sys.path root is judged against each project's directory as well as its source roots, so beside src/ or a configured root, scripts/ is not a root for its subdirectories (import util in scripts/sub/run.py does not bind scripts/util.py) and a tests package beside src/ keeps tests.helpers; cases and unit tests, red before and green after; every other answer stays as it is · by: npm run check

## Changelog
- in Python, a directory above the importing file is judged a root against each project's directory as well as its source roots: one strictly below a project's directory or a root, and neither a project's directory nor a root itself, is no root unless pytest or Django runs from it. Beside `src/` or a configured root, `import util` in `scripts/sub/run.py` no longer binds `scripts/util.py`, which Python would not load, and below a root manifest a workspace member's `tests` package keeps `tests.helpers` (pytest inserts the member's directory), which 1.1.0 answered `outside`. A consumer can see new edges from a member's tests and lose edges through a directory only code puts on `sys.path`: on the corpus flask loses the two edges of `tests/test_apps/blueprintapp/__init__.py`, which a conftest fixture's `syspath_prepend` makes importable.

## Evidence

### Proof

- **ran (line 7390508de449):** node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at 09a565c, the tests over the dist before the fix) · **saw:** red: python-script-subdir-beside-src-not-a-root-silence 'unexpected cross-owner edge scripts/sub/run.py:1->scripts'; python-workspace-member-tests-package-edge 'expected edge member/tests/unit/test_core.py:1->support not emitted (got none)'; the unit test expected 'scripts/util.py' to be undefined; pass 91, fail 3
- **ran (line 7390508de449):** npm run build; node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/resolver.test.mjs; npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python; npm run corpus:update -- --only flask; the classifyUse tally of every Python use of the five before and after (at 519a316) · **saw:** green: pass 238, fail 0, under a src/ and a lib/ root alike; corpus: flask 2 edges removed (tests/test_apps/blueprintapp/__init__.py:5 and :6, whose package only a conftest syspath_prepend puts on sys.path), explained and golden rewritten (322 to 320), the other four unchanged; classifyUse: flask 4 resolved to absent outside (those two lines) and 10 absent unfollowed to absent outside (import celery in examples/celery/src), airflow 38 absent outside to absent unfollowed (docs.* in */docs/conf.py, held by devel-common which the sparse checkout leaves out), poetry, click, google-cloud-python 0 moved

### Notes

Assumed: a directory is inside a project, and no root, when it lies strictly below a project's directory or a source root and is neither a project's directory nor a source root itself; a member's directory below the root project's root is a project's directory, so it is a root, as the tests.helpers half of the line needs. The two flask edges of tests/test_apps/blueprintapp/__init__.py go: Python and pytest do not put tests/test_apps on sys.path, only a conftest fixture's syspath_prepend does, which the readers do not read; they are explained in corpus/explained.md.

