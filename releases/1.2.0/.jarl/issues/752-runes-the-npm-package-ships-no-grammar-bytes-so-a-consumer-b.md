# 752 · Runes: the npm package ships no grammar bytes, so a consumer builds 11 of 23 grammars after a toolchain download of about 940M

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-zbnw
**Tags:** api, grammars, packaging, runes
**Files:** Runes/package.json, Runes/grammars/manifest.json, Runes/src/grammars/build.mts
**Repo:** Runes
**Found by:** research research/2026-11-15-runes-readers-gaps-after-1-1-0
**Source:** research/2026-11-15-runes-readers-gaps-after-1-1-0#runes-readers-2026-11-15-grammars
**Where:** Runes/package.json:45, Runes/grammars/manifest.json, Runes/src/grammars/build.mts:128
**Branch:** jarl/752-shipped-grammars
**Worker:** w-752-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:29

## What
At Runes v1.1.0 (1f3476b) the npm package holds the grammar recipe and pins (grammars/manifest.json and four patches) and no grammar bytes: npm pack lists 162 files, 458,121 bytes, and no .wasm or node-types.json. A consumer that parses anything runs buildGrammars. Of the 23 pins, 9 are npm packages, 3 are release downloads and 11 are source builds (typescript, tsx, java, csharp, cpp, php, ruby, json, kotlin, yaml, toml). A source build runs tree-sitter build --wasm, which on its first run fetches binaryen (302M) and wasi-sdk (638M) into ~/.cache/tree-sitter, 940M in all, measured with du -sh on this machine; the built grammars take 24M in ~/.cache/runes/grammars. A source build is refused on Windows, so a Windows consumer needs a cache copied from another machine. The README states this as intended (the recipe and the pins, not the bytes); it is a gap for a consumer that only wants to parse.

Moved from issue 752 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer pays a toolchain download of 940M and a build of 11 grammars before its first parse, on every new machine, in every container and in CI, to obtain 24M of files whose sha256 the manifest already pins. A new family tool that uses the readers as they are reported it.

## Acceptance
- [read] A ruling in the loop says whether the 23 pinned grammars reach a consumer as built files (shipped in the package or a companion, or downloaded as release assets) or stay a build, and why
- [test] If the built files are provided: the package is packed and unpacked into a temporary folder, and buildGrammars run from it with an empty cacheDir, offline, and resolveFrom an empty folder writes all 23 pins with sha256 matching the manifest, with no compile · by: npm run check

## Changelog
- An installed `@chrisdudek/runes` now carries all 23 pinned grammars built and checked against the manifest's sha256, and `buildGrammars` takes them from the package before anything else: a consumer installed from npm needs no network, no `tree-sitter build` toolchain, no grammar package and no cache, on Windows too, and `offline: true` succeeds with an empty cache. `BuiltGrammar.from` reports `'shipped'` for them, the new `shippedDir` option points that step at another folder, and `rebuild` passes over them. The package grows from 0.46 MB to 3.5 MB packed (35 MB unpacked). A checkout or a vendored copy carries no grammar files and builds them as before.

## Evidence

### Proof

- **ran (line 5a4e07fa0063):** node --test test/packed-grammars.test.mjs (at 88ecc62, the test alone on release/1.2.0 fb89628) · **saw:** fail 1: the packed package carries every pinned grammar ... build-grammars: unknown argument --package (no step builds grammar files into the package; npm pack --dry-run at fb89628 lists 162 files, 460551 bytes, no .wasm or node-types.json)
- **ran (line 5a4e07fa0063):** node --test test/packed-grammars.test.mjs test/grammars.test.mjs (at e6b55f5) · **saw:** tests 28, pass 28, fail 0: the unpacked package's buildGrammars, empty cacheDir, offline, resolveFrom an empty folder, gives all 23 pins from 'shipped' with sha256 matching the manifest and leaves the cache empty
- **ran (line 5a4e07fa0063):** npm run check (at 9635101, release/1.2.0 65848ce merged, clean tree) · **saw:** tests 2777, pass 2774, fail 0, skipped 3; dist/ is fresh

### Notes

Ruling ask-2 (charter, by owner): a. Ship all 23 built grammars inside the Runes package.

Assumed: the grammar files are built by prepublishOnly (npm run grammars:package) and by an explicit release step, not by a prepack: npm runs prepack when a package is installed from git, and prepublishOnly only on npm publish, so no install of the package builds anything. A test pins that package.json has no install, prepare, prepack or postpack script.

Assumed: the six npm grammar pins become exact devDependencies as the plan says, and the repository gets a .npmrc with legacy-peer-deps=true: tree-sitter-solidity 1.2.13 misspells its peerDependenciesMeta key, so npm installs the native tree-sitter for it and then refuses the optional peer ranges of zig, scala, groovy and properties (ERESOLVE); with the flag no peer is installed and npm ci passes on the lockfile. The .npmrc is not packed. The lockfile changes by additions only.

Assumed: buildGrammars reads the shipped files right after outDir and before every other source (the plan put them before the cache), so an npm pin needs no installed package either; a shipped file that does not match its pin is passed over silently, as a mismatched outDir file is; rebuild passes over them. A new option shippedDir (default the package's grammars/built/) lets the tests of the lower sources point the step at an empty folder, so a checkout that ran npm run grammars:package answers them the same; BuiltGrammar.from gains 'shipped'. Both are in docs/api.md.

For the final pass: README.md:193 (the paragraph headed 'the recipe and the pins, not the bytes') and :195 (Windows needs a copied cache) and :279 (what npm test builds) become untrue or incomplete for an installed package; CLAUDE.md's 'Grammar bytes never enter git' stays true. The packed size is 3,523,514 bytes (208 files, 35,148,781 unpacked, 33,549,363 of them the 46 grammar files), against 460,551 bytes in 162 files at fb89628; the ruling's estimate was about 2-3 MB compressed.

