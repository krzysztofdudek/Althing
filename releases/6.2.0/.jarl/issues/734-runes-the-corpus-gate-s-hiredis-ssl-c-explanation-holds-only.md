# 734 · Runes: the corpus gate's hiredis ssl.c explanation holds only on a machine without OpenSSL 1.0.2 headers, so CI's corpus job fails under --strict

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261113T1639-jupe
**Tags:** ci, corpus, c
**Files:** Runes/corpus/explained.md, Runes/scripts/corpus.mjs
**Repo:** Runes
**Found by:** jarl
**Where:** Runes CI run 43154806778 at b326704, job corpus: npm run corpus -- --tier routine --strict prints 'UNUSED explained.md:26205: - hiredis c:unreadable ssl.c:0 … cc -MM failed: ssl.c:79:2: error: redisSSLOptions.verify_name requires OpenSSL 1.0.2 or newer' and exits 1
**Branch:** jarl/733-ci-green
**Merged:** 8b0173d14e447779237b24c9b0f810c9683a6010 in Runes
**Merge check:** npm run check · saw ℹ tests 2682, pass 2679, fail 0, skipped 3; dist/ is fresh; exit 0

## What
The C oracle runs cc -MM over hiredis's ssl.c. On a machine without OpenSSL 1.0.2 headers ssl.c stops at an #error, the oracle cannot list its includes, and corpus/explained.md:26205 explains that disagreement. On GitHub's ubuntu runner the headers are present, the preprocessor succeeds, the disagreement does not occur, and under --strict an explanation that matches nothing fails the run. The gate's verdict depends on the machine's installed headers.

## Why
The corpus gate blocks the tag of Runes 1.1.0 (the releasing skill, step 3), and CI's corpus job must be green on the exact commit (ruling ci-green-on-github-and-bounded-agents). A gate whose answer depends on what the machine has installed gives a false red on one machine or a stale explanation on another.

## Acceptance
- [test] The corpus gate gives the same verdict for hiredis's ssl.c on a machine with and without OpenSSL 1.0.2 headers, by making the C oracle's answer independent of the installed headers or by an explanation the gate matches by the condition it depends on, with a test that runs both conditions; no explanation is removed only to make the run pass · by: npm run check
- [check] npm run corpus -- --tier routine --strict passes on this machine, and the corpus job of Runes CI passes on the pushed release/1.1.0 with the fix · by: gh run view <run-id> --json jobs

