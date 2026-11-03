# 515 · [package] build = "<file>" is not read

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-buildpth
**Where:** src/relations/resolve-path.mts:446

## What
Claim: Only a file named build.rs at the package root is taken as the build script's root. A build script named by [package] build is treated as a file of the src/ tree: its `mod x;` is looked for under a directory named after it, and its crate:: paths resolve into the library.

p03 (build = "build/main.rs"): silence where Rust gives build/main.rs:1 and :2 -> node:gen. p04 (build = "tools/build.rs"): tools/build.rs:2 -> node:util, a false edge into the library's src/util/mod.rs instead of the script's own tools/util.rs. Cargo targets.rs normalize_build. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Read [package].build as a string and root that file as the build script (srcDir its directory, fileIsRoot true); treat `build = false` as no build script.

## Evidence

