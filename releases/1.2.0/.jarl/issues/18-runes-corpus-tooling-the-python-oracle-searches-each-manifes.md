# 18 · Runes corpus tooling: the Python oracle searches each manifest directory and its src/, not the root…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-sxqj
**Tags:** corpus, python, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761
**Branch:** jarl/13-python-go-roots-2
**Worker:** w-13-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes corpus tooling: the Python oracle searches each manifest directory and its src/, not the roots pyproject.toml and setup.cfg name since 1.2.0, so once a repository with a configured root (a lib/ layout) enters the corpus, a test import that resolves into lib/ is reported as a false edge.

## Why


A corpus oracle that disagrees with a correct reader blocks the release gate with a false red.

## Acceptance


[test] The corpus's Python oracle searches the roots that pyproject.toml and setup.cfg name, as the readers do since 1.2.0, so a test import that resolves into a configured lib/ root is not reported as a false edge; a unit test of the oracle's root list, red before and green after · by: npm run check

## Evidence

### Proof

- **ran (line bdb138f3340f):** node --test test/corpus.test.mjs (at 0307966, the root list moved unchanged into scripts/python-oracle-roots.mjs) · **saw:** red: the unit test 'holds each manifest directory, its src/, and every source root pyproject.toml and setup.cfg name' lacks app/code, cfgfind/py, hatch/hl, hatch/hs, lib, pdm/pkgs, poe/pl, rs/python, setuptools/sd; the oracle run over a lib/ layout reports UNEXPLAINED python:false-edge tests/test_data.py:1 pkg.data lib/pkg/data.py 'no file'
- **ran (line bdb138f3340f):** node --test test/corpus.test.mjs test/guard.test.mjs; npm run corpus:oracles -- --only airflow,click,flask,poetry,google-cloud-python (at 62092b8) · **saw:** green: tests 53, pass 52, fail 0, skipped 1 (the real go list); the root list holds every named root and drops ../, absolute and missing ones; the lib/ oracle run: checked python 2, 0 disagreements; oracles over the five: python 599, 601, 3007, 20141, 1161 checked, 0 disagreements

