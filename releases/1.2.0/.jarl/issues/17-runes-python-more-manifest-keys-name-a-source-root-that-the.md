# 17 · Runes Python: more manifest keys name a source root that the readers do not read: maturin [tool.mat…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-cejt
**Tags:** api, python, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761
**Branch:** jarl/13-python-go-roots-2
**Worker:** w-13-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes Python: more manifest keys name a source root that the readers do not read: maturin [tool.maturin] python-source, PDM [tool.pdm.build] package-dir and the Hatch sources option; a mixed Rust and Python project with python-source = "python" still has the absolute imports of its package answered outside.

## Why


A project laid out by one of these build backends has every self-import answered outside.

## Acceptance


[test] maturin [tool.maturin] python-source, PDM [tool.pdm.build] package-dir and Hatch sources name a source root, read by the same refusing reader as 757's keys, so a mixed Rust and Python project with python-source = "python" resolves the absolute imports of its package; a case each, red before and green after; docs/api.md names the keys · by: npm run check

## Changelog
- in Python, maturin's `[tool.maturin] python-source`, the PDM backend's `[tool.pdm.build] package-dir` and Hatch's `sources` (`sources = ["lib"]`, or a mapping whose every member maps a prefix to `""`) name a source root too, so a mixed Rust and Python project with `python-source = "python"` has the absolute imports of its package give their edges where 1.1.0 answered them `outside`. A Hatch mapping that rewrites a prefix to another names no root. A consumer can see new edges, and new refusals, in a project laid out by one of these backends.

## Evidence

### Proof

- **ran (line 65ff36be1f9b):** node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at 51c4867, the tests over the dist before the fix) · **saw:** red: python-config-root-maturin-python-source-edge 'expected edge python/shop/ui/view.py:1->data not emitted (got none)', python-config-root-pdm-package-dir-edge and python-config-root-hatch-sources-edge 'expected edge lib/shop/ui/view.py:1->data not emitted'; the unit test failed on the maturin manifest; pass 94, fail 4
- **ran (line 65ff36be1f9b):** npm run build; node --test test/relations/resolve-path.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/resolver.test.mjs test/exports.test.mjs; npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python; the classifyUse tally of the five (at 6841eac) · **saw:** green: pass 260, fail 0; the three cases give their edges, the unit test reads 8 forms and refuses 14; exports 18 pass with docs/api.md naming the keys; corpus passed, 0 added, 0 removed; classifyUse 0 moved in all five (no corpus manifest writes these keys)

### Notes

Assumed: an inline parent table ([tool.pdm] build = { package-dir = ... }) names no root, as 757's reader refuses packages = { find = ... }; a Hatch sources mapping is read only when every member maps a prefix to the empty string, and one member rewriting to another prefix refuses the whole key, as Poetry's to does; Hatch sources is read under [tool.hatch.build] and [tool.hatch.build.targets.wheel] only (the sdist target installs nothing).

