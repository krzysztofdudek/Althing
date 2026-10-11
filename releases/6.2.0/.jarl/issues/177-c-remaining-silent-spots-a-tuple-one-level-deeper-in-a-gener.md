# 177 · C#: remaining silent spots (a tuple one level deeper in a generic argument, an unnamed qualified element next to a named one, using P = global::Program, global::Helpers.H(), F(x < Limits.Max, y > z), type parameter names muted as a call receiver across the whole file)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 138, 150, 156, 161
**Found by:** rev-runes-138
**Where:**
**Branch:** jarl/177-csharp-forms
**Worker:** runes-177
**Worktree:** /Users/me/.jarl-wt/Runes-177
**Since:** 2026-10-05 16:22
**Merged:** 2cebb0c9732aa2ee06a69304e00529e807c92421 in ../../../Runes
**CI:** pending

## What
The reviewer of package 138 collected the spots that still give no edge (not false edges): new List<List<(Customer Who, int I)>>(n) (the grammar reads it as a >> operand), (Order O, Shop.Core.Customer), using P = global::Program, global::Helpers.H(), F(x < Limits.Max, y > z), and Entity.Create() in a neighbouring class of a file with Repo<Entity> (type parameter names muted as a receiver across the whole file — from before the patch).

## Why
Silent dependencies in real C# code.

## Acceptance
Each form gives an edge or is a documented silence; catalogue cases.

## Changelog
- Fixed: an unnamed element beside a named one in a tuple type argument, written qualified, with `global::` or as a generic, as in `new List<(Order O, Shop.Core.Customer)>(n)` and `new List<(int I, Shop.Core.Repo<Order>)>(n)`, now gives its edge; `F(x < Limits.Max, y > z)` gives the edge to the type `Limits`; a type parameter scopes to its own declaration, so `Entity.Create()` in a sibling class beside `Repo<Entity>` gives its edge. Can make a consumer's graph show new edges, so a graph that was green may turn red after the upgrade.

## Evidence


- **ran:** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs · **saw:** before the extractor change, with the seven new cases added: tests 109, pass 102, fail 7; each new case failed with its expected edge not emitted
- **ran:** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs · **saw:** after the change: tests 114, pass 114, fail 0
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** pass 1743, fail 0; dist/ is fresh
- **ran:** nice -n 15 timeout 1800 npm run coverage · **saw:** all files: lines 98.81 (threshold 98), branches 94.45 (threshold 92), functions 98.80 (threshold 97)
- **ran:** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (commit b7b8aa2 on the base, the four 177 cases added, the extractor held at the base) · **saw:** tests 106, pass 102, fail 4: csharp-tuple-unnamed-qualified-element-edge, csharp-tuple-unnamed-global-generic-element-edge, csharp-comparison-pair-qualified-operand-edge, csharp-type-parameter-sibling-receiver-edge, each with its expected edge not emitted
- **ran:** the same command with the extractor change, rev 5 to 6 · **saw:** tests 106, pass 106, fail 0; nice -n 15 npm test on the commit: pass 1740, fail 0

second round: the unnamed tuple element beside a named one now gives its edge also when written with global:: or as a generic (qualified or bare), new case csharp-tuple-unnamed-global-generic-element-edge; global::Helpers.H() is the shape of the existing case csharp-global-qualifier-member-access-edge (no new case); a type parameter at the head of a dotted tuple element emits nothing (CS0704); catalogue 522 to 526 in this commit

docs: README.md and CLAUDE.md: the catalogue count (522 cases) is 531 after this package (177 +4, 185 +3 with two renamed cases, 188 +2); the three commits are b7b8aa2 (177), ca2a7b7 (185), f8285fd (188 C#), extractor rev 6 in the first
- **ran:** npm run check · **saw:** tests 1795, pass 1795, fail 0; dist/ is fresh; npm run coverage: lines 98.98, branches 94.68, functions 99.06, merge 2cebb0c

