# 733 · Runes: six Rust catalogue cases that build on Linux fail to build on Windows in CI, so the Windows jobs are red

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261113T1639-eooh
**Tags:** ci, windows, rust
**Files:** Runes/test/relations/rust-cases-build.test.mjs
**Repo:** Runes
**Found by:** jarl
**Where:** Runes CI run 43154806778 at b326704, jobs test-windows (22) and test-windows (24): test/relations/rust-cases-build.test.mjs:94 'every Rust case of the catalogue builds under the pinned toolchain, except the ones listed as not building yet' fails
**Branch:** jarl/733-ci-green
**Merged:** 8b0173d14e447779237b24c9b0f810c9683a6010 in Runes
**Merge check:** npm run check · saw ℹ tests 2682, pass 2679, fail 0, skipped 3; dist/ is fresh; exit 0

## What
On windows-latest the build test of the Rust catalogue finds six cases that do not build and are not on its list: rust-edition-inline-workspace-reexported-crate-edge, rust-patch-member-manifest-ignored-silence, rust-patch-workspace-dependency-edge, rust-patch-workspace-root-edge and rust-workspace-path-dependency-edge fail with 'error: could not load Cargo configuration', and rust-patch-crates-io-path-edge with 'error: failed to parse manifest at' the case's Cargo.toml under the runner's temporary directory. On Linux the same cases build. The cause is not verified; the errors point at a Windows path written into Cargo's TOML (a config file or a manifest) where a backslash is read as an escape.

## Why
The owner's ruling ci-green-on-github-and-bounded-agents makes a green CI on GitHub on the exact commit a condition of Runes 1.1.0, and ci-everywhere-like-jarl runs the whole suite on Windows.

