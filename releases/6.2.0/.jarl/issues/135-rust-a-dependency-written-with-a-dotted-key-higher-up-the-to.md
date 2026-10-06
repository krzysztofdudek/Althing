# 135 · Rust: a dependency written with a dotted key higher up the TOML tree (dependencies.foo.path at the root or under [workspace]) is still not read

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, rust
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** ../../../Runes
**Found by:** runes-015
**Where:**
**Branch:** jarl/135-cargo-manifest
**Merged:** a8e0bc4 in ../../../Runes
**CI:** none

## What
After fix 015 parseCargoManifest reads dotted keys inside dependency tables, but not the form one level up: 'dependencies.foo.path = "../foo"' at the root of Cargo.toml or 'workspace.dependencies.foo.path' under [workspace]. Every use foo::… from such a crate is silent.

## Why
This is the same kind of silent edge as 015; valid TOML, a less used form.

## Acceptance
dependencies.foo.path at the root and workspace.dependencies.foo.path give the same spec as [dependencies] foo = { path = … }; a case in the relation catalogue red before, green after.

## Changelog
- Fixed: Cargo.toml dependencies written with a dotted key that names the dependency table itself (`dependencies.foo.path = "../foo"` above the first table header, `dependencies.foo.path` or `dependencies.foo = { … }` inside `[workspace]` or `[target.<cfg>]`, `workspace.dependencies.foo.path`) are now read like the `[dependencies]` table form, so `use foo::…` from such a crate gives an edge; before, every import of that crate was silently ignored.

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1589, pass 1589, fail 0, catalogue 485 cases, dist/ is fresh; npm run coverage: tests 1589, pass 1589, fail 0, all files 98.77 / 94.01 / 98.58, exit 0; merge a8e0bc4 (catalogue count conflict resolved to 483 + 2 = 485)

