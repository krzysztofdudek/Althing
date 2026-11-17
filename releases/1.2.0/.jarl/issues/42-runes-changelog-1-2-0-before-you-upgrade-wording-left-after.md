# 42 · Runes CHANGELOG [1.2.0], Before you upgrade, wording left after the final pass (Minor, deferred und…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T2049-gzjd
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-38-opus
**Where:** the review of 38, 188

## What
Runes CHANGELOG [1.2.0], Before you upgrade, wording left after the final pass (Minor, deferred under runes-1-2-0-close-good-enough): (1) the Lines item puts 'A file with LF or CRLF line ends keeps every line it had' after the Kotlin sentence, but the Kotlin move happens in LF files (probe: the kotlin.test.mjs shape after one filler declaration, LF only, primaryConstructor on line 17 at 1.1.0 and 15 at 1.2.0), so the LF sentence belongs right after the lone CR sentence; (2) the Python forms under New edges omit a sibling module of a package below src/ or a configured root (poetry.json in src/poetry/factory.py), a workspace member's tests package (tests.helpers) and a package importing itself beside src/, which the Python section and the catalogue cases python-own-namespace-dir-under-root-not-a-root-edge, python-workspace-member-tests-package-edge and python-package-self-import-beside-src-edge give as new edges; (3) Edges that go away says these edges named something the language does not reach, while the C# section says a value declared in another class, and a constant of a base in another project, can lose an edge C# binds to the type, and the Python section says a real workspace member kept at test/ is taken for a fixture; (4) Errors of a parse says that in 1.1.0 every later parse failed with 'table index is out of bounds', but on a warm 1.1.0 host the later .ts and .cs parses through cached parsers returned trees after the abort, and only a new parser failed (getParser of .py: table index is out of bounds; a new host: memory access out of bounds); it also says every later call rejects, where loadedParserFor returns undefined; (5) 3.5 MB packed: npm pack --dry-run after grammars:package at 80ff400 gives 3 584 909 bytes, which npm prints as 3.6 MB (README and docs/api.md say 3.5 too); (6) the C# example aborts at 32 KiB only as the probe cut it (int x = f( then a < b, repeated and cut at 32 768 bytes, ending mid-unit: Aborted() at 2156 MiB); the same text ending on a whole unit at about 32 KiB gave a tree at 584 MiB.

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: wording points of the published notes, outside the bar of ruling runes-1-2-0-close-good-enough (no wrong answer, no regression)

