# 752 · Runes: the npm package ships no grammar bytes, so a consumer builds 11 of 23 grammars after a toolchain download of about 940M

**Status:** open
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

## What
At Runes v1.1.0 (1f3476b) the npm package holds the grammar recipe and pins (grammars/manifest.json and four patches) and no grammar bytes: npm pack lists 162 files, 458,121 bytes, and no .wasm or node-types.json. A consumer that parses anything runs buildGrammars. Of the 23 pins, 9 are npm packages, 3 are release downloads and 11 are source builds (typescript, tsx, java, csharp, cpp, php, ruby, json, kotlin, yaml, toml). A source build runs tree-sitter build --wasm, which on its first run fetches binaryen (302M) and wasi-sdk (638M) into ~/.cache/tree-sitter, 940M in all, measured with du -sh on this machine; the built grammars take 24M in ~/.cache/runes/grammars. A source build is refused on Windows, so a Windows consumer needs a cache copied from another machine. The README states this as intended (the recipe and the pins, not the bytes); it is a gap for a consumer that only wants to parse.

Moved from issue 752 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer pays a toolchain download of 940M and a build of 11 grammars before its first parse, on every new machine, in every container and in CI, to obtain 24M of files whose sha256 the manifest already pins. A new family tool that uses the readers as they are reported it.

## Acceptance
- [read] A ruling in the loop says whether the 23 pinned grammars reach a consumer as built files (shipped in the package or a companion, or downloaded as release assets) or stay a build, and why
- [test] If the built files are provided: the package is packed and unpacked into a temporary folder, and buildGrammars run from it with an empty cacheDir, offline, and resolveFrom an empty folder writes all 23 pins with sha256 matching the manifest, with no compile · by: npm run check

## Evidence

### Notes

Ruling ask-2 (charter, by owner): a. Ship all 23 built grammars inside the Runes package.

