# 499 · C#: a qualified name in a pattern and a non-plain type after `is` give no edge

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vbnv
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-patterns
**Where:** src/relations/extractors/csharp.mts:1317
**Branch:** jarl/499-csharp-type-positions
**Worker:** w-499-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:51

## What
Claim: The grammar parses `o is App.Models.Order` and a switch arm `Models.Order => …` as a member_access_expression under constant_pattern, and `o is Note[]` and `o is Box<Item>` as an is_expression with a type; the extractor reads neither, so the edge is lost. Pre-existing (5227538 gained `is N.IEnumerable<Order>` through the general qualified-name walk).

probes/csharp p14 lines 4 and 8, p27 lines 3 and 5, p28, p43 line 5 missing; csharp-parse-shapes.mjs output

## Why


## Acceptance
- [test] A qualified type in a pattern (o is App.Models.Order, a qualified type in a not or an or pattern, a switch arm Models.Order => …) gives an edge to that type, with the audit's probes p14 (lines 4 to 8 -> models) and p27 (lines 3, 4 and 5) as catalogue cases, red before and green after · by: npm run check
- [test] An array type and a generic type after is (o is Note[], o is Box<Item>) give an edge to the element type, to the generic type with its arity and to each type argument, with p28 and p43 (lines 4 and 5) as catalogue cases, red before and green after · by: npm run check
- [test] A constant pattern that names an enum member or a constant through its type (s is Status.Active) gives the edge to that type and never to a type named after the member, with a case · by: npm run check

## Changelog
- A delegate declaration is now a type of its node (`delegate void Handler(int id);`, nested and generic ones too), so a field or parameter of a delegate type in another node gives its edge, and a delegate of an enclosing namespace no longer lets an imported class of the same name give a false one; `o is App.Models.Order`, `Models.Order =>`, `o is Note[]`, `o is Box<Item>`, a `ref` return or local (`ref Order`), the type of `from Row r in xs` and `join Cell c in ys`, and the types of `delegate*<Order, void>` now give their edges. A consumer's graph can show new edges, and so new refusals, where these forms cross a boundary.

## Evidence

### Proof

- **ran (line 1b1438346407):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-pattern-qualified-not-or-switch-edge (p14) and csharp-pattern-qualified-type-edge (p27) were red on the base (lines 4, 3 and 5 missing) and pass after 9ea4980; npm run check exit 0, 2158 tests, 0 fail
- **ran (line 0dfceb5cc210):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-pattern-array-type-edge (p28) and csharp-pattern-generic-type-edge (p43) were red on the base and pass after 9ea4980; unit tests for the arity, nullable and array readings pass; npm run check exit 0, 0 fail
- **ran (line bdd983ca7c5f):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-pattern-enum-member-through-type-edge passes (edge to enums, none to the class Active of another node), and a unit test shows a dotted name led by a declared value is no type; npm run check exit 0, 0 fail

### Notes

Assumed: a dotted name in a constant pattern is read as the type it spells (p27 and p14 shapes) unless a value this file declares leads it, as the receiver reading does; the constant-of-a-type form (Status.Active) keeps its receiver edge to Status and names no type after the member because a type of the spelled name must exist in the repository.

