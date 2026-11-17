# 40 · Runes, Kotlin: the recovery lexer (kotlin-recover.mts tokenize and the chunk splitter) ends a line …

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1932-bgbj
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-764-opus
**Where:** the review of 764

## What
Runes, Kotlin: the recovery lexer (kotlin-recover.mts tokenize and the chunk splitter) ends a line at LF alone, so a file whose lines end with a lone CR and that holds any ERROR is cut into no top-level declarations: it gives no use at all and only the package-incomplete declaration. Repro at release/1.2.0 f64a1ca and at jarl/764-lone-cr-lines b710510: "package a\rimport b.B\rclass K { val c: d.C? = null }\rclass L { val c: d.D? = null }\r" gives no use and the declaration `*` on line 1, where the same file with LF ends gives b.B, d.C and d.D and four declarations. Both files parse with an ERROR, which sends them to the recovery.

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: the recovery lexer counted LF alone at v1.1.0 too (ruling runes-1-2-0-cut-for-new-findings); 39 holds the lone-CR parse of the other grammars

