# 512 · [patch] path replacements are not read

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-xxoi
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-patchsec
**Where:** src/relations/resolve-path.mts:356

## What
Claim: A [patch.<registry>] entry with a path replaces the registry crate for the whole workspace, so the dependency is in the repository. Runes reads no [patch] table and leaves the dependency external.

p30 ([patch.crates-io] in the package's own manifest) and p31 (in a virtual workspace root): silence for `use kit::Engine;`; Cargo builds vendor/kit, so the edge is app -> node:vendored. The Cargo Book, Overriding dependencies, The [patch] section. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Read [patch.*] entries with a path from the workspace root manifest, and when a dependency has no path of its own, resolve its key (or package) against them, with the path relative to the workspace root.

## Evidence

