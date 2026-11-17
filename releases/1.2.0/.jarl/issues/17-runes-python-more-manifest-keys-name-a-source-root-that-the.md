# 17 · Runes Python: more manifest keys name a source root that the readers do not read: maturin [tool.mat…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-cejt
**Tags:** api, python, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761

## What
Runes Python: more manifest keys name a source root that the readers do not read: maturin [tool.maturin] python-source, PDM [tool.pdm.build] package-dir and the Hatch sources option; a mixed Rust and Python project with python-source = "python" still has the absolute imports of its package answered outside.

## Why


A project laid out by one of these build backends has every self-import answered outside.

## Acceptance


[test] maturin [tool.maturin] python-source, PDM [tool.pdm.build] package-dir and Hatch sources name a source root, read by the same refusing reader as 757's keys, so a mixed Rust and Python project with python-source = "python" resolves the absolute imports of its package; a case each, red before and green after; docs/api.md names the keys · by: npm run check

## Evidence

