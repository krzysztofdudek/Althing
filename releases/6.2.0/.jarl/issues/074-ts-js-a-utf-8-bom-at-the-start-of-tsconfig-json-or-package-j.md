# 074 · TS/JS: a UTF-8 BOM at the start of tsconfig.json or package.json makes the resolver unable to read it, so all aliases and bare imports under that tsconfig, or that workspace package, go silent without a diagnosis

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-vvgd
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/typescript-resolve.mts, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/typescript-resolve.mts (dist .mjs l.400-405 in the npm package): makeTsResolveDeps.readJson l.431 reads readFileSync(..., 'utf-8') with a leading U+FEFF, parseJsonc l.364 lets it through, JSON.parse l.406 throws and the result is undefined; then (1) loadConfig l.538 `if (!isRecord(json)) return 'unknown'`, tsconfigFor l.590, resolveBare l.129 `if (config === 'unknown') return undefined` (silence for every bare specifier under that tsconfig), (2) packageAt l.463 → the directory is not a package, the import is treated as external; Yggdrasil plugs this in at source/cli/src/relations/resolve-path.ts:1, runes 1.0.0 pinned in source/cli/package.json:86
**Branch:** jarl/010-ts-resolve
**Merged:** 3fb8352 in ../../../Runes
**CI:** none

## What
Reproduction (a fresh Yggdrasil clone 2493aa16, npm @chrisdudek/yg 6.1.0 with runes 1.0.0, typescript 5.9.3, node v24.11.1, a custom graph from `yg init --no-reviewer`, type module with when path **/*, a node per directory, only `yg check --no-approve`): Case 1: tsconfig.json starts with EF BB BF (as Visual Studio writes it) with paths `@/*` -> `./src/*`; `tsc --traceResolution` resolves '@/b/b' to src/b/b.ts, `tsc -p .` exit 0; yg check: PASS without any diagnosis; after removing the 3 bytes, FAIL relation-undeclared-dependency `src/a/a.ts:1 → src-b`. Case 1b: a tsconfig with a BOM and no paths, a .ts file imports the workspace package @acme/core by name (tsc resolves it to packages/core/src/index.ts): yg reports only the control relative import `rel.ts:1 → packages-core`, and the bare `main.ts:1` is silent; without the BOM, both edges. Case 2: packages/core/package.json with a BOM (require in Node resolves @acme/core to packages/core/src/index.js): PASS, silence; without the BOM, FAIL `packages/app/src/index.js:1 → packages-core`. Control: JSON.parse on text with a BOM throws, and the exported parseJsonc from runes returns undefined for '\uFEFF{"a":1}' and {a:1} without the BOM. docs/relations-flows-ports.md:103 documents silence for an unreadable tsconfig, but a tsconfig with a BOM is read by tsc, Node and npm (l.99 promises resolving the way the compiler does); the package.json case is covered by no documented silence. Issue 500 from 6.1.0 handled a BOM only on the stdin of `yg owner --files` (owner.ts:329). This is not 010, 011 or 012 here; Runes main c72d1af does not handle U+FEFF. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-43/repro.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-43/repro.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-2/F5-bom-config/repro.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-2/F5-bom-config/repro.sh.

## Why
When the trigger occurs, everything under that tsconfig or a whole workspace package goes silent, and yg check is green without a diagnosis; more common in projects with Windows and Visual Studio. The gate fails open (missing edges, never false blocks), so minor.

## Acceptance
parseJsonc or readJson strips a leading U+FEFF before parsing: cases 1, 1b and 2 give the same edges with a BOM as without it (a test in Runes), and a config that really cannot be parsed is reported instead of staying silent; Yggdrasil pins the Runes release with the fix.

## Changelog
- Fixed: a tsconfig.json, jsconfig.json or package.json saved with a UTF-8 byte order mark (as Visual Studio writes it) is now read like any other, so path aliases, baseUrl and workspace packages under it give their edges instead of going silent.

## Evidence

- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1549, pass 1549, fail 0, catalogue 470 cases, dist/ is fresh; npm run coverage: tests 1549, pass 1549, fail 0, all files 98.76 / 94.00 / 98.57, exit 0; merge 3fb8352 (catalogue count merged silently at 465 by both sides, corrected to 465 + 5 = 470 in the merge)

