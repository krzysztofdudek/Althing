# 41 · Runes, Kotlin: in a damaged file that mixes lone CR and LF line ends, a declaration that the recove…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T2009-ggcg
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-764-opus
**Where:** the review of 764

## What
Runes, Kotlin: in a damaged file that mixes lone CR and LF line ends, a declaration that the recovery cannot read and that follows a lone CR on the same LF line is lost without the package being marked incomplete, because the chunk splitter cuts at LF alone (the cause of issue 40). Repro at release/1.2.0 f64a1ca and at jarl/764-lone-cr-lines b52aae8: "package a\nval s = 1\rpublic %% class Thing\nclass Ok\n" gives a.s, a.Ok and the facade but no a.*, where the same file with the CR made an LF gives a.* as well. Without a.* the file claims a complete package that lacks Thing.

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: same cause as 40, present at f64a1ca and at v1.1.0, shows only in damaged Kotlin files with lone CRs (rulings runes-1-2-0-cut-for-new-findings and runes-1-2-0-close-good-enough)

