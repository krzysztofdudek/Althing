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

## Changelog
- in Python, a project whose manifest sits in or below a directory named `tests`, `test` or `fixtures` is a test fixture, and its root serves only the files inside it, so a module the fixture holds no longer captures an import elsewhere in the repository: `import build` in the project's own code is the installed `build` package and `classifyUse` answers it `outside`, where 1.1.0 bound a fixture's `build.py` (an edge into test data) or answered `unfollowed` when several fixtures held one. A consumer can lose a false edge into such a fixture; on the corpus 24 uses in poetry move to `outside`.

## Evidence

### Proof

- **ran (line 2084052d7aab):** node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at c567079, the tests over the dist before the fix) · **saw:** red: python-test-fixture-project-roots-only-itself-edge 'unexpected cross-owner edge src/tool/chef.py:1->build'; the unit test 'a project in or below a directory named tests, test or fixtures is a root only for the files inside it' expected 'tests/fixtures/sample/build.py' to be undefined; pass 87, fail 2
- **ran (line 2084052d7aab):** npm run build; node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/resolver.test.mjs test/exports.test.mjs; npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python; a classifyUse tally of every Python use of the five before and after (at 34bd479) · **saw:** green: pass 233 and 18, fail 0; corpus passed with 0 added, 0 removed (click 341, flask 322, poetry 1514, airflow 11812, google-cloud-python 623 edges); classifyUse: poetry 24 uses move, 23 from ambiguous over the three fixture build.py files and build.env.IsolatedEnv from unfollowed, all to absent outside (the PyPA build package); no use inside a fixture moves; airflow, click, flask, google-cloud-python 0 moved

### Notes

Assumed: 'outside that directory' is the fixture project's own directory (the manifest's), not the whole tests/ tree, since the line asks that poetry's tests importing build answer outside too; a file inside a fixture sees the roots of every fixture project whose directory holds it, and no other fixture's. A directory counts by its exact name tests, test or fixtures (testing/ or test_data/ is none).

