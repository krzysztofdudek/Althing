# 512 · [patch] path replacements are not read

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-xxoi
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-patchsec
**Where:** src/relations/resolve-path.mts:356

## What
Claim: A [patch.<registry>] entry with a path replaces the registry crate for the whole workspace, so the dependency is in the repository. Runes reads no [patch] table and leaves the dependency external.

p30 ([patch.crates-io] in the package's own manifest) and p31 (in a virtual workspace root): silence for `use kit::Engine;`; Cargo builds vendor/kit, so the edge is app -> node:vendored. The Cargo Book, Overriding dependencies, The [patch] section. Same at v1.0.0.

## Why


## Acceptance
- [test] A [patch.<registry>] entry with a path, in the workspace root manifest or in the manifest of a package that is its own workspace, replaces the dependency of that name for every package of the workspace, so a use of it binds the patched path's library (The Cargo Book, Overriding dependencies, The [patch] section), with the audit's probes p30 and p31 as catalogue cases (-> vendored), red before and green after · by: npm run check
- [test] A patch entry that renames with package = is matched by the dependency's package name, and its path is relative to the manifest that writes the [patch], with a case · by: npm run check
- [test] A [patch] in a member manifest that is not the workspace root is ignored, as Cargo ignores it, a dependency with its own path keeps that path, and a patch entry without a path leaves the dependency external, with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

