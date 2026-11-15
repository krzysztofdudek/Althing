# 739 · Runes, Python and PHP: a use that several roots or projects could answer is reported as absent, not as ambiguous with its candidates

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261113T1739-uveu
**Tags:** runes, python, php, api
**Files:** 
**Repo:** Runes
**Found by:** w-732-opus
**Where:** jarl/732-readers-for-a-new-tool at 899faf0: classifyUse on a Python module under two project roots, and a PHP class under two PSR-4 roots

## What
After 732, an ambiguous answer names its candidate files in Java, Kotlin, C#, Go and for a symbol declared in several files. In Python a module found under more than one project root, and in PHP a class two PSR-4 prefixes could map, are still answered as absent, with no candidates.

## Why
A consumer cannot tell such a use from one that names no file, so it can neither judge the candidates nor stay quiet.

## Acceptance
[test] In Python and PHP, a use that two roots answer gives ambiguous with both files, sorted, in classifyUse, with one case each, and classify and every edge unchanged · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-kotlin-defaults-in-1-1-0

