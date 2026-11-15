# 743 · Runes, C#: a chain of is not tests of dotted types gives no edge: x is not App.Models.Order || x is…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261113T1825-ioxi
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708

## What
Runes, C#: a chain of is not tests of dotted types gives no edge: x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give nothing at 8d31e57 and at 7693a11, while a lone x is not App.Models.Order gives the edge to Order. The grammar reads the chain as (x is not App).Models.Order || (x is not App).Models.Line, and its constant pattern sits under a negated pattern, which 708's reading of torn chains does not reach (it asks for the is test as the pattern's parent). 708's changelog line, a dotted type in a chain of is tests gives its edge as a lone test does, reads as covering this form.

## Why


## Acceptance


## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-csharp-review-findings

