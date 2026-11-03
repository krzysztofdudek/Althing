# 477 · Runes: the corpus gate's explanations cannot go stale or be mistyped silently, and one command runs edges and oracles

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, corpus, 1.1.0
**Files:** Runes/scripts/corpus.mjs, Runes/test/corpus.test.mjs, Runes/package.json, Runes/.github/workflows/ci.yml
**Repo:** ../../../Runes
**After:** 184
**Found by:** rev-runes-184b-fable
**Where:** Review of 184 (2026-11-03)
**Branch:** jarl/477-corpus-gate-hardening
**Merged:** b599517 in ../../../Runes
**CI:** pending

## What
An oracle explanation is keyed by the import specifier but not by the answers, so it keeps explaining a site after Runes moves to another wrong file. A mistyped oracle kind (typescript:false-edges) passes the pattern and explains nothing, silently. The acceptance of 184 asks for one command; the gate is npm run corpus and npm run corpus:oracles. The CI cache key is the manifest hash alone.

## Why
An explanation that outlives its reason is a false green waiting to happen, and a gate run in two halves is easy to run in one.

## Acceptance
- An oracle explanation names the answers it explains and stops matching when either answer changes, with a test
- An unknown kind in explained.md is refused with its line, with a test
- One command runs the edge gate and the oracles, locally and in CI

## Evidence

From CI run 41552714666 (2026-11-03), the first with a Go toolchain: the Go oracle lists packages with go list ./..., which skips testdata directories, so an import of a package under testdata (gin) reads as a false edge; explained in bf4a24d, but the oracle should ask go list for the import path itself; part of this issue

From the 473 worker's run (2026-11-03): node scripts/corpus.mjs oracles --tier all fails on two heavy-tier repositories whose goldens did not change, react (1551 disagreements) and shaka-player (1), plus one more it could not trace; the heavy tier's oracles were never brought to green, so a manual heavy run is red for reasons nobody has read. Part of this issue: every tier's oracles pass or are explained

From the review of 473 (2026-11-03): oracles --only jellyfin gives the same 19 unexplained C# false-reach disagreements (fuzz projects) on release/1.1.0 and on the 473 branch; heavy tier, pre-existing; part of bringing every tier's oracles to green

From the review of 482 and 483 (2026-11-03): 24 new react oracle disagreements are not tracked, and the reason in explained.md for the 107 removed react references is incomplete (the fixtures sit outside the workspace and install on their own); part of bringing the heavy tier's oracles to honest explanations
- **ran:** node --test test/corpus.test.mjs (tests of 241a1f7, scripts/corpus.mjs of release/1.1.0) · **saw:** pass 9, fail 4: the unknown-kind and the both-answers tests fail (a typescript:false-edges entry loads; an entry with moved answers explains), and two later tests fail on the manifest the failed test left
- **ran:** node --test test/corpus.test.mjs (commit 241a1f7) · **saw:** pass 13, fail 0
- **ran:** node --test test/corpus.test.mjs (tests of 342892b, scripts/corpus.mjs of 241a1f7) · **saw:** pass 13, fail 1: the gate test fails, gate is not a command
- **ran:** node --test test/corpus.test.mjs (commit 342892b) · **saw:** pass 14, fail 0
- **ran:** node --test --test-name-pattern='Go oracle' test/corpus.test.mjs (tests of 28724f9, scripts/corpus.mjs of 342892b) · **saw:** stub go: fail, UNEXPLAINED go:false-edge a/a.go:3 example.com/m/testdata/proto, Runes testdata/proto, go list no package in the repository; real go: skipped, go is not installed here
- **ran:** node --test test/corpus.test.mjs (commit 28724f9) · **saw:** pass 15, fail 0, skipped 1 (the real-go case: go is not installed here; it runs where go is, as on CI's runners)
- **ran:** node scripts/corpus.mjs oracles --tier heavy (release/1.1.0) · **saw:** FAIL jellyfin 19 disagreements 0 explained, react 1551/0, shaka-player 1/0; eShop csharp skipped (its global.json needs SDK 10.0.302, this machine has 10.0.114)
- **ran:** npm run corpus -- --tier all (commit 24c789c) · **saw:** edges ok on all 33; oracles ok on 31; FAIL react 1551 disagreements 436 explained (1115 left: export targets Runes takes whatever the condition), FAIL jellyfin 19/2 (17 left: reach carried through an assembly reference); skipped go on gin and sh, csharp on CleanArchitecture and eShop
- **ran:** npm run check; npm run coverage (commit 24c789c) · **saw:** check 2050 tests, 2049 pass, 0 fail, 1 skipped, dist fresh; coverage 99.02 lines, 94.96 branches, 98.93 functions
- **ran:** git merge release/1.1.0 (c95c052); node --test test/corpus.test.mjs · **saw:** explained.md conflict resolved to the two-answer form: zod and next-intl oracle entries gone (0 disagreements now), gin's gone; 107 react fixture recall-losses left silent by the range change explained as nested registry installs; tests pass 15, fail 0, skipped 1 (real go)
- **ran:** npm run check (commit c95c052) · **saw:** 2085 tests, 2084 pass, 0 fail, 1 skipped; dist fresh
- **ran:** npm run corpus -- --tier all (commit c95c052) · **saw:** edges ok on all 33; oracles ok on 31, no explanation unused; FAIL react 1575 disagreements, 543 explained, 1032 export-target mismatches left; FAIL jellyfin 19, 2 explained, 17 assembly-reach false reaches left; skipped go on gin and sh, csharp on CleanArchitecture and eShop
- **ran:** nice -n 15 timeout 1800 npm run check; npm run corpus -- --tier routine · **saw:** check: tests 2085, pass 2084, fail 0, skipped 1 (real go absent), dist/ is fresh; corpus gate: passed on the routine tier (merge b599517 on release/1.1.0); the heavy tier stays red only on 505 and 526

Minor findings of the review left for later (rev-runes-477-opus): two node-loader reasons omit that those fixtures copy the build output into their own node_modules, one fixture reason claims a lockfile react-14 lacks, the hiredis entry quotes gcc's exact error text so a clang machine reports a new disagreement, and entries that match nothing only warn

