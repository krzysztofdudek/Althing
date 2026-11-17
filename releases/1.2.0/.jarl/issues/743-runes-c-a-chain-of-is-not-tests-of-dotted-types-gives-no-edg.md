# 743 · Runes, C#: a chain of is not tests of dotted types gives no edge

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-nvgi
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708
**Branch:** jarl/743-csharp-patterns
**Worker:** w-743-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:00

## What
Runes, C#: a chain of is not tests of dotted types gives no edge: x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give nothing at 8d31e57 and at 7693a11, while a lone x is not App.Models.Order gives the edge to Order. The grammar reads the chain as (x is not App).Models.Order || (x is not App).Models.Line, and its constant pattern sits under a negated pattern, which 708's reading of torn chains does not reach (it asks for the is test as the pattern's parent). 708's changelog line, a dotted type in a chain of is tests gives its edge as a lone test does, reads as covering this form.

Moved from issue 743 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give the edges to Order and Line, as a lone x is not App.Models.Order does, in catalogue cases red at v1.1.0 and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: a chain of `is not` tests of dotted types (`x is not App.Models.Order || x is not App.Models.Line`, and the same with `&&`) gives the edge of each type, as a lone `x is not App.Models.Order` does; this fixes the known limit of 1.1.0 and can show new findings where such a chain is a file's only use of a type.

## Evidence

### Proof

- **ran (line 0016e37f061d):** node --test --test-name-pattern=is-not-type-test test/relations/extractors/csharp-name-resolution-matrix.test.mjs, at 1f3476b (v1.1.0) with the new case added · **saw:** red: case csharp-is-not-type-test-chain-dotted-edge: expected edge src/c/Use.cs:4->order not emitted (got src/c/Use.cs:3->order)
- **ran (line 0016e37f061d):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractors/csharp.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs, at 845cb0e · **saw:** green: tests 441, pass 441, fail 0; the || and && chains give Use.cs:4 and :5 -> order and line
- **ran (line 0016e37f061d):** npm run check, at 659e2c1 (the clean branch tip) · **saw:** green: tests 2758, pass 2755, fail 0, skipped 3; The build compiler is the pinned one; dist/ is fresh

### Notes

Assumed: a commit of its own follows the fix (659e2c1): the first form climbed from the constant pattern through each negated pattern with .parent, which the extractors' ancestor guard refuses; npm run check found it, and the walk now carries the test down instead. The output is the same, so no rev moves.

