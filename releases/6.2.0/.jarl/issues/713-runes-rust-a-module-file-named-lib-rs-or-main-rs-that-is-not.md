# 713 · Runes, Rust: a module file named lib.rs or main.rs that is not a crate root keeps its inline modules beside it, so a #[path] in an inline module there is placed wrongly (a false edge)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261112T0400-spri
**Tags:** runes, rust
**Files:** Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**After:** 651
**Found by:** jarl
**Where:** rev-645b-opus, round 2 (src/relations/resolve-path.mts:122, holdsModulesBeside)
**Branch:** jarl/733-ci-green
**Merged:** 8b0173d14e447779237b24c9b0f810c9683a6010 in Runes
**Merge check:** npm run check · saw ℹ tests 2682, pass 2679, fail 0, skipped 3; dist/ is fresh; exit 0

## What


## Why
holdsModulesBeside takes any lib.rs or main.rs for a crate root by its name; src/a/lib.rs reached as mod lib keeps its inline modules in a folder of its own name, as rustc reads it.

## Acceptance
[test] With src/lib.rs (mod a), src/a.rs (mod lib) and src/a/lib.rs (mod outer { #[path = "loaded.rs"] mod x; }), Runes places x at src/a/lib/outer/loaded.rs, as rustc does, and gives no edge from src/a/outer/loaded.rs, as a catalogue case, red before and green after · by: npm run check

## Changelog
- Fixed: Rust: a module file named `lib.rs` or `main.rs` that is not a crate root (declared with `mod lib;`) now holds its inline modules in a directory of its own name, so a `#[path]` module inside one binds the file rustc loads and no stray file beside it.

## Reviews
- **approve** · by rev-733-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1723-imsf
  Approve at 94b0558, Minor findings only. 733: the assumed cause is confirmed with cargo 1.99.1 (rust:1.99.1-slim image): the old writer's config with the CI's Windows stub path gives exactly the six CI lines, rust-patch-crates-io-path-edge included (failed to parse manifest, Caused by: could not load Cargo configuration, because its root manifest names a crates.io dependency and Cargo reads the configuration while parsing it); the new writer's config builds all six, cargo reading the escaped path as that literal directory. The six are exactly the building cases that need stub crates. The whole Rust catalogue build test passes at 94b0558 under 1.99.1 (the new 713 case builds; the 46 listed still do not); tomllib reads back 12 edge paths. The unit test is red at 0551ff2 for the right reason. 734: red at eb51dde, green at 95e8787; each half of the fix is caught by its own condition (mutations); closures with and without -nostdinc are identical for all 103 C/C++ files of leveldb and hiredis, so no other corpus answer moves; strict routine corpus: all 50 lines ok, fails only on skipped go/dotnet oracles of this host. 713: red at 808f46e, green after; 17 invented layouts (bins, examples, tests, benches in dirs, [[bin]]/[lib] paths, workspace member, edition 2015, main.rs and lib.rs module files, path-loaded lib.rs, no Cargo.toml) match rustc 1.99.1 at 94b0558; only the three non-root module files moved. Suite: 2682 tests, 2681 pass, 0 fail, 1 skipped (go); dist identical to the committed one. Open: 733 line 2 and the CI half of 734 line 2, the jarl's after the push (the branch is not pushed).
  outside the issue, filed as 736: Runes corpus: since 734 the C oracle reads hiredis's ssl.c as unreadable on every machine, so its 6 include edges, which CI's corpus job checked before (run 43154806778: hiredis checked: c 50), are checked nowhere (44). With -nostdinc and -DHIREDIS_NO_PEER_NAME_VERIFICATION, the define ssl.c's own #error names, ssl.c preprocesses on this host (closure: hiredis.h, read.h, sds.h, alloc.h, async.h, net.h, win32.h, async_private.h, hiredis_ssl.h). Adding that define to hiredis's c.defines in corpus/manifest.json would check all 50 on every machine, and the ssl.c explanation would then be retired because its disagreement no longer occurs.
  outside the issue, filed as 737: Runes, Rust: a library rooted at the package root (Cargo.toml [lib] path = "lib.rs") whose lib.rs holds only mod outer { #[path = "loaded.rs"] mod x; } gives no edge for mod child; in outer/loaded.rs, at 8d31e57 and at 94b0558, while rustc 1.99.1 loads outer/loaded.rs. With a mod a; beside it in lib.rs the edge is given, and src/lib.rs in the same shape gives it. A lost edge, never a false one; this branch did not change it.

## Evidence

### Proof

- **ran (line d33f028e7fa7):** node --test --test-name-pattern=module-file-named-lib test/relations/extractors/rust-name-resolution-matrix.test.mjs (at 808f46e, the case before the fix) · **saw:** not ok: expected edge src/a/lib/outer/loaded.rs:1->child not emitted (got src/lib.rs:1->a, src/a.rs:1->lib, src/a/outer/loaded.rs:1->decoy)
- **ran (line d33f028e7fa7):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (at 94b0558, after the fix) · **saw:** # tests 212 # pass 212 # fail 0
- **ran (line d33f028e7fa7):** npm run check (at 94b0558) · **saw:** tests 2682, pass 2679, fail 0, skipped 3; catalogue holds 962 cases; dist/ is fresh
- **ran (line d33f028e7fa7):** node --test --test-name-pattern=module-file-named-lib test/relations/extractors/rust-name-resolution-matrix.test.mjs (at 808f46e, the case before the fix, in a git archive extraction) · **saw:** not ok 1 - rust-path-attribute-in-inline-module-of-module-file-named-lib-edge: expected edge src/a/lib/outer/loaded.rs:1->child not emitted (got src/lib.rs:1->a, src/a.rs:1->lib, src/a/outer/loaded.rs:1->decoy); # pass 0 # fail 1
- **ran (line d33f028e7fa7):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at 94b0558) · **saw:** # tests 215 # pass 215 # fail 0
- **ran (line d33f028e7fa7):** npm run check at 94b0558 in a git archive extraction, as its steps: check:compiler, build, grammars, node --test --test-concurrency=6 over test/**/*.test.mjs with cargo and rustc 1.99.1 on PATH; then diff -r of the rebuilt dist against the committed dist, because check:dist needs a git checkout · **saw:** # tests 2682 # pass 2681 # fail 0 # skipped 1 (the Go oracle: go is not installed); both Rust build tests ran and passed; the rebuilt dist is identical to the committed dist

