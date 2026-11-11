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

## Evidence

### Proof

- **ran (line 14e3c224de0c):** node --test --test-name-pattern=csharp-hintpath-attribute-reference-edge on the matrix and --test-name-pattern='HintPath written as an attribute' test/relations/csharp-reach.test.mjs, on 38615a3 with the new case and tests, then on 2bafe8b · **saw:** before: fail, the catalogue case gave no edge and the attribute form answered unreachable; after: pass

