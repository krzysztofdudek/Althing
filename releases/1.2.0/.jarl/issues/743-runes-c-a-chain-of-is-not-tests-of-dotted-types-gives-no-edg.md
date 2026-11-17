# 743 · Runes, C#: a chain of is not tests of dotted types gives no edge

**Status:** done
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
**Merged:** a7c43d8 in Runes
**Merge check:** npm run check · saw tests 2760, pass 2757, fail 0, skipped 3; dist/ is fresh.
**CI:** green

## What
Runes, C#: a chain of is not tests of dotted types gives no edge: x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give nothing at 8d31e57 and at 7693a11, while a lone x is not App.Models.Order gives the edge to Order. The grammar reads the chain as (x is not App).Models.Order || (x is not App).Models.Line, and its constant pattern sits under a negated pattern, which 708's reading of torn chains does not reach (it asks for the is test as the pattern's parent). 708's changelog line, a dotted type in a chain of is tests gives its edge as a lone test does, reads as covering this form.

Moved from issue 743 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give the edges to Order and Line, as a lone x is not App.Models.Order does, in catalogue cases red at v1.1.0 and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: a chain of `is not` tests of dotted types (`x is not App.Models.Order || x is not App.Models.Line`, and the same with `&&`) gives the edge of each type, as a lone `x is not App.Models.Order` does; this fixes the known limit of 1.1.0 and can show new findings where such a chain is a file's only use of a type.

## Reviews
- **approve** · by rev-743-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1204-sirp
  Approve: no Critical or Important finding; two Minor. Read the five commits 845cb0e, 0995b7c, 42749f4, 659e2c1, 619bccf against base 1f3476b. Each [test] line re-run: the seven new cases on a tree of v1.1.0 (743, 750 and 747 edge cases and the 741 silence case red, the three guards green), green at 619bccf; npm run check on a scratch clone green (2760, 2757 pass, 0 fail, 3 skipped, dist/ fresh); mutations of dist turn each guard red for the right reason (is-type exception, value test in a tuple, any written type, beside-the-value-only, negated climb). Corpus: CleanArchitecture, eShop and jellyfin pass corpus:edges; against the 1f3476b goldens the only moves are the 49 edges of 747 (eShop 14, jellyfin 35, none removed), each read at its source line: an enum member compared with or assigned to a property of that enum's type and name, in a file whose property declaration already has the edge to the same file. The C# readings match the spec and Roslyn: o is Config binds the type first (is-type operator), every other pattern binds the expression first, so a value in scope there is a constant; Color Color (12.8.7.2) reads a static member through the type. Conventions hold: one issue per commit, dist/ with src/, rev 44 to 48 one per output change (none for 659e2c1), catalogue 992 to 999 in the test's three places (README.md:201 and CLAUDE.md:9 are the plan's final pass), no trailer, no existing case or test weakened. 900 truncated or spliced C# files raise no exception. Minor 1 (747): an inferred value (a var local, a foreach var, an implicitly typed lambda parameter) is taken as of the type of its own name, so a PascalCase local of another type compared with its own instance member (var Node = f.Root; Node == Node.Parent, Root a TreeNode) gives an edge to an imported type Node the file does not otherwise use; the code comment on besideItself calls Node = Node.Next the one false reading this allows, and the changelog says the new findings sit mostly in files that already depend on the type, so neither names this one; the plan names the risk and the line asks for the var and lambda edge, so the fix is the wording of the comment and the changelog (a qualified written type of another type with an instance member, Other.Status Status beside using App.Model, is a rarer case of the same). Minor 2 (741): the changelog says C# binds the name to the value there, but the test is file-wide: a value Config in another class of the file also silences o is not Config, Config =>, case Config: and Config or string where C# binds the type (4 edges at v1.1.0, none at 619bccf); the plan and the worker's note name it, the changelog could say the value may be anywhere in the file.
  outside the issue, filed as 4: Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type where C# binds a constant the base class declares in another file (class D : Fields, Fields declaring const string Order, gives D's case Order:, Order => and, after 750, (Order, _) an edge to an imported type App.Models.Order, at v1.1.0 for the lone forms and at 619bccf for the tuple too); the receiver reading carries the member condition for this, the pattern readings do not

## Evidence

### Proof

- **ran (line 0016e37f061d):** node --test --test-name-pattern=is-not-type-test test/relations/extractors/csharp-name-resolution-matrix.test.mjs, at 1f3476b (v1.1.0) with the new case added · **saw:** red: case csharp-is-not-type-test-chain-dotted-edge: expected edge src/c/Use.cs:4->order not emitted (got src/c/Use.cs:3->order)
- **ran (line 0016e37f061d):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractors/csharp.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs, at 845cb0e · **saw:** green: tests 441, pass 441, fail 0; the || and && chains give Use.cs:4 and :5 -> order and line
- **ran (line 0016e37f061d):** npm run check, at 659e2c1 (the clean branch tip) · **saw:** green: tests 2758, pass 2755, fail 0, skipped 3; The build compiler is the pinned one; dist/ is fresh
- **ran (line 0016e37f061d):** node --test --test-name-pattern=is-not-type-test test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on a tree of 1f3476b (v1.1.0) with the branch's seven new cases added, then on a scratch clone of 619bccf; node --test of csharp-name-resolution-matrix, csharp, extractor-rev and catalogue test files at 619bccf; npm run check at 619bccf; a mutation of dist that takes the constant pattern's parent as the test; probes through the case runner; 900 truncated or spliced jellyfin and eShop files through declarations() and uses() · **saw:** red at v1.1.0: case csharp-is-not-type-test-chain-dotted-edge: expected edge src/c/Use.cs:4->order not emitted (got src/c/Use.cs:3->order); green at 619bccf; the four files: tests 447, pass 447, fail 0; npm run check: tests 2760, pass 2757, fail 0, skipped 3, dist/ is fresh; the mutation turns the case red; probes: is not beside is, a ternary, && with x != null, an or pattern, a negated parenthesized test, an enum constant chain (App.Models.Kind.A) give only the true edges, and a switch arm or case not App.Models.Order is unchanged; 0 exceptions in 900 malformed files at both commits; the corpus does not move for 743

### Notes

Assumed: a commit of its own follows the fix (659e2c1): the first form climbed from the constant pattern through each negated pattern with .parent, which the extractors' ancestor guard refuses; npm run check found it, and the walk now carries the test down instead. The output is the same, so no rev moves.

