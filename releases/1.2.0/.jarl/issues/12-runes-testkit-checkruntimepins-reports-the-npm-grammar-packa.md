# 12 · Runes testkit: checkRuntimePins reports the npm grammar packages of the given languages as not inst…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1313-yvpp
**Tags:** api, grammars, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-752-opus
**Where:** the review of 752
**Branch:** jarl/752-shipped-grammars
**Merged:** 5d0fcd2 in Runes
**Merge check:** npm run check · saw tests 2779, pass 2776, fail 0, skipped 3; dist/ is fresh.
**CI:** green

## What
Runes testkit: checkRuntimePins reports the npm grammar packages of the given languages as not installed even where the installed @chrisdudek/runes ships those grammars built and checked by sha256 (1.2.0, issue 752), so a consumer that drops the packages the package no longer needs fails the pin check README tells it to run; reproduced in an empty consumer installed from the packed tarball: 'tree-sitter-go (go): pinned 0.25.0, not installed'

## Why


## Acceptance


[test] In a project that installed the packed @chrisdudek/runes and no npm grammar package, checkRuntimePins reports no npm grammar package as missing for a language whose grammar the package ships, while a consumer that installed a grammar package of another version than the pin still gets its report; a test over the packed package, red before and green after · by: npm run check

## Changelog
- `checkRuntimePins` no longer reports an npm grammar package as not installed when the installed `@chrisdudek/runes` ships that grammar with the pinned sha256, so a consumer can drop the grammar packages; a grammar package installed at another version than its pin is still reported. The new `shippedDir` option names the folder it reads.

## Reviews
- **approve** · by rev-752-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1341-vzll
  752 line 1 [read] is met by the ruling runes-grammars-in-package: 'Runes ships all 23 built grammars inside its npm package (issue 752): the package grows to about 2-3 MB compressed, each file is still checked against its pinned checksum, the release workflow builds them before publishing, and a user needs no download and no toolchain, Windows included.' (the 3.5 MB measured is noted beside it, note-6). 752 line 2 [test] re-run at 38ef258: npm run check 2779 tests, 2776 pass, 0 fail, 3 skipped, dist fresh, on a clean clone and on one holding grammars/built and grammars/npm/node_modules. 12 line 1 [test]: red at 9635101 (runtime-pins case: go reported not installed though shipped with the pinned bytes) and at 0532eb5 (the packed case: 'every npm grammar the package ships needs no package'), green at 38ef258; in a consumer that ran npm install on the packed tarball, no grammar package: 'runtime pins: every package is the pinned version'; a fake tree-sitter-go 0.24.0 is still reported; a damaged installed solidity wasm no longer stands in. Round 1 findings, each checked: (1) the publish job restores no cache; it downloads the grammar-cache artifact of the run it publishes from (download-artifact with no run-id, after needs: verify, whose grammars job uploads it from the same commit) and builds with RUNES_GRAMMAR_OFFLINE=1 from it; simulated with a copy of the cache: full, 46 files; one pin missing, 'grammar lua is not in the cache ... offline', nothing written; one entry tampered, evicted and refused, nothing written. After check:dist the job runs no third-party code: the artifact lands in runner.temp only, grammars/npm installs with --ignore-scripts from its lockfile, every grammar file is checked against the manifest at the tag, so nothing but this run's build and lockfile-pinned bytes reaches the pack; a second artifact of the same name in the run fails the upload and so the verify. Both workflows against release/1.2.0 remove no line: every existing step and permission is kept; a test holds the order and the absence of actions/cache. (2) No root .npmrc; the root package-lock.json is identical to release/1.2.0's and the root devDependencies are its own; legacy-peer-deps and ignore-scripts live in grammars/npm alone. (3) Root npm ci runs the same four install scripts as release/1.2.0 and compiles nothing on linux-arm64; grammars:package installs 13 packages and runs no script; npm install from git of 38ef258 into an empty project adds only the package, without grammars/npm. grammars/npm cannot reach the package: files names manifest.json, manifest.schema.json, patches and built, and npm 10.9.10, 11.6.2 and 11.19.1 pack 208 files, 46 under grammars/built, none under grammars/npm, the other 162 the same as at 9635101. (5) A damaged shipped file is logged and named in the error that follows ('The package ships this grammar, but ... does not match its pin and was passed over: reinstall the package.'). Commits: one issue each, src and dist together, no agent trailer. Minor: the Publish step's prepublishOnly runs grammars:package again without RUNES_GRAMMAR_OFFLINE and reinstalls grammars/npm from the registry; unreachable today, since every file is already in grammars/built and nothing changes it after the verified step, but the same two env lines on that step would keep the privileged step from any download or source build by construction. Minor, for the final pass: README:199 (the runtime pin check) now misses the shipped-grammar exception, beside :193, :195 and :279 already listed. Only CI shows: the download-artifact handoff from the called workflow under the publish job's explicit permissions, the nested npm ci inside npm publish --provenance on npm 11.6.2, and the packed test's npm ci on Windows and macOS.

## Evidence

### Proof

- **ran (line be2735fe94a3):** node --test --test-name-pattern=checkRuntimePins test/packed-grammars.test.mjs (at f331ce9, the test alone) · **saw:** fail 1: every npm grammar the package ships needs no package; actual lists tree-sitter-javascript (javascript), expected 0.25.0, not installed, and the other npm pins
- **ran (line be2735fe94a3):** npm run check (at 38ef258, clean tree) · **saw:** tests 2779, pass 2776, fail 0, skipped 3; dist/ is fresh; checkRuntimePins in a consumer of the packed package reports no npm grammar package, and reports tree-sitter-go installed 0.24.0 against the pin 0.25.0
- **ran (line be2735fe94a3):** test/runtime-pins.test.mjs and test/packed-grammars.test.mjs of 38ef258 on 9635101 and on 0532eb5 (scratch clones) · **saw:** red: at 9635101 the runtime-pins test fails 1 of 5 (tree-sitter-go reported not installed although the shipped folder holds go with the pinned bytes; the packed test there fails on setup, no grammars/npm, so it is not counted); at 0532eb5 the packed test's checkRuntimePins case fails: 'every npm grammar the package ships needs no package'
- **ran (line be2735fe94a3):** npm run check (at 38ef258, fresh scratch clone); and npm pack of 38ef258 installed with npm install into an empty consumer, checkRuntimePins for go, solidity, typescript and python · **saw:** green: tests 2779, pass 2776, fail 0, skipped 3, dist fresh; the consumer with no grammar package: 'runtime pins: every package is the pinned version'; with a fake tree-sitter-go 0.24.0: 'tree-sitter-go (go): pinned 0.25.0, installed 0.24.0'; with one bit of the installed solidity wasm flipped, solidity is reported not installed again

