# 570 · Runes: under pnpm a bare import of a workspace member that the importing package does not declare b…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1247-afqa
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-010-opus
**Where:** the review of 010, 553
**Branch:** jarl/550-typescript
**Worker:** w-550-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 19:11

## What
Runes: under pnpm a bare import of a workspace member that the importing package does not declare binds that member, though pnpm links a member only into packages that declare it (483 kept undeclared imports binding as before). In next-intl 76 SWC test fixtures under packages/swc-plugin-extractor/tests, a package with no dependencies, bind next-intl and next-intl/server, and TypeScript resolves nothing for them even after a build. Before 010 these were silent only because the entry was missing.

## Why


## Acceptance


[test] Under pnpm a bare import of a workspace member that the importing package does not declare binds nothing, as TypeScript resolves nothing for it, while a declared member still binds; next-intl's SWC fixtures stay silent in the corpus, red before and green after · by: npm run check

## Changelog
- Changed: in a pnpm workspace a bare import of a workspace package binds only where the importing package, or a project above the file up to the workspace root, declares it; an import from a package that does not declare it (`import { x } from 'lib'` in a package with no dependency on `lib`) gives no edge, as pnpm links nothing there. A workspace that hoists publicly (`shamefully-hoist`, `node-linker=hoisted`, a `public-hoist-pattern`) and npm and yarn workspaces are unchanged. A consumer's graph can lose edges at such imports, so a relation declared for one of them is reported as having no code behind it (Before you upgrade).

## Evidence

### Proof

- **ran (line 363a24171bcd):** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs at the red commit (four new cases, before the fix) · **saw:** pass 135, fail 1: typescript-workspace-pnpm-undeclared-member-silence: unexpected cross-owner edge packages/plugin/tests/fixture/input.ts:1->lib
- **ran (line 363a24171bcd):** node --test test/relations/extractors/typescript*.test.mjs test/relations/catalogue.test.mjs test/relations/resolve-path.test.mjs test/relations/file-view.test.mjs test/relations/diagnostics.test.mjs at the fix, then the 7 new unit tests of the pnpm rule · **saw:** tests 421, pass 421, fail 0; unit tests pass 7, fail 0 (a declared member binds in each dependency field, a root declaration binds, public hoisting keeps the binding, npm and yarn unchanged)
- **ran (line 363a24171bcd):** RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs gate --only next-intl --strict before and after the golden was rewritten, then gate --tier all --strict · **saw:** before: 76 UNEXPLAINED removed edges, all under packages/swc-plugin-extractor/tests, and 76 explanations of typescript:false-edge at the same sites match nothing; after: 0 added, 0 removed, typescript 1455 checked, 198 disagreements, 198 explained, gate passed; all 33 repositories ok, the strict run fails only on the Go and .NET oracles this machine does not have

### Notes

Assumed: a project that declares is the workspace root or a member, in any of the four dependency fields; a package.json no workspace lists does not count. A workspace that hoists publicly (shamefully-hoist true, node-linker hoisted, any public-hoist-pattern, and before pnpm 10 a member whose name holds eslint or prettier) keeps the earlier binding, since pnpm may link the member at the root. A package's import of its own name without exports is silent under pnpm too, as pnpm makes no self link.

