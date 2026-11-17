# 758 · Runes, Python: from .m import Name is answered unfollowed when Name is not a module, where from pkg.m import Name resolves to the module fi…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261115T1054-rhmz
**Tags:** api, python, runes
**Files:** Runes/src/relations/extractors/python-resolve.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-python-relative-member
**Where:** Runes/src/relations/extractors/python-resolve.mts:254, Runes/src/relations/extractors/python-resolve.mts:126, Runes/src/relations/extractors/python-resolve.mts:207

## What
Claim: At v1.1.0 resolveAbsolute drops the last segment when the whole dotted name binds no file, so pkg.data.m.x resolves to data/m.py, and the package form pkg.data.x resolves to data/__init__.py. resolveRelative has no such step, and explain answers unfollowed for every relative specifier, so ..data.m.x and ..data.x are answered {"kind":"absent","reason":"unfollowed"} though the module file exists. The reporter counted 347 such answers in django and 4,127 in sqlalchemy, every one a relative import.

repros.sh py_relative_vs_absolute: from ..data.m import x printed ..data.m.x unfollowed; from pkg.data.m import x printed pkg.data.m.x resolved to src/pkg/data/m.py; from ..data import x printed ..data.x unfollowed; from pkg.data import x printed pkg.data.x resolved to src/pkg/data/__init__.py

## Why


The same file is answered resolved when the import is written absolute and unfollowed when it is written relative, so a consumer that counts unfollowed uses shows thousands of them in a repository where almost none is a gap (347 in django, 4,127 in sqlalchemy, every one relative), and the count stops being a signal. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In Python, from ..data.m import x and from ..data import x give resolved to the module file or the package's __init__.py in classifyUse, as from pkg.data.m import x and from pkg.data import x do, in a unit test and a catalogue case, red at v1.1.0 (unfollowed) and green after; a relative path that binds no file stays unfollowed, and every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: Moved to the Runes 1.2.0 loop (releases/1.2.0) under the same number, on the owner's answer to a-41 and a-42; it is worked and closed there