## Acceptance
- [test] The cause is found and fixed where it lies (the test's writer of Cargo files, or the cases), with a unit test that fails before the fix on the Windows form of the failure, for example a Windows-shaped temporary path fed through the same writer and the result parsed as TOML; the list of cases that do not build yet is not extended · by: npm run check
- [check] On Runes' pushed release/1.1.0 with the fix, both Windows jobs of CI pass every test · by: gh run view <run-id> --json jobs

## Reviews
- **approve** · by rev-733-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1723-imsf
  Approve at 94b0558, Minor findings only. 733: the assumed cause is confirmed with cargo 1.99.1 (rust:1.99.1-slim image): the old writer's config with the CI's Windows stub path gives exactly the six CI lines, rust-patch-crates-io-path-edge included (failed to parse manifest, Caused by: could not load Cargo configuration, because its root manifest names a crates.io dependency and Cargo reads the configuration while parsing it); the new writer's config builds all six, cargo reading the escaped path as that literal directory. The six are exactly the building cases that need stub crates. The whole Rust catalogue build test passes at 94b0558 under 1.99.1 (the new 713 case builds; the 46 listed still do not); tomllib reads back 12 edge paths. The unit test is red at 0551ff2 for the right reason. 734: red at eb51dde, green at 95e8787; each half of the fix is caught by its own condition (mutations); closures with and without -nostdinc are identical for all 103 C/C++ files of leveldb and hiredis, so no other corpus answer moves; strict routine corpus: all 50 lines ok, fails only on skipped go/dotnet oracles of this host. 713: red at 808f46e, green after; 17 invented layouts (bins, examples, tests, benches in dirs, [[bin]]/[lib] paths, workspace member, edition 2015, main.rs and lib.rs module files, path-loaded lib.rs, no Cargo.toml) match rustc 1.99.1 at 94b0558; only the three non-root module files moved. Suite: 2682 tests, 2681 pass, 0 fail, 1 skipped (go); dist identical to the committed one. Open: 733 line 2 and the CI half of 734 line 2, the jarl's after the push (the branch is not pushed).
  outside the issue, filed as 736: Runes corpus: since 734 the C oracle reads hiredis's ssl.c as unreadable on every machine, so its 6 include edges, which CI's corpus job checked before (run 43154806778: hiredis checked: c 50), are checked nowhere (44). With -nostdinc and -DHIREDIS_NO_PEER_NAME_VERIFICATION, the define ssl.c's own #error names, ssl.c preprocesses on this host (closure: hiredis.h, read.h, sds.h, alloc.h, async.h, net.h, win32.h, async_private.h, hiredis_ssl.h). Adding that define to hiredis's c.defines in corpus/manifest.json would check all 50 on every machine, and the ssl.c explanation would then be retired because its disagreement no longer occurs.
  outside the issue, filed as 737: Runes, Rust: a library rooted at the package root (Cargo.toml [lib] path = "lib.rs") whose lib.rs holds only mod outer { #[path = "loaded.rs"] mod x; } gives no edge for mod child; in outer/loaded.rs, at 8d31e57 and at 94b0558, while rustc 1.99.1 loads outer/loaded.rs. With a mod a; beside it in lib.rs the edge is given, and src/lib.rs in the same shape gives it. A lost edge, never a false one; this branch did not change it.

## Evidence

### Proof

- **ran (line 7dc0c52fd3e7):** node --test test/relations/rust-cases-build.test.mjs (at 0551ff2, the test before the fix) · **saw:** not ok 3 - the Cargo configuration of the stub crates keeps the stub directory as it is on every platform, a Windows path included: SyntaxError invalid escape \Users\RUN; # pass 0 # fail 1 # skipped 2
- **ran (line 7dc0c52fd3e7):** node --test test/relations/rust-cases-build.test.mjs (at 82f1433, after the fix) · **saw:** ok 3 - the Cargo configuration of the stub crates keeps the stub directory as it is on every platform, a Windows path included; # pass 1 # fail 0 # skipped 2 (the two build tests skip: no Rust toolchain here)
- **ran (line 7dc0c52fd3e7):** npm run check (at 94b0558) · **saw:** tests 2682, pass 2679, fail 0, skipped 3; dist/ is fresh; DO_NOT_BUILD_YET unchanged
- **ran (line 7dc0c52fd3e7):** node --test test/relations/rust-cases-build.test.mjs (at 0551ff2, the test before the fix, in a git archive extraction) · **saw:** not ok 3 - the Cargo configuration of the stub crates keeps the stub directory as it is on every platform, a Windows path included: SyntaxError invalid escape \Users\RUN; # pass 0 # fail 1 # skipped 2
- **ran (line 7dc0c52fd3e7):** node --test test/relations/rust-cases-build.test.mjs (at 82f1433 and at 94b0558) · **saw:** ok 3; # pass 1 # fail 0 # skipped 2 (no Rust toolchain on the host)
- **ran (line 7dc0c52fd3e7):** cargo 1.99.1 (the rust:1.99.1-slim image) cargo check --offline --all-targets --workspace over the six failing cases written by writeRustFixture, once with the old writer config for the stub path the CI printed (a Windows path under the runner's temporary directory, with backslashes) and once with the new writer config, the stubs placed in a directory of that literal name · **saw:** old: status 101 for all six; rust-patch-crates-io-path-edge: error: failed to parse manifest at Cargo.toml, Caused by: could not load Cargo configuration; the other five: error: could not load Cargo configuration, Caused by: could not parse TOML configuration (the six CI lines exactly); new: status 0 for all six
- **ran (line 7dc0c52fd3e7):** node --test test/relations/rust-cases-build.test.mjs (at 94b0558) with cargo and rustc 1.99.1 from that image on PATH · **saw:** ok 1 every Rust case of the catalogue builds except the listed ones (the new 713 case included); ok 2 the 46 listed cases still do not build; ok 3; # pass 3 # fail 0 # skipped 0
- **ran (line 7dc0c52fd3e7):** python3 tomllib over cargoConfig output at 0551ff2 and 94b0558 for 12 stub paths (drive paths, UNC, \\?\, a quote, a tab, DEL, an emoji) and a git URL with a backslash · **saw:** 0551ff2: all 12 refused (Invalid hex value / Unescaped backslash / Illegal character); 94b0558: all 12 read back equal to the path and the URL
- **ran (line 7dc0c52fd3e7):** npm run check at 94b0558, as its steps (see 713), with cargo and rustc 1.99.1 on PATH · **saw:** # tests 2682 # pass 2681 # fail 0 # skipped 1 (go not installed); the rebuilt dist is identical to the committed dist; DO_NOT_BUILD_YET unchanged
- **ran (line 6ab0b973cabd):** gh run view 43473055956 --json jobs (Runes CI on release/1.1.0 at 8b0173d) · **saw:** test-windows (22, 1/2/3) and (24, 1/2/3): success, every test passed; run conclusion success
- **ran (line 6ab0b973cabd):** gh run view 43473055956 --json headSha,conclusion,jobs · **saw:** headSha 8b0173d (release/1.1.0 with the fix), conclusion success; test-windows (22, 1), (22, 2), (22, 3), (24, 1), (24, 2), (24, 3) all success

### Notes

Assumed: rust-patch-crates-io-path-edge's different first line on Windows ('failed to parse manifest') comes from the same refused .cargo/config.toml, read while Cargo resolves the manifest's [patch.crates-io]; this machine has no Rust toolchain to show it, but the six failing cases are exactly the six outside DO_NOT_BUILD_YET that write that file, and tomllib refuses the old text with the CI path (Invalid hex value at the \U).