## Reviews
- **approve** · by rev-733-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1723-imsf
  Approve at 94b0558, Minor findings only. 733: the assumed cause is confirmed with cargo 1.99.1 (rust:1.99.1-slim image): the old writer's config with the CI's Windows stub path gives exactly the six CI lines, rust-patch-crates-io-path-edge included (failed to parse manifest, Caused by: could not load Cargo configuration, because its root manifest names a crates.io dependency and Cargo reads the configuration while parsing it); the new writer's config builds all six, cargo reading the escaped path as that literal directory. The six are exactly the building cases that need stub crates. The whole Rust catalogue build test passes at 94b0558 under 1.99.1 (the new 713 case builds; the 46 listed still do not); tomllib reads back 12 edge paths. The unit test is red at 0551ff2 for the right reason. 734: red at eb51dde, green at 95e8787; each half of the fix is caught by its own condition (mutations); closures with and without -nostdinc are identical for all 103 C/C++ files of leveldb and hiredis, so no other corpus answer moves; strict routine corpus: all 50 lines ok, fails only on skipped go/dotnet oracles of this host. 713: red at 808f46e, green after; 17 invented layouts (bins, examples, tests, benches in dirs, [[bin]]/[lib] paths, workspace member, edition 2015, main.rs and lib.rs module files, path-loaded lib.rs, no Cargo.toml) match rustc 1.99.1 at 94b0558; only the three non-root module files moved. Suite: 2682 tests, 2681 pass, 0 fail, 1 skipped (go); dist identical to the committed one. Open: 733 line 2 and the CI half of 734 line 2, the jarl's after the push (the branch is not pushed).
  outside the issue, filed as 736: Runes corpus: since 734 the C oracle reads hiredis's ssl.c as unreadable on every machine, so its 6 include edges, which CI's corpus job checked before (run 43154806778: hiredis checked: c 50), are checked nowhere (44). With -nostdinc and -DHIREDIS_NO_PEER_NAME_VERIFICATION, the define ssl.c's own #error names, ssl.c preprocesses on this host (closure: hiredis.h, read.h, sds.h, alloc.h, async.h, net.h, win32.h, async_private.h, hiredis_ssl.h). Adding that define to hiredis's c.defines in corpus/manifest.json would check all 50 on every machine, and the ssl.c explanation would then be retired because its disagreement no longer occurs.
  outside the issue, filed as 737: Runes, Rust: a library rooted at the package root (Cargo.toml [lib] path = "lib.rs") whose lib.rs holds only mod outer { #[path = "loaded.rs"] mod x; } gives no edge for mod child; in outer/loaded.rs, at 8d31e57 and at 94b0558, while rustc 1.99.1 loads outer/loaded.rs. With a mod a; beside it in lib.rs the edge is given, and src/lib.rs in the same shape gives it. A lost edge, never a false one; this branch did not change it.

## Evidence

### Proof

- **ran (line 3acc1034a7e9):** node --test --test-name-pattern='system header' test/corpus.test.mjs (at eb51dde, the test before the fix) · **saw:** ok without the header; not ok with the header in the compiler's standard directories, on C_INCLUDE_PATH and on CPATH: checked: c 1; 0 disagreements; UNUSED explained.md:1; --strict fails; # pass 1 # fail 3
- **ran (line 3acc1034a7e9):** node --test --test-name-pattern='system header|#error|C oracle' test/corpus.test.mjs (at 95e8787, after the fix) · **saw:** # tests 7 # pass 7 # fail 0: all four header conditions give 1 disagreements, 1 explained under --strict
- **ran (line 3acc1034a7e9):** npm run check (at 94b0558) · **saw:** tests 2682, pass 2679, fail 0, skipped 3; dist/ is fresh
- **ran (line 3acc1034a7e9):** node --test --test-name-pattern='system header|#error|C oracle' test/corpus.test.mjs (at eb51dde, the test before the fix, in a git archive extraction) · **saw:** ok without the header; not ok with the header in the compiler's standard directories, on C_INCLUDE_PATH and on CPATH: checked: c 1; 0 disagreements, 0 explained; UNUSED explained.md:1; # tests 7 # pass 4 # fail 3
- **ran (line 3acc1034a7e9):** the same at 95e8787 · **saw:** # tests 7 # pass 7 # fail 0
- **ran (line 3acc1034a7e9):** the same pattern at 95e8787 with scripts/corpus.mjs mutated twice: -nostdinc dropped; the environment filter dropped · **saw:** without -nostdinc only the standard-directories condition fails; without the filter only the C_INCLUDE_PATH and CPATH conditions fail
- **ran (line 3acc1034a7e9):** cc -MM -MG with and without -nostdinc (include paths of the environment removed) over all 103 C and C++ source files of leveldb and hiredis at their pins, with the manifest's include directories and defines · **saw:** leveldb 77 of 77 and hiredis 26 of 26 give the same closure both ways; ssl.c unreadable both ways on this host
- **ran (line 3acc1034a7e9):** npm run check at 94b0558, as its steps (see 713) · **saw:** # tests 2682 # pass 2681 # fail 0 # skipped 1 (go not installed); the rebuilt dist is identical to the committed dist
- **ran (line 038eaf06a805):** gh run view 43473055956 --json jobs (Runes CI on release/1.1.0 at 8b0173d) · **saw:** corpus: success (npm run corpus -- --tier routine --strict on ubuntu-latest); run conclusion success
- **ran (line 038eaf06a805):** gh run view 43473055956 --json headSha,conclusion,jobs · **saw:** headSha 8b0173d (release/1.1.0 with the fix), conclusion success; corpus success

### Notes

Assumed: the C oracle is made independent of the installed headers (cc -MM -MG -nostdinc, with CPATH, C_INCLUDE_PATH, CPLUS_INCLUDE_PATH, OBJC_INCLUDE_PATH, OBJCPLUS_INCLUDE_PATH removed from its environment) rather than giving explanations a condition: one rule for every C repository and no new entry syntax. The hiredis explanation stays and matches on every machine; only its reason text changed. leveldb 401 and hiredis 44 checked, as before.

The second half of line 2 on this machine: npm run corpus -- --tier routine --strict at 94b0558 printed all 50 lines ok (hiredis checked: c 44; 1 disagreements, 1 explained; no UNUSED), and fails only on 3 skipped oracles, gin go and sh go (go not installed) and CleanArchitecture csharp (dotnet not installed); this machine lacks those toolchains, which is outside this issue.

rev-733-opus, the first half of line 2 on this host: npm run corpus -- --tier routine --strict at 94b0558 (the shared corpus cache) printed all 50 lines ok (leveldb checked: c 401; hiredis checked: c 44; 1 disagreements, 1 explained; no UNUSED) and corpus gate: FAILED (1), only on three skipped oracles (gin go and sh go: go is not installed; CleanArchitecture csharp: dotnet is not usable). Not a pass, so no proof row: this host lacks go and dotnet. The CI corpus job on the pushed branch, the jarl's after the push, is what proves the line.

