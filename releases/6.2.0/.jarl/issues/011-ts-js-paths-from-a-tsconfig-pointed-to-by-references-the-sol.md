# 011 · TS/JS: `paths` from a tsconfig pointed to by `references` (the solution-style layout from create-vue and Vite) are never read, and paths from jsconfig.json are skipped for .vue and .svelte files; almost every alias import is silent

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-lboi
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/typescript-resolve.mts, Yggdrasil/source/cli/src/relations/pass.ts, Yggdrasil/docs/relations-flows-ports.md, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/typescript-resolve.mts:579-604 tsconfigFor (the nearest tsconfig.json; loadConfig follows only `extends`, never `references`), :580 `isJs = /\.(?:[cm]?js|jsx)$/i`, :586 (for .vue/.svelte names = ['tsconfig.json']); Yggdrasil source/cli/src/relations/pass.ts:435-438 (the SFC script language is known through sfcScriptView(...).language, not passed to the resolver)
**Branch:** jarl/010-ts-resolve
**Merged:** 3fb8352 in ../../../Runes
**CI:** none

## What
Case A (the TS layout from create-vue): root tsconfig.json = files: [] + references; paths @/* → ./src/* only in tsconfig.app.json. `tsc -p tsconfig.app.json --traceResolution` resolves '@/utils/fmt' to src/utils/fmt.ts, `tsc -b` exit 0, while yg (6.1.0, runes 1.0.0) reports only the control relative import Relative.ts:1 → utils; Home.ts:1 and Cart.vue:2 with '@/utils/fmt' are silent. Control A2: the same paths in the root tsconfig.json give all three edges. Case B (the JS layout from create-vue, jsconfig.json with paths, no tsconfig): helper.js:1 → stores is reported, the identical import in Counter.vue (<script setup>, JS) and Widget.svelte (<script>, JS) is silent; control B2 with paths in tsconfig.json: all three. Case C: real create-vue 3.24.0 scaffolds (configs unchanged, two imports rewritten to the '@/' alias the scaffold sets up): in TS router/index.ts:2 → views and HomeView.vue:2 → components disappear, in JS HomeView.vue:2 → components disappears; after npm install `vue-tsc --build` passes (a negative control with an alias to a missing file gives TS2307). A real repo apache/skywalking-booster-ui @2d2eeb4d (12 nodes, 788 lines with '@/'): yg reports 13 edges, none through '@/'; with only baseUrl and paths copied into the root tsconfig.json: 704 edges, 689 through '@/'. Issue 216 (6.1.0) added paths, baseUrl and SFC, but nothing about references or jsconfig for SFC. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-8/repro-v8-final.log (script repro-v8.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-8/real-sw-v8.log (script real-sw-v8.sh).

## Why
create-vue generates exactly such a root tsconfig (index.ts l.506-543), so every TS application from that scaffold has a dependency gate blind to almost all alias imports, with no warning, and the check comes out green over a dependency graph it did not see. The documentation (relations-flows-ports.md:99, CHANGELOG.md:34) describes resolution as the compiler does it and says to read .vue/.svelte with the grammar from `lang`; the code decides by extension, so on this point it contradicts the documentation.

## Acceptance
- For a solution-style tsconfig.json the resolver follows `references` and picks the referenced config whose include/files covers the file (like tsc -b and tsserver); case A gives edges from Home.ts and Cart.vue.
- A .vue/.svelte file with a JS script reads jsconfig.json (the script language passed from pass.ts to the resolver); case B gives edges from Counter.vue and Widget.svelte.
- If any part stays out of scope, docs/relations-flows-ports.md lists it among the silent cases; a Runes release and a bumped pin in Yggdrasil.

## Changelog
- Fixed: TypeScript path aliases in a solution-style tsconfig.json (files: [] plus references, as create-vue and Vite scaffold it) now come from the referenced config whose include holds the file, so @/ imports give their edges (silence when several referenced configs hold the file and disagree), and a .vue or .svelte component now reads jsconfig.json paths as a JavaScript file does.

## Evidence

- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1549, pass 1549, fail 0, catalogue 470 cases, dist/ is fresh; npm run coverage: tests 1549, pass 1549, fail 0, all files 98.76 / 94.00 / 98.57, exit 0; merge 3fb8352 (catalogue count merged silently at 465 by both sides, corrected to 465 + 5 = 470 in the merge)

