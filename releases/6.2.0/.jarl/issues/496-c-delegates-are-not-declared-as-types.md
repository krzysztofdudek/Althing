# 496 · C#: delegates are not declared as types

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-oqnx
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-delegate
**Where:** src/relations/extractors/csharp.mts:120
**Branch:** jarl/499-csharp-type-positions
**Worker:** w-499-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:51

## What
Claim: TYPE_DECLARATION_TYPES leaves out delegate_declaration, so a delegate type used in another node gives no edge, and a delegate of the enclosing namespace does not hide an imported class of the same name (a false edge). A delegate is a type (spec 21). Pre-existing in v1.0.0.

probes/csharp p07 (silence, expected Bus.cs:4->core), p33 (silence, expected Use.cs:4->core), p08 (Bus.cs:4->core, expected silence); same on v1.0.0

## Why


## Acceptance
- [test] A delegate declaration publishes a type key as a class does, top-level and nested (Outer+Handler), with its arity when generic, with the audit's probes p07 (Bus.cs:4 -> core) and p33 (Use.cs:4 -> core) as catalogue cases, red before and green after (C# spec §21) · by: npm run check
- [test] A delegate of an enclosing namespace hides an imported class of the same name, with p08 as a catalogue case (silence), red before and green after · by: npm run check
- [test] A file-local delegate is not published, as a file-local class is not, with a case · by: npm run check

## Changelog
- A delegate declaration is now a type of its node (`delegate void Handler(int id);`, nested and generic ones too), so a field or parameter of a delegate type in another node gives its edge, and a delegate of an enclosing namespace no longer lets an imported class of the same name give a false one; `o is App.Models.Order`, `Models.Order =>`, `o is Note[]`, `o is Box<Item>`, a `ref` return or local (`ref Order`), the type of `from Row r in xs` and `join Cell c in ys`, and the types of `delegate*<Order, void>` now give their edges. A consumer's graph can show new edges, and so new refusals, where these forms cross a boundary.

## Reviews
- **changes** · by rev-499-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1111-blhf
  Important (499 line 3, src/relations/extractors/csharp.mts:1468): a dotted constant in a pattern is also read as the type it spells with no check that its first name binds nearer to a type, so a constant through a type gives a false edge to a type of the same spelling behind it. Reproduced on the tip, absent on the base: (a) `namespace App.Core; class Check { bool A(int n) => n is Limits.Max; }` beside `App.Core.Limits` (const Max, node core) and a global `namespace Limits; class Max` (node other) gives Check.cs:3->other besides ->core; (b) the same for `case Colors.Red:` and a switch arm `Colors.Blue =>` against a global `namespace Colors { class Red; class Blue }`; (c) the same for `s is Status.Active`, `not Kind.A` and `Kind.A or Kind.A` when the enum comes through a using directive inside the namespace block and a global namespace of the enum name holds a class of the member name. In each C# binds the first name to the nearer type, so the name is a constant and the second edge is false; the receiver reading already gives the right one. Important (499 line 3, reference/relations/csharp/csharp-pattern-enum-member-through-type-edge.md): the case passes on the base code as well and its trap, a class Active in another namespace, is one the type reading can never reach, so it cannot fail for the reason the line names; it needs the shape above (a type spelled Status.Active behind the nearer type Status), red before the fix of the first finding. Minor (src/relations/extractors/csharp.mts:1468): a name declared anywhere in the file as a value (`int Models = 1;` in another method) drops `o is Models.Order` in every method; a missed edge, the direction the contract allows, and no edge existed before. 496 and 501: no finding; delegates (nested in a generic type, generic with its own type parameters, without an access modifier, of the own namespace over an imported class), `is` with array, nullable and qualified generic types, a nested function pointer, a qualified type in a from clause and a ref readonly return all gave the right edges in my probes. Nothing outside the three issues moved: the catalogue count went 688 to 703 for 15 new cases, the extractor rev 17 to 18, dist is fresh, no threshold or guard changed. Not checked: npm run coverage, and the cases through a real C# compiler (the bindings are argued from the C# name lookup rules).

## Evidence

### Proof

- **ran (line 549b7f059d11):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** exit 0: 2158 tests, 2157 pass, 0 fail, 1 skipped (pre-existing); dist is fresh. Before the fix the new cases were red on the base: delegate declared, nested, enclosing-namespace and generic-arity cases failed (4 of 5; the file-local case is a guard, green before and after); the cases csharp-delegate-declared-edge (p07), csharp-delegate-nested-edge (p33) and csharp-delegate-generic-arity-edge pass after commit 47680c4
- **ran (line 99cfaa26c64d):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-delegate-enclosing-namespace-hides-imported-class-silence (p08) was red on the base (false edge Bus.cs:4->core) and passes after 47680c4; npm run check exit 0, 2158 tests, 0 fail
- **ran (line 1b234c58ebc7):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-delegate-file-local-not-published-edge passes after 47680c4 (a guard: green before and after, it fails if a file-local delegate were published); npm run check exit 0, 0 fail
- **ran (line 549b7f059d11):** nice -n 15 npm run check (a git archive of the branch tip 35dacf6, under a 12G cap) · **saw:** 2158 tests, 2157 pass, 0 fail, 1 skipped; the rebuilt dist is identical to the committed one (compared by diff -r, the archive has no git). csharp-delegate-declared-edge, -nested-edge and -generic-arity-edge pass; with the new cases laid over the base's code all three fail.
- **ran (line 99cfaa26c64d):** nice -n 15 npm run check (a git archive of the branch tip 35dacf6, under a 12G cap) · **saw:** 2158 tests, 2157 pass, 0 fail, 1 skipped; the rebuilt dist is identical to the committed one (compared by diff -r, the archive has no git). csharp-delegate-enclosing-namespace-hides-imported-class-silence passes; it fails on the base's code.
- **ran (line 1b234c58ebc7):** nice -n 15 npm run check (a git archive of the branch tip 35dacf6, under a 12G cap) · **saw:** 2158 tests, 2157 pass, 0 fail, 1 skipped; the rebuilt dist is identical to the committed one (compared by diff -r, the archive has no git). csharp-delegate-file-local-not-published-edge passes; it passes on the base's code too, as a guard.

### Notes

Assumed: a delegate publishes its key through a separate set of declarations that publish a type key, not through the set of type declarations, so the scopes the walk carries (enclosing types, nested-type lookup) are unchanged; the file-local case is an edge case (the name reaches Lib.Hook) so it is red if a file-local delegate were published.

