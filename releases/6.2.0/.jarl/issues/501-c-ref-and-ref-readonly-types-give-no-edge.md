# 501 · C#: ref types, the explicit type of a query range variable and function pointer types give no edge

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-gayl
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-reftypes
**Where:** src/relations/extractors/csharp.mts:1055
**Branch:** jarl/499-csharp-type-positions
**Worker:** w-499-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:51

## What
Three type positions name nothing, so the edge is lost. emitTypeNode has no ref_type case, so a ref return, a ref readonly return and a ref local give no edge (spec 15.6.1, 13.6.2). from_clause is read for its variable name only, so the type in `from Row r in xs` is never emitted (spec 12.20.3.2). function_pointer_type falls to the default of emitTypeNode, so `delegate*<Order, void>` names nothing. All three already exist in v1.0.0. Probes: csharp p23, p24, p15 lines 4 to 7, p25, p34. Issues 502 and 503 were merged into this one.

## Why


## Acceptance
- [test] A ref return, a ref readonly return and a ref local give an edge to the named type, with p23, p24 and p15 lines 4 to 6 as catalogue cases, red before and green after · by: npm run check
- [test] The type in a from clause and in a join clause gives an edge, with p25 and p15 line 7 as catalogue cases, red before and green after · by: npm run check
- [test] A function pointer type gives an edge to each parameter type, with p34 as a catalogue case, red before and green after · by: npm run check

## Changelog
- A delegate declaration is now a type of its node (`delegate void Handler(int id);`, nested and generic ones too), so a field or parameter of a delegate type in another node gives its edge, and a delegate of an enclosing namespace no longer lets an imported class of the same name give a false one; `o is App.Models.Order`, `Models.Order =>`, `o is Note[]`, `o is Box<Item>`, a `ref` return or local (`ref Order`), the type of `from Row r in xs` and `join Cell c in ys`, and the types of `delegate*<Order, void>` now give their edges. A consumer's graph can show new edges, and so new refusals, where these forms cross a boundary.

## Reviews
- **changes** · by rev-499-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1111-blhf
  Important (499 line 3, src/relations/extractors/csharp.mts:1468): a dotted constant in a pattern is also read as the type it spells with no check that its first name binds nearer to a type, so a constant through a type gives a false edge to a type of the same spelling behind it. Reproduced on the tip, absent on the base: (a) `namespace App.Core; class Check { bool A(int n) => n is Limits.Max; }` beside `App.Core.Limits` (const Max, node core) and a global `namespace Limits; class Max` (node other) gives Check.cs:3->other besides ->core; (b) the same for `case Colors.Red:` and a switch arm `Colors.Blue =>` against a global `namespace Colors { class Red; class Blue }`; (c) the same for `s is Status.Active`, `not Kind.A` and `Kind.A or Kind.A` when the enum comes through a using directive inside the namespace block and a global namespace of the enum name holds a class of the member name. In each C# binds the first name to the nearer type, so the name is a constant and the second edge is false; the receiver reading already gives the right one. Important (499 line 3, reference/relations/csharp/csharp-pattern-enum-member-through-type-edge.md): the case passes on the base code as well and its trap, a class Active in another namespace, is one the type reading can never reach, so it cannot fail for the reason the line names; it needs the shape above (a type spelled Status.Active behind the nearer type Status), red before the fix of the first finding. Minor (src/relations/extractors/csharp.mts:1468): a name declared anywhere in the file as a value (`int Models = 1;` in another method) drops `o is Models.Order` in every method; a missed edge, the direction the contract allows, and no edge existed before. 496 and 501: no finding; delegates (nested in a generic type, generic with its own type parameters, without an access modifier, of the own namespace over an imported class), `is` with array, nullable and qualified generic types, a nested function pointer, a qualified type in a from clause and a ref readonly return all gave the right edges in my probes. Nothing outside the three issues moved: the catalogue count went 688 to 703 for 15 new cases, the extractor rev 17 to 18, dist is fresh, no threshold or guard changed. Not checked: npm run coverage, and the cases through a real C# compiler (the bindings are argued from the C# name lookup rules).

## Evidence

### Proof

- **ran (line 0b1543fff88d):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-ref-return-type-edge (p23), csharp-ref-local-type-edge (p24) and csharp-ref-and-query-types-edge (p15 lines 4 to 7 without the lambda line) were red on the base and pass after the 501 fix commit; npm run check exit 0, 0 fail
- **ran (line 48f8917b0cac):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-query-range-variable-type-edge (p25, with a join clause on its own line) was red on the base and passes after the 501 fix commit; npm run check exit 0, 0 fail
- **ran (line ade3a4df5e8e):** nice -n 15 npm run check (clean committed tree, branch tip) · **saw:** csharp-function-pointer-type-edge (p34) was red on the base and passes after the 501 fix commit; npm run check exit 0, 0 fail; npm run coverage exit 0 (99.01 lines, 95.24 branches, 99.00 functions)
- **ran (line 0b1543fff88d):** nice -n 15 npm run check (a git archive of the branch tip 35dacf6, under a 12G cap) · **saw:** 2158 tests, 2157 pass, 0 fail, 1 skipped; the rebuilt dist is identical to the committed one (compared by diff -r, the archive has no git). csharp-ref-return-type-edge, csharp-ref-local-type-edge and csharp-ref-and-query-types-edge pass; all three fail on the base's code.
- **ran (line 48f8917b0cac):** nice -n 15 npm run check (a git archive of the branch tip 35dacf6, under a 12G cap) · **saw:** 2158 tests, 2157 pass, 0 fail, 1 skipped; the rebuilt dist is identical to the committed one (compared by diff -r, the archive has no git). csharp-query-range-variable-type-edge passes; it fails on the base's code.
- **ran (line ade3a4df5e8e):** nice -n 15 npm run check (a git archive of the branch tip 35dacf6, under a 12G cap) · **saw:** 2158 tests, 2157 pass, 0 fail, 1 skipped; the rebuilt dist is identical to the committed one (compared by diff -r, the archive has no git). csharp-function-pointer-type-edge passes; it fails on the base's code.

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: the function pointer's return type is read as well as its parameter types (delegate*<Order, ref Item, Result> gives Result too), since it is a type of the same construct; and p15 line 8 (a lambda with an explicit return type) is outside this issue, so the catalogue case takes p15 lines 4 to 7 only.

