# 586 · Runes: the tree-sitter pins move to the newest stable release and every grammar is rebuilt (the Runes half of 586)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-vteu
**Tags:** runes, dependencies, grammars
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-356-sonnet, issue 356
**Branch:** jarl/586-tree-sitter-pins
**Worker:** w-586-haiku
**Model:** claude-haiku-5-5@max
**Since:** 2026-11-17 11:00

## What
Runes pins tree-sitter-cli and web-tree-sitter at 0.27.0 (package.json, grammars/manifest.json); Dependabot proposed 0.27.1 on Yggdrasil (pull requests 106 and 107), which Yggdrasil cannot take alone. This issue is the Runes half: the pins move in Runes, the grammars are rebuilt and their sha256 updated. Yggdrasil adopts them when it pins Runes 1.2.0, in a family release; that half stays with issue 586 of the 6.2.0 loop.

Moved from issue 586 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
Yggdrasil cannot take tree-sitter-cli or web-tree-sitter 0.27.1 alone: the grammar manifest shared through Runes pins 0.27.0 and the pinned-grammar test and golden corpus hash the runtime bytes. The pins move in Runes first, then Yggdrasil adopts them.

## Acceptance
- [test] package.json and grammars/manifest.json pin tree-sitter-cli and web-tree-sitter at the newest stable release (0.27.1 or later), every grammar is rebuilt with its sha256 updated in the manifest, and the whole suite passes with every catalogue expectation unchanged, or each change explained on the issue · by: npm run check
- [check] the corpus gate gives the same edges as at v1.1.0, or each difference is explained in corpus/explained.md · by: npm run corpus

## Changelog
- `grammars`: the pinned web-tree-sitter runtime and tree-sitter-cli move to 0.27.2. The grammar bytes stay the same, and the relation pass finds and stops finding the same dependencies on the public repositories the corpus checks. A consumer still on web-tree-sitter 0.27.0 gets a new runtime pin report until it installs 0.27.2; no relation finding changes.

## Evidence

### Proof

- **ran (line 5beb0dbf62b9):** systemd-run --user --scope -q -p MemoryMax=8G nice -n 15 timeout 500 node --test test/grammars.test.mjs test/runtime-pins.test.mjs · **saw:** Red before the pin change, after npm run grammars built the folder from the cache: tests 29, pass 25, fail 4. The four expect 0.27.2 where the manifest and the installed package say 0.27.0: grammars.test.mjs:35 reads '0.27.0' !== '0.27.2', and the three runtime-pin tests fail on the expected version.
- **ran (line 5beb0dbf62b9):** npm run check · **saw:** Committed tree at a1adade, clean: the build compiler, the grammar build and the whole suite. Tests 2753, pass 2750, fail 0, skipped 3 (the Go oracle, and the two Rust build tests, with no go, rustc or cargo on this host). Exit 0: dist is fresh. No file under reference, corpus, dist, src or docs changed since the base.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only toml · **saw:** Rebuilt toml from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only yaml · **saw:** Rebuilt yaml from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only json · **saw:** Rebuilt json from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only ruby · **saw:** Rebuilt ruby from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only kotlin · **saw:** Rebuilt kotlin from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only java · **saw:** Rebuilt java from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only php · **saw:** Rebuilt php from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only cpp · **saw:** Rebuilt cpp from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only csharp · **saw:** Rebuilt csharp from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only tsx · **saw:** Rebuilt tsx from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line 5beb0dbf62b9):** RUNES_GRAMMAR_REBUILD=1 node scripts/build-grammars.mjs --only typescript · **saw:** Rebuilt typescript from its pinned repository with tree-sitter-cli 0.27.2, the cache not read: exit 0, the WASM and the node-types.json match the sha256 already pinned, so the pin is unchanged.
- **ran (line b538f7655cde):** RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared npm run corpus -- --tier all · **saw:** corpus gate: 33 repositories at a1adade, passed. Every repository shows 0 added and 0 removed edges against its golden, 0 explained, 98460 edges in all, so no golden and no explanation changed. Oracle checks: 1743 disagreements, all explained by the entries the explained file already held. Not run here: 5 oracle checks, for the Go and C# toolchains, which this host does not have; CI runs them.
- **ran (line 5beb0dbf62b9):** npm run coverage · **saw:** Committed tree at a1adade: exit 0. Tests 2753, pass 2750, fail 0, skipped 3. Coverage over dist: all files 99.21 lines, 95.84 branches, 99.03 functions, against the thresholds of 98, 92 and 97.

### Notes

Assumed: 0.27.2 is the newest stable release that both web-tree-sitter and tree-sitter-cli publish on npm. Both list 0.27.2 as latest, and no prerelease is newer. The runtime loads the WASM of the npm-pinned grammars (javascript, python and go at 0.25.0, ABI 15) and of the source grammars: the suite passes with it, so no older 0.27.x was needed.

The test expectations that name the pin moved from 0.27.0 to 0.27.2: the runtime pin test, the three runtime-pin tests, and the two regular expressions of the refusal test that names the pinned tree-sitter-cli. No assertion was loosened or removed; the fixtures that carry their own 0.27.0 values are unchanged.

For the final pass, README.md line 193 names the web-tree-sitter runtime and tree-sitter-cli as 0.27.0; both are 0.27.2 now. README.md line 195 is partly unchanged: the Linux build of the 0.27.2 cli uses wasi-sdk 34.0 (llvm 23.1.0) and its WASM producers section names clang 23.1.0-wasi-sdk, as the README says for Linux. The Windows claim (clang 23.1.0-rc3 under wasi-sdk-34) was not checked: this host has no Windows machine.

For the final pass: the module comment of src/grammars/build.mts, compiled into dist/grammars/build.mjs, names tree-sitter-cli 0.27.0 and wasi-sdk-34. It is a comment and no pin, so it was left as it is; changing it needs a src change and a rebuilt dist.

