# 188 · Runes: leftovers after 168/178/181 (slow tree-sitter parsing of garbage input; the tsconfig field in package.json and <sub>/tsconfig.json without exports; S::Gen<T> and S::A.Foo in C# type positions; autobins and the edition 2015 rule in Cargo; other extractors still use .parent/closest)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, 1.1.0
**Files:** Runes/src/relations
**Repo:** ../../../Runes
**After:** 168, 178, 181
**Found by:** runes-168
**Where:**
**Branch:** jarl/177-csharp-forms
**Merged:** 2cebb0c9732aa2ee06a69304e00529e807c92421 in ../../../Runes
**CI:** pending

## What
Collected by the worker of package 168: tree-sitter parses garbage at 13–16 s/MB; tsconfig: the tsconfig field in package.json and <sub>/tsconfig.json without exports are not read; C#: S::Gen<T> and S::A.Foo in type positions are silent; Cargo: autobins and the edition 2015 rule are not read; the remaining extractors still walk .parent/closest (a quadratic risk like 168).

## Why
Silent edges and potential performance costs on large files.

## Acceptance
Each point resolved or described as a silence with a test; extractor passes linear.

## Changelog
- Fixed: a generic type or a dotted name written under a namespace alias, such as `S::Gen<T>` and `S::Core.Order`, now gives its edge, as an attribute under the same alias already did.

## Evidence

jarl: per the 6.2.0 plan, 188 stays with the C# part (package R3); the TS extends part split off into 236, Cargo into 237, the linear passes into 238; the cost of parsing garbage input: ruling plan-6-2-0 D10 (described in CHANGELOG and README).
- **ran:** nice -n 15 timeout 300 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs · **saw:** before the extractor change: csharp-alias-colon-colon-generic-edge failed (no edge for S::Gen<int>), csharp-alias-colon-colon-qualified-tail-edge failed; after: both pass
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** pass 1743, fail 0; dist/ is fresh
- **ran:** nice -n 15 timeout 1800 npm run coverage · **saw:** all files: lines 98.81 (threshold 98), branches 94.45 (threshold 92), functions 98.80 (threshold 97)
- **ran:** nice -n 15 timeout 300 node --test on csharp-name-resolution-matrix and csharp-branch-coverage tests (commit f8285fd on the 185 commit, the two cases added, the extractor held at the previous commit) · **saw:** tests 122, pass 119, fail 3: csharp-alias-colon-colon-generic-edge, csharp-alias-colon-colon-qualified-tail-edge, and the R13 no-key unit test
- **ran:** the same command with the extractor change; then nice -n 15 npm run check and nice -n 15 npm run coverage on the tip f8285fd · **saw:** after: all pass; check: pass 1745, fail 0, dist/ is fresh; coverage: lines 98.79, branches 94.35, functions 98.81 (thresholds 98, 92, 97)
- **ran:** npm run check · **saw:** tests 1795, pass 1795, fail 0; dist/ is fresh; npm run coverage: lines 98.98, branches 94.68, functions 99.06, merge 2cebb0c

2026-10-28 tidy-up: the worktree directory is gone; the Runes part of this issue is merged into release/1.1.0 (its branch has no commit beyond it); what remains is the part in Yggdrasil and Grain named in the acceptance; the lease ends and the issue returns to the queue

correction to the line above: this issue is Runes only; its branch is merged into release/1.1.0, and parts of it were split off as 236, 237 and 238; what is left of it is to be read from its acceptance against release/1.1.0

