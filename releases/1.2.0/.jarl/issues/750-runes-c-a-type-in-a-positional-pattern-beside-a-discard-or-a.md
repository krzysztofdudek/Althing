# 750 · Runes, C#: a type in a positional pattern beside a discard or a constant gives no edge

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-twkd
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** rev-748-opus
**Where:** the review of 748
**Branch:** jarl/743-csharp-patterns
**Merged:** a7c43d8 in Runes
**Merge check:** npm run check · saw tests 2760, pass 2757, fail 0, skipped 3; dist/ is fresh.

## What
Runes, C#: a type in a positional pattern beside a discard or a constant (x is (Order, _), x is (Models.Order, _), x is (App.Models.Order, 1), a switch arm (Models.Order, _) =>) gives no edge, at c21ceca and at d97e722 alike: the grammar reads the parenthesized list as a constant_pattern over a tuple_expression, which the constant-pattern reading does not take, and the member access inside it reads only its namespace prefix as a receiver. A type pattern in a positional pattern is C# 9 (spec §11.2.6, §11.2.5); a declaration pattern there (x is (Models.Order o, _)) is parsed as a positional subpattern and keeps its edge. A false negative 748 did not touch.

Moved from issue 750 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] x is (Order, _), x is (Models.Order, _), x is (App.Models.Order, 1) and a switch arm (Models.Order, _) => give the edge to Order, in catalogue cases red at v1.1.0 and green after; a name in the same place that the file declares as a value gives none, and every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: a type in a positional pattern beside a discard or a constant (`x is (Order, _)`, `x is (Models.Order, _)`, `x is (App.Models.Order, 1)`, a switch arm `(Models.Order, _) =>`) gives its edge, while a name there that the file declares as a value (`const int Order`) gives none; this can show new findings where such a pattern is a file's only use of a type.

## Reviews
- **approve** · by rev-743-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1204-sirp
  Approve: no Critical or Important finding; two Minor. Read the five commits 845cb0e, 0995b7c, 42749f4, 659e2c1, 619bccf against base 1f3476b. Each [test] line re-run: the seven new cases on a tree of v1.1.0 (743, 750 and 747 edge cases and the 741 silence case red, the three guards green), green at 619bccf; npm run check on a scratch clone green (2760, 2757 pass, 0 fail, 3 skipped, dist/ fresh); mutations of dist turn each guard red for the right reason (is-type exception, value test in a tuple, any written type, beside-the-value-only, negated climb). Corpus: CleanArchitecture, eShop and jellyfin pass corpus:edges; against the 1f3476b goldens the only moves are the 49 edges of 747 (eShop 14, jellyfin 35, none removed), each read at its source line: an enum member compared with or assigned to a property of that enum's type and name, in a file whose property declaration already has the edge to the same file. The C# readings match the spec and Roslyn: o is Config binds the type first (is-type operator), every other pattern binds the expression first, so a value in scope there is a constant; Color Color (12.8.7.2) reads a static member through the type. Conventions hold: one issue per commit, dist/ with src/, rev 44 to 48 one per output change (none for 659e2c1), catalogue 992 to 999 in the test's three places (README.md:201 and CLAUDE.md:9 are the plan's final pass), no trailer, no existing case or test weakened. 900 truncated or spliced C# files raise no exception. Minor 1 (747): an inferred value (a var local, a foreach var, an implicitly typed lambda parameter) is taken as of the type of its own name, so a PascalCase local of another type compared with its own instance member (var Node = f.Root; Node == Node.Parent, Root a TreeNode) gives an edge to an imported type Node the file does not otherwise use; the code comment on besideItself calls Node = Node.Next the one false reading this allows, and the changelog says the new findings sit mostly in files that already depend on the type, so neither names this one; the plan names the risk and the line asks for the var and lambda edge, so the fix is the wording of the comment and the changelog (a qualified written type of another type with an instance member, Other.Status Status beside using App.Model, is a rarer case of the same). Minor 2 (741): the changelog says C# binds the name to the value there, but the test is file-wide: a value Config in another class of the file also silences o is not Config, Config =>, case Config: and Config or string where C# binds the type (4 edges at v1.1.0, none at 619bccf); the plan and the worker's note name it, the changelog could say the value may be anywhere in the file.
  outside the issue, filed as 4: Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type where C# binds a constant the base class declares in another file (class D : Fields, Fields declaring const string Order, gives D's case Order:, Order => and, after 750, (Order, _) an edge to an imported type App.Models.Order, at v1.1.0 for the lone forms and at 619bccf for the tuple too); the receiver reading carries the member condition for this, the pattern readings do not

## Evidence

### Proof

- **ran (line adf7573ad089):** node --test --test-name-pattern=positional test/relations/extractors/csharp-name-resolution-matrix.test.mjs, at 845cb0e (v1.1.0 plus 743, whose change does not reach a tuple) with the two new cases added · **saw:** red: case csharp-pattern-positional-type-beside-discard-edge: expected edge src/c/Use.cs:4->order not emitted (got none); csharp-pattern-positional-value-beside-discard-silence passes
- **ran (line adf7573ad089):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/extractors/csharp.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs, at 0995b7c · **saw:** green: tests 443, pass 443, fail 0; Use.cs:4 to :9 -> order, the const Order beside the type gives silence
- **ran (line adf7573ad089):** npm run check, at 659e2c1 (the clean branch tip) · **saw:** green: tests 2758, pass 2755, fail 0, skipped 3; dist/ is fresh
- **ran (line adf7573ad089):** node --test --test-name-pattern=positional test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on a tree of 1f3476b (v1.1.0) with the branch's seven new cases added, then on a scratch clone of 619bccf; npm run check at 619bccf; a mutation of dist that drops the value test in the tuple reading; probes through the case runner · **saw:** red at v1.1.0: case csharp-pattern-positional-type-beside-discard-edge: expected edge src/c/Use.cs:4->order not emitted (got none); csharp-pattern-positional-value-beside-discard-silence passes at both, and the mutation turns it red; green at 619bccf; npm run check: tests 2760, pass 2757, fail 0, skipped 3; probes: a tuple switch (State.Idle, Act.Start), (List<Order>, _), (global::App.Models.Order, _), (Item1: Order, Item2: _), case (Order, Line):, (Order, var y), (Order or Line, _) and not (Order, _) give only true edges and no duplicate, (null, _) and (1, "a") give none, a local int Order in another method silences (Order, _) (the file-wide test the worker states); the corpus does not move for 750

### Notes

Assumed: a simple name in a positional pattern gives no edge where the file declares a value of that name anywhere (the file-wide test the receiver reading uses), as the line says. C# finds the value only where it is in scope, and a value in scope there compiles only as a constant, so a value of that name in another member drops a true edge; a dotted element is read as the type it spells, first name first, as a lone dotted constant pattern is.

