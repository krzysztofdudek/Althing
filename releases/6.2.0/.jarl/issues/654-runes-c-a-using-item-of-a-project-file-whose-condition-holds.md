# 654 · Runes, C#: a Using item of a project file whose Condition holds a raw > before its Include is not r…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2018-zbqe
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-549-opus
**Where:** the review of 549, 552, 555, 559, 577, 584, 594, 595, 619, 628, 636
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Runes, C#: a Using item of a project file whose Condition holds a raw > before its Include is not read (src/relations/extractors/csharp-project.mts:102 still reads the tag up to the first >; the property readers at csharp-msbuild.mts:26 and csharp-reach.mts:181, and the HintPath and _Parameter1 child elements, read a start tag the same way): <Using Condition="'$(LangVersion)' > '10'" Include="App.Core" /> in Web.csproj gives no edge from Order _o in src/Web/Api.cs, where the &gt; spelling gives src/Web/Api.cs:3->Core. The same on the base; the readers 552 fixed use the quoted-value text (ATTRS) and these do not.

## Why


## Acceptance


[test] A project file's Using, property, HintPath and _Parameter1 elements are read when an attribute value holds a raw > (Condition="'$(LangVersion)' > '10'"), as with &gt;, as catalogue cases, red before and green after · by: npm run check

## Changelog
- Fixed: C#: a project file's `<Using>` item, `<AssemblyName>` and `<ImplicitUsings>` property, `<HintPath>` and `<_Parameter1>` element, and its `<Project Sdk>`, are read when an attribute written before the value holds a raw `>` (`Condition="'$(LangVersion)' > '10'"`), as with `&gt;`.

## Evidence

### Proof

- **ran (line 9f58b63cac40):** node --test test/relations/extractors/csharp-project.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs (Runes, commit a8cf6f1, before the fix) · **saw:** fail 4 of the cases and 1 unit test: csharp-csproj-using-item-condition-raw-greater-than-edge, csharp-assembly-name-condition-raw-greater-than-edge, csharp-hintpath-condition-raw-greater-than-edge, csharp-internals-visible-to-parameter-condition-raw-greater-than-edge, and the ImplicitUsings/Project unit test
- **ran (line 9f58b63cac40):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f) · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions; the same files at 39efdee: pass 356, fail 0
- **ran (line 9f58b63cac40):** the branch's catalogue and matrix test files copied into a scratch extraction of c5124ca, node --test test/relations/extractors/<language>-name-resolution-matrix.test.mjs; then on a scratch extraction of 90c330f: npm run build, npm run grammars, node --test --test-concurrency=6 on every test file with rustc and cargo 1.99.1 on PATH, dist compared with the committed dist · **saw:** before: csharp-csproj-using-item-condition-raw-greater-than-edge, csharp-assembly-name-condition-raw-greater-than-edge, csharp-hintpath-condition-raw-greater-than-edge and csharp-internals-visible-to-parameter-condition-raw-greater-than-edge fail; after: 2649 tests, 2648 pass, 0 fail, 1 skipped (go not installed), the two rustc build tests ran and passed, rebuilt dist identical to the committed one; no tag reader of the C# project files is left with [^>]*

