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

## Changelog
- in Python, a file in a package directory below a project's `src/` child or a configured root no longer has its own directory searched as a root, unless pytest or Django runs from it, so `poetry.json` in `src/poetry/factory.py` resolves to the `poetry` package instead of competing with `src/poetry/poetry.py` beside it (in `src/poetry/poetry.py` itself, with the importing file); in 1.1.0 it was absent, unfollowed. Below a flat project's own directory the importing file's directory stays a root. On the corpus 7 such uses in poetry resolve; a consumer can see new edges where such a use was a file's only one.

## Evidence

### Proof

- **ran (line 48efc093a5d0):** node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at 860aca3, the tests over the dist before the fix) · **saw:** red: python-own-namespace-dir-under-root-not-a-root-edge 'the answers of the uses on src/poetry/factory.py:1' (ambiguous with src/poetry/poetry.py, no edge); the unit test 'the importing file's own directory is no root when it is a package directory under a discovered root' failed at poetry.__version__
- **ran (line 48efc093a5d0):** npm run build; node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/resolver.test.mjs; npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python; the classifyUse tally of every Python use of the five before and after (at 1314ef1) · **saw:** green: pass 235 and 51, fail 0; corpus passed, 0 added, 0 removed; classifyUse: poetry 7 uses move from ambiguous (with src/poetry/poetry.py) to resolved in the poetry package (factory.py:18,20,21,40,157 and poetry.py:9,26), none names the importing file; airflow, click, flask, google-cloud-python 0 moved

### Notes

Assumed: 'a discovered root' is read as a root that is not its project's own directory (a src/ child or a configured root). Below a flat project's directory the importer's own directory stays a root: script folders (scripts/, tools/) sit there beside the packages, and the existing test 'control: the importing script's own directory stays a root (python acme/tool.py)' holds that answer; reading every discovered root would flip it and every flat-layout script folder's sibling imports, against 'every other answer stays as it is'.

