# 559 · C#: a Reference whose HintPath is written as an attribute (<Reference Include="X" HintPath="..\A\bi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1147-kgnr
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**Found by:** rev-505-fable
**Where:** the review of 505
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
C#: a Reference whose HintPath is written as an attribute (<Reference Include="X" HintPath="..\A\bin\A.dll" />) is not read, so the referencing project loses sight of project A when the Include names something else; only the child element form is read (csharp-reach.mts:323). The gap predates 505 and fails closed.

## Why


## Acceptance


[test] A Reference whose HintPath is written as an attribute (<Reference Include="X" HintPath="..\A\bin\A.dll" />) is read like the child element form: the referencing project keeps sight of project A even when the Include names something else, red before and green after · by: npm run check

## Changelog
- C#: a `Reference` whose `HintPath` is written as an attribute (`<Reference Include="X" HintPath="..\A\bin\A.dll" />`) references the project that builds that assembly, as the child element form does.

## Evidence

### Proof

- **ran (line 14e3c224de0c):** node --test --test-name-pattern=csharp-hintpath-attribute-reference-edge on the matrix and --test-name-pattern='HintPath written as an attribute' test/relations/csharp-reach.test.mjs, on 38615a3 with the new case and tests, then on 2bafe8b · **saw:** before: fail, the catalogue case gave no edge and the attribute form answered unreachable; after: pass
- **ran (line 14e3c224de0c):** the branch's 13 new catalogue cases and its matrix test file copied into a scratch extraction of a94d31b (the branch's merge base), run with node --test --test-name-pattern=<the 13 case ids> test/relations/extractors/csharp-name-resolution-matrix.test.mjs; then the full suite on a scratch extraction of 9eb9987 (build, grammars, node --test --test-concurrency=6 on every test file, dist compared with the committed dist); and test/relations/csharp-reach.test.mjs of 9eb9987 on the a94d31b code with --test-name-pattern='HintPath written as an attribute' · **saw:** before: the catalogue case gave no edge (fuzz/ApiFuzz/Program.cs:4->Acme.Api not emitted) and the attribute form answered unreachable; the empty attribute case passed both sides; after: the full suite 2512 tests, 2511 pass, 0 fail, 1 skipped; rebuilt dist identical to the committed dist

