# 757 · Runes, Python: a package under a source root that only configuration names has its absolute self-imports answered outside

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-eyqh
**Tags:** api, python, roots, runes
**Files:** Runes/src/relations/resolve-path.mts, Runes/src/relations/extractors/python-resolve.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-python-config-root
**Where:** Runes/src/relations/resolve-path.mts:1145, Runes/src/relations/extractors/python-resolve.mts:125
**Branch:** jarl/758-python-go-roots
**Worker:** w-758-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:29

## What
Claim: At v1.1.0 the Python roots are the src/ child of a folder with a manifest, else the folder itself, and the text of pyproject.toml, setup.cfg and setup.py is not read. A package under lib/ named by [tool.setuptools.packages.find] where = ["lib"] therefore has no root: pkg.data.d is answered outside, and ..data.d resolves. The reporter measured the same on sqlalchemy at 572b5982e3513aa0139134f1d80a4f6248bb6825: 33 absolute imports of other layers in lib/sqlalchemy/util/preloaded.py (lines 26 to 58) are answered outside (not re-measured).

repros.sh py_lib: lines 1 (from pkg.data.d import x) and 3 (import pkg.data.d) of lib/pkg/ui/a.py printed {"kind":"absent","reason":"outside"}, line 2 (from ..data.d import x) printed resolved to lib/pkg/data/d.py; py_src, the same tree under src/, printed resolved for all three

Moved from issue 757 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
For the most common way to write a Python import, a package that sits in lib/, python/ or backend/ is read as if its own name were an installed package, so a consumer reports nothing for the use and shows a green result. In sqlalchemy that hides 33 lines of one file. A new family tool that uses the readers as they are found it.

## Acceptance
- [test] In a repository with pyproject.toml naming where = ["lib"] under [tool.setuptools.packages.find], and one with a package-dir mapping in setup.cfg, an absolute import of a module of the package in lib/ gives resolved to that module's file in classifyUse, in a unit test and a catalogue case each, red at v1.1.0 (outside) and green after; the same tree under src/ and every existing answer and edge stays as it is · by: npm run check
- [read] docs/api.md says which manifest keys the readers take a source root from

## Changelog
- in Python, a source root that a project's `pyproject.toml` or `setup.cfg` names (`[tool.setuptools.packages.find] where = ["lib"]`, the empty key of `package-dir` or `[options] package_dir`, `[options.packages.find] where`, Poetry's `packages` `from`, Hatch's wheel `packages`) is a root of that project in place of its `src/` child or its directory, so the absolute imports of a package in `lib/`, `python/` or `backend/` (`from pkg.data import x`) give their edges where 1.1.0 answered them `outside`. Any other key or form names no root and `setup.py` stays unread. A consumer can see new edges, and new refusals, in a project whose packages sit in such a directory.

## Evidence

### Proof

- **ran (line cb87538ac855):** node --test test/relations/resolve-path.test.mjs test/relations/resolver.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs (tests of 757 over the dist of e91181f, before the manifest reader) · **saw:** red: python-config-root-pyproject-where-edge and python-config-root-setup-cfg-package-dir-edge 'expected edge lib/shop/ui/view.py:1->data not emitted'; the classifyUse test got absent outside for pkg.data.d under where = ["lib"] and package_dir = lib; 2 resolve-path tests failed
- **ran (line cb87538ac855):** npm run build; node --test test/relations/resolve-path.test.mjs test/relations/resolver.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/extractors/rust-resolve.test.mjs test/exports.test.mjs (at 9865bf0) · **saw:** green: pass 47, 76, 34, 3, 61, 108, 18, fail 0; pkg.data.d resolved lib/pkg/data/d.py under both manifests, the src/ tree resolved src/pkg/data/d.py as before, logging under a configured root stays outside
- **ran (line cb87538ac855):** systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check (at 95fa115, release/1.2.0 at 65848ce merged); npm run coverage · **saw:** check exit 0: tests 2792, pass 2789, fail 0, skipped 3 (go not installed, Rust toolchain absent); dist/ is fresh; coverage exit 0, all files 99.26% lines, 95.89% branches, 99.12% functions

### Notes

Assumed: a root named by configuration replaces the src/ rule for its project, as src/ replaces the project's directory (setuptools and Poetry put only the named directories on sys.path); a project whose named roots are all missing keeps the 1.1.x rule. The keys are read by their full TOML key path (so packages.find.where under [tool.setuptools] reads like the table form), and every other spelling is refused: an inline packages = { find = ... }, [[tool.poetry.packages]], a package-dir entry for a named package, a value with a non-string element, an absolute, backslashed or escaping path, a repeated setup.cfg key. setup.cfg where takes its first directory, as setuptools does.

Corpus: npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python,Slim,gin with RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared, before (fb89628) and after (95fa115): passed both times with identical edges (airflow 11615, click 341, flask 322, poetry 1514, google-cloud-python 623, Slim 382, gin 31; 0 added, 0 removed). classifyUse answers of the Python, PHP and Go uses, compared with a scratch harness: 480 relative names move from absent unfollowed to resolved (click 191, flask 159, google-cloud-python 130), each binding the file the module use on its line binds; 248 move from absent unfollowed to ambiguous (airflow 218: import airflow over the five airflow/__init__.py of its distributions; poetry 30); Slim and gin answers unchanged.

