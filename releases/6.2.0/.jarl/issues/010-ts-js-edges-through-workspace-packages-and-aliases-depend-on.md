# 010 · TS/JS: edges through workspace packages and aliases depend on ignored build files or files generated on disk, so the same commit passes in a clean CI checkout and fails after a local build; a monorepo with compiled packages loses almost all edges between packages in CI

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-qqag
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/typescript-resolve.mts, Runes/src/relations/resolve-path.mts, Yggdrasil/source/cli/src/relations/resolve-path.ts, Yggdrasil/source/cli/src/relations/owner-index.ts, Yggdrasil/source/cli/src/relations/pass.ts, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/resolve-path.mts:57-62 (isFile = statSync(...).isFile() && exactCase, without .gitignore; passed as exists :67); src/relations/extractors/typescript-resolve.mts:162-188 resolveWorkspacePackage, :223-234 collectTargets, :279-289 entryOf, :503-509 resolveExtends; Yggdrasil source/cli/src/relations/resolve-path.ts:26-35 guardedResolve (isExcluded only from nested projects and coverage.excluded), pass.ts:264 guardOwnerIndex over owner-index.ts:13-66
**Branch:** jarl/010-ts-resolve
**Merged:** 3fb8352 in ../../../Runes
**CI:** none
**After:** 004, 068

## What
The resolver checks candidates with a plain statSync, so untracked and ignored build output or a generated config decides where an import lands (the first existing exports target in declaration order wins), and the target's owner is matched by the path text, also without .gitignore. Reproduction (a Yggdrasil clone at v6.1.0, runes 1.0.0, `yg init --no-reviewer`, no reviewer): an npm workspace; @acme/core has main/types/exports → ./dist/*, dist/ in .gitignore; packages/app imports @acme/core; one node per package. A clean commit and a fresh `git clone`: `yg check: PASS`. After a real `tsc -b packages/app` (`git status` empty) the same commit: FAIL relation-undeclared-dependency `packages/app/src/main.ts:1 → core`. Variants: exports {types: ./dist/index.d.ts, development: ./src/index.ts} with nodes on packages/*/src/: the reverse, clean FAIL (an edge to src), after the build PASS; SvelteKit, the root tsconfig extends the ignored .svelte-kit/tsconfig.json: clean PASS (every $lib import silent, because the relative extends is missing), after the file is generated FAIL `src/routes/+page.server.ts:1 → src-lib`. A real repo jestjs/jest @202dd8a (exports → ./build/*, /packages/*/build/ ignored, 55 nodes): a clean checkout has 1 undeclared edge between nodes; after creating only 161 ignored entry files from build/: 756 edges in 252 node pairs. `yg owner` confirms that the ignored packages/core/dist/index.d.ts belongs to the node packages/core/. (The Angular paths variant {"ui-lib": ["./dist/ui-lib"]} is silent before and after the build: that is a recall gap, not a flip, and not part of this defect.) Runes main has no changes in src/relations since v1.0.0, the pin is still 1.0.0. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-7/v1-dist-main.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-7/v2-variants.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-7/v3-jest.log.

## Why
The gate's verdict is meant to be a function of the commit, not of local, untracked state: the same commit gets different verdicts locally and in CI. CHANGELOG 6.1.0 (l.105) declares this principle for rule hashes, and docs/nodes.md says that ignored files are invisible to mapping and coverage; here an ignored file is both the resolution target and owned by a node. In a keyless CI gate, a monorepo with compiled packages (a standard layout, e.g. jestjs/jest) sees almost none of the dependencies between packages.

## Acceptance
- Determinism: resolution and target ownership skip paths git ignores; a clean checkout and a checkout after a build give the same result in the base case, the exports conditions variant and SvelteKit.
- Recall: an exports/main/types target under the package's outDir is mapped back to the source (rootDir) or to the owner of the package directory when no target exists, or at least a warning is given that the package entry points at files that do not exist; on jestjs/jest in a clean checkout the edges between packages are visible.

## Changelog
- Fixed: a TypeScript or JavaScript file the consumer excludes (for example git-ignored build output under dist/, or a generated .svelte-kit/tsconfig.json) is no longer an import target or a config the resolver reads, so it cannot change where an import resolves; the consumer still has to pass git-ignored paths as excluded.

## Evidence

jarl: the Runes half done (an excluded file treated as non-existent, branch jarl/010-ts-resolve); what remains is the Yggdrasil half (passing paths git ignores as excluded — package jarl/004-walk-mapping, issues 004/068) and recovering outDir→rootDir edges (Runes 1.1.0, ruling patch-scope)
- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1549, pass 1549, fail 0, catalogue 470 cases, dist/ is fresh; npm run coverage: tests 1549, pass 1549, fail 0, all files 98.76 / 94.00 / 98.57, exit 0; merge 3fb8352 (catalogue count merged silently at 465 by both sides, corrected to 465 + 5 = 470 in the merge)

