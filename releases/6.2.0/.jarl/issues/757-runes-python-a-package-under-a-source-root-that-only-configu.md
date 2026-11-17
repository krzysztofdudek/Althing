# 757 · Runes, Python: a package under a source root that only configuration names (lib/ with where = ["lib"]) has every absolute self-import answe…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261115T1054-jvvb
**Tags:** api, python, roots, runes
**Files:** Runes/src/relations/resolve-path.mts, Runes/src/relations/extractors/python-resolve.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-python-config-root
**Where:** Runes/src/relations/resolve-path.mts:1145, Runes/src/relations/extractors/python-resolve.mts:125

## What
Claim: At v1.1.0 the Python roots are the src/ child of a folder with a manifest, else the folder itself, and the text of pyproject.toml, setup.cfg and setup.py is not read. A package under lib/ named by [tool.setuptools.packages.find] where = ["lib"] therefore has no root: pkg.data.d is answered outside, and ..data.d resolves. The reporter measured the same on sqlalchemy at 572b5982e3513aa0139134f1d80a4f6248bb6825: 33 absolute imports of other layers in lib/sqlalchemy/util/preloaded.py (lines 26 to 58) are answered outside (not re-measured).

repros.sh py_lib: lines 1 (from pkg.data.d import x) and 3 (import pkg.data.d) of lib/pkg/ui/a.py printed {"kind":"absent","reason":"outside"}, line 2 (from ..data.d import x) printed resolved to lib/pkg/data/d.py; py_src, the same tree under src/, printed resolved for all three

## Why


For the most common way to write a Python import, a package that sits in lib/, python/ or backend/ is read as if its own name were an installed package, so a consumer reports nothing for the use and shows a green result. In sqlalchemy that hides 33 lines of one file. A new family tool that uses the readers as they are found it.

## Acceptance
- [test] In a repository with pyproject.toml naming where = ["lib"] under [tool.setuptools.packages.find], and one with a package-dir mapping in setup.cfg, an absolute import of a module of the package in lib/ gives resolved to that module's file in classifyUse, in a unit test and a catalogue case each, red at v1.1.0 (outside) and green after; the same tree under src/ and every existing answer and edge stays as it is · by: npm run check
- [read] docs/api.md says which manifest keys the readers take a source root from

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: Moved to the Runes 1.2.0 loop (releases/1.2.0) under the same number, on the owner's answer to a-41 and a-42; it is worked and closed there

