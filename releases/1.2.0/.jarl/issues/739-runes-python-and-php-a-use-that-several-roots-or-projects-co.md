# 739 · Runes, Python and PHP: a use that several roots or projects could answer is reported as absent, not as ambiguous with its candidates

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-qkhc
**Tags:** runes, python, php, api
**Files:** 
**Repo:** Runes
**Found by:** w-732-opus
**Where:** jarl/732-readers-for-a-new-tool at 899faf0: classifyUse on a Python module under two project roots, and a PHP class under two PSR-4 roots
**Branch:** jarl/758-python-go-roots
**Worker:** w-758-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:29

## What
After 732, an ambiguous answer names its candidate files in Java, Kotlin, C#, Go and for a symbol declared in several files. In Python a module found under more than one project root, and in PHP a class two PSR-4 prefixes could map, are still answered as absent, with no candidates.

Moved from issue 739 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer cannot tell such a use from one that names no file, so it can neither judge the candidates nor stay quiet.

## Acceptance
[test] In Python and PHP, a use that two roots answer gives ambiguous with both files, sorted, in classifyUse, with one case each, and classify and every edge unchanged · by: npm run check

## Evidence

### Proof

- **ran (line 3cd5b161c033):** node --test test/relations/resolver.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/extractors/php-name-resolution-matrix.test.mjs (tests of 739 over the dist of 9865bf0, before the change) · **saw:** red: python-module-under-two-roots-ambiguous-silence and php-psr4-two-roots-both-hit-ambiguous-silence answered ['absent unfollowed'] where ['ambiguous a/src/shared/util.py, b/src/shared/util.py'] and ['ambiguous lib/Pay/G.php, src/Pay/G.php'] were expected; the Python and PHP classifyUse unit tests got absent unfollowed
- **ran (line 3cd5b161c033):** npm run build; node --test test/relations/resolver.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/extractors/php-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/extractors/php-resolve.test.mjs test/relations/resolve-path.test.mjs test/exports.test.mjs (at e2f1347) · **saw:** green: pass 78, 35, 67, 3, 61, 37, 47, 18, fail 0; both languages ambiguous with both files sorted, classify absent and no edge as before

