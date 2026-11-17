# 741 · Runes, C#: a lone o is Config, where Config is a value the file declares, is still read as a type

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-imsh
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** w-696-opus
**Where:** jarl/696-csharp at 7693a11, the C# is-pattern reading
**Branch:** jarl/743-csharp-patterns
**Merged:** a7c43d8 in Runes
**Merge check:** npm run check · saw tests 2760, pass 2757, fail 0, skipped 3; dist/ is fresh.

## What
After 708, a dotted head of an is chain that the file declares as a value reads nothing. A lone o is Config, where Config is a field, a property or a local the file declares, is still read as the type Config, which can give an edge to a file that declares a type of that name.

Moved from issue 741 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
An edge to a type named like a value of the file is a false edge where such a type exists elsewhere in the repository.

## Acceptance
[test] Where the file declares a value Config, a switch arm Config =>, case Config:, o is not Config, and Config inside an or, and or parenthesized pattern give no edge to a type Config, while o is Config (the is-type operator, which C# binds to the type first) keeps its edge, and a type Config the file does not shadow keeps its edge everywhere; catalogue cases red at v1.1.0 and green after, and every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: where a file declares a value `Config` (a constant, a field, a property, a local), a switch arm `Config =>`, `case Config:`, `o is not Config` and `Config` in an `or`, `and` or parenthesized pattern no longer give an edge to a type `Config`, since C# binds the name to the value there; `o is Config` keeps its edge to the type, which C# binds first. The value may be declared anywhere in the file, also in another class, where C# would bind the type, so an edge can be lost there. An edge that goes away can leave a declared relation with no code behind it.

## Reviews
- **approve** · by rev-743-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1204-sirp
  Approve: no Critical or Important finding; two Minor. Read the five commits 845cb0e, 0995b7c, 42749f4, 659e2c1, 619bccf against base 1f3476b. Each [test] line re-run: the seven new cases on a tree of v1.1.0 (743, 750 and 747 edge cases and the 741 silence case red, the three guards green), green at 619bccf; npm run check on a scratch clone green (2760, 2757 pass, 0 fail, 3 skipped, dist/ fresh); mutations of dist turn each guard red for the right reason (is-type exception, value test in a tuple, any written type, beside-the-value-only, negated climb). Corpus: CleanArchitecture, eShop and jellyfin pass corpus:edges; against the 1f3476b goldens the only moves are the 49 edges of 747 (eShop 14, jellyfin 35, none removed), each read at its source line: an enum member compared with or assigned to a property of that enum's type and name, in a file whose property declaration already has the edge to the same file. The C# readings match the spec and Roslyn: o is Config binds the type first (is-type operator), every other pattern binds the expression first, so a value in scope there is a constant; Color Color (12.8.7.2) reads a static member through the type. Conventions hold: one issue per commit, dist/ with src/, rev 44 to 48 one per output change (none for 659e2c1), catalogue 992 to 999 in the test's three places (README.md:201 and CLAUDE.md:9 are the plan's final pass), no trailer, no existing case or test weakened. 900 truncated or spliced C# files raise no exception. Minor 1 (747): an inferred value (a var local, a foreach var, an implicitly typed lambda parameter) is taken as of the type of its own name, so a PascalCase local of another type compared with its own instance member (var Node = f.Root; Node == Node.Parent, Root a TreeNode) gives an edge to an imported type Node the file does not otherwise use; the code comment on besideItself calls Node = Node.Next the one false reading this allows, and the changelog says the new findings sit mostly in files that already depend on the type, so neither names this one; the plan names the risk and the line asks for the var and lambda edge, so the fix is the wording of the comment and the changelog (a qualified written type of another type with an instance member, Other.Status Status beside using App.Model, is a rarer case of the same). Minor 2 (741): the changelog says C# binds the name to the value there, but the test is file-wide: a value Config in another class of the file also silences o is not Config, Config =>, case Config: and Config or string where C# binds the type (4 edges at v1.1.0, none at 619bccf); the plan and the worker's note name it, the changelog could say the value may be anywhere in the file.
  outside the issue, filed as 4: Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type where C# binds a constant the base class declares in another file (class D : Fields, Fields declaring const string Order, gives D's case Order:, Order => and, after 750, (Order, _) an edge to an imported type App.Models.Order, at v1.1.0 for the lone forms and at 619bccf for the tuple too); the receiver reading carries the member condition for this, the pattern readings do not

## Evidence

### Proof

- **ran (line 51e36b583a18):** node --test --test-name-pattern='value-of-file|value-of-its-name' test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on the source at 659e2c1 (whose lone-name pattern reading is v1.1.0's) with the two new cases · **saw:** red: case csharp-pattern-constant-value-of-file-silence: unexpected cross-owner edge src/c/Use.cs:5->lib; csharp-is-type-test-beside-value-of-its-name-edge passes
- **ran (line 51e36b583a18):** npm run check, at 619bccf (the clean branch tip) · **saw:** green: tests 2760, pass 2757, fail 0, skipped 3; both new cases pass; The build compiler is the pinned one; dist/ is fresh
- **ran (line 51e36b583a18):** node --test --test-name-pattern='value-of-file|value-of-its-name' test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on a tree of 1f3476b (v1.1.0) with the branch's seven new cases and their runCase lines added, then on a scratch clone of 619bccf; npm run check on that clone; a mutation of dist that drops the is-type exception; probes through the case runner at 1f3476b and 619bccf · **saw:** red at v1.1.0: case csharp-pattern-constant-value-of-file-silence: unexpected cross-owner edge src/c/Use.cs:5->lib; csharp-is-type-test-beside-value-of-its-name-edge passes at both, and the mutation turns it red; green at 619bccf; npm run check: tests 2760, pass 2757, fail 0, skipped 3, The build compiler is the pinned one, dist/ is fresh; probes beside const int Config: o is Config c, o is Config { }, o is Lib.Config and !(o is Config) keep the edge, not not Config, not Config =>, [Config, ..] give none; a value Config declared in another class of the same file also silences o is not Config, Config =>, case Config: and Config or string there, where C# binds the type (4 edges at v1.1.0, none at 619bccf; o is Config keeps its edge); corpus CleanArchitecture, eShop, jellyfin do not move for 741

### Notes

Ruling ask-3 (stuck, by jarl): The jarl chose option b, the C# reading: a lone name the file declares as a value gives no edge where C# binds the pattern's expression first (a switch arm Config =>, case Config:, o is not Config, an or or and pattern, a parenthesized pattern, a positional subpattern), while o is Config, the is-type operator, keeps the edge to the type, as C# tests the type first there. The line as filed would drop a true edge, a false green; 741's acceptance line is rewritten to this reading.

Assumed: the value test is the file-wide one the receiver reading uses (a name the file declares as a value and not only as a type), as the line says 'where the file declares a value Config'; C# finds only a value in scope, so a value of that name in another member drops a true edge in these pattern forms. npm run coverage at 619bccf passes (all files 99.21% lines, 95.82% branches, 99.04% functions); the corpus of CleanArchitecture, eShop and jellyfin does not move.

