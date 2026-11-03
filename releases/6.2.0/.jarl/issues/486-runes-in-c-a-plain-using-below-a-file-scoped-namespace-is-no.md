# 486 · Runes: in C#, a plain using below a file-scoped namespace is not read for an alias target in a nested block

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**Found by:** rev-runes-476b-fable
**Where:** Review of 476 round 1 (2026-11-03): namespace A; using X; namespace B { using O = Order; } leaves the directive line and the uses of O silent, while a plain Order there binds X.Order; the file-scoped namespace is no NsFrame, so outerList skips it. Same on release/1.1.0 before 476
**Branch:** jarl/485-csharp-global-and-file-scoped
**Merged:** 5227538 in ../../../Runes
**CI:** green

## What
An alias target in a block nested under a file-scoped namespace does not see the plain usings written below that file-scoped namespace.

## Why
A lost edge for a common layout since C# 10.

## Acceptance
docs/api.md says that target lost nearest, that prefixDecls and OuterUsings.prefixes carry the global:: form, and drops UsingScope.prefixes if nothing reads it (review findings 2 to 4 of 476); the file-scoped-plus-block layout of the first finding is invalid C# (CS8955) and needs no binding (ruling csharp-invalid-file-scoped-layout-not-a-bug)

## Changelog
- Fixed: the API page describes how the C# extract keeps a using written after `global::`, lists `scope.aliasDecls`, and says that the `target` descriptor has no `nearest` field.

## Evidence

- **ran:** node --test test/exports.test.mjs (after d24426e) · **saw:** tests 18 pass 18 fail 0; docs/api.md now names the global:: form in scope.prefixDecls (rooted) and outer prefixes, the gone nearest field, scope.aliasDecls, and why scope.prefixes stays

scope.prefixes kept: Yggdrasil's relations facts cache (source/cli/src/relations/facts-cache.ts on its main) copies scope.prefixes and treats a stored extract without it as a cache miss, so it is read by a consumer

open: acceptance item 1 is not C#: the C# 10 file-scoped namespace specification says a source file cannot contain both a file_scoped_namespace_declaration and a namespace_declaration (Roslyn CS8955), so namespace A; using X; namespace B { using O = Order; } does not compile and has no binding; no code change, a question for the jarl
- **ran:** npm run check; npm run coverage; node scripts/corpus.mjs verify --tier all (at d24426e) · **saw:** check: tests 2030 pass 2030, dist fresh; coverage lines 99.02, branches 94.93, functions 98.93; corpus: 33 repositories ok, passed

Ruling csharp-invalid-file-scoped-layout-not-a-bug: Under autonomy-quality: the first acceptance line of 486 describes namespace A; using X; namespace B { ... }, a file-scoped namespace beside a block namespace, which C# refuses (CS8955: a source file cannot contain both). With no binding to match, Runes keeps its answer for that layout and nothing is guessed; 486 keeps its docs line, which d24426e meets.
- **ran:** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 2045, pass 2045, fail 0, dist/ is fresh; corpus verify passed on all 33 (5227538 on release/1.1.0: 481 and 484 merged at 7d949f7, 485 and 486 at 5227538)

