# 758 · Runes, Python: from .m import Name is answered unfollowed when Name is not a module

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-yujd
**Tags:** api, python, runes
**Files:** Runes/src/relations/extractors/python-resolve.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-python-relative-member
**Where:** Runes/src/relations/extractors/python-resolve.mts:254, Runes/src/relations/extractors/python-resolve.mts:126, Runes/src/relations/extractors/python-resolve.mts:207
**Branch:** jarl/758-python-go-roots
**Worker:** w-758-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:29

## What
Claim: At v1.1.0 resolveAbsolute drops the last segment when the whole dotted name binds no file, so pkg.data.m.x resolves to data/m.py, and the package form pkg.data.x resolves to data/__init__.py. resolveRelative has no such step, and explain answers unfollowed for every relative specifier, so ..data.m.x and ..data.x are answered {"kind":"absent","reason":"unfollowed"} though the module file exists. The reporter counted 347 such answers in django and 4,127 in sqlalchemy, every one a relative import.

repros.sh py_relative_vs_absolute: from ..data.m import x printed ..data.m.x unfollowed; from pkg.data.m import x printed pkg.data.m.x resolved to src/pkg/data/m.py; from ..data import x printed ..data.x unfollowed; from pkg.data import x printed pkg.data.x resolved to src/pkg/data/__init__.py

Moved from issue 758 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
The same file is answered resolved when the import is written absolute and unfollowed when it is written relative, so a consumer that counts unfollowed uses shows thousands of them in a repository where almost none is a gap (347 in django, 4,127 in sqlalchemy, every one relative), and the count stops being a signal. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In Python, from ..data.m import x and from ..data import x give resolved to the module file or the package's __init__.py in classifyUse, as from pkg.data.m import x and from pkg.data import x do, in a unit test and a catalogue case, red at v1.1.0 (unfollowed) and green after; a relative path that binds no file stays unfollowed, and every existing answer and edge stays as it is · by: npm run check

## Changelog
- in Python, a name imported from a relative module that is no module itself (`from ..data.m import x`, `from ..data import x`) is answered by `classifyUse` as resolved to the module's file or the package's `__init__.py`, as the absolute form (`from pkg.data.m import x`) already was; in 1.1.0 it was absent, unfollowed. The edges do not change, since the module on the same line already gave the same file, but a consumer that counts unfollowed uses sees far fewer: on the corpus 480 such uses in click, flask and google-cloud-python now resolve. `from . import x` with `x` defined in `__init__.py` still answers unfollowed for `.x`.

## Evidence

### Proof

- **ran (line 3d15d5677292):** node --test test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/resolver.test.mjs (before the change to python-resolve.mts) · **saw:** red: python-relative-member-of-module-edge expected ['absent unfollowed','resolved src/pkg/data/m.py'] to equal ['resolved src/pkg/data/m.py'] on src/pkg/ui/a.py:1; 2 resolver unit tests and the classifyUse test failed on ..data.m.x and ..data.x
- **ran (line 3d15d5677292):** npm run build; node --test test/relations/extractors/python-resolve.test.mjs test/relations/resolver.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/exports.test.mjs (at e91181f) · **saw:** green: pass 61, 74, 32, 3, 18, fail 0 each; ..data.m.x resolved src/pkg/data/m.py, ..data.x resolved src/pkg/data/__init__.py, ..gone.x and ..data.gone.x absent unfollowed
- **ran (line 3d15d5677292):** systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check (at 95fa115, release/1.2.0 at 65848ce merged); npm run coverage · **saw:** check exit 0: tests 2792, pass 2789, fail 0, skipped 3 (go not installed, Rust toolchain absent); dist/ is fresh; coverage exit 0, all files 99.26% lines, 95.89% branches, 99.12% functions

### Notes

Assumed: the relative fallback drops the last name only when the tail after the dots has two or more names. A one-name tail (.missing) is written both by from . import missing and from .missing import y, and the second needs a module, so it never falls back to the package's __init__.py; the existing case python-unresolved-outside-or-unfollowed-silence pins from .missing import helper as unfollowed. from . import name, with name defined in __init__.py, therefore still answers unfollowed for .name beside the resolved answer of the bare dots.

Corpus: npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python,Slim,gin with RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared, before (fb89628) and after (95fa115): passed both times with identical edges (airflow 11615, click 341, flask 322, poetry 1514, google-cloud-python 623, Slim 382, gin 31; 0 added, 0 removed). classifyUse answers of the Python, PHP and Go uses, compared with a scratch harness: 480 relative names move from absent unfollowed to resolved (click 191, flask 159, google-cloud-python 130), each binding the file the module use on its line binds; 248 move from absent unfollowed to ambiguous (airflow 218: import airflow over the five airflow/__init__.py of its distributions; poetry 30); Slim and gin answers unchanged.

