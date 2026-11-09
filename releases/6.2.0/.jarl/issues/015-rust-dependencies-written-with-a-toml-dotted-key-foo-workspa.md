# 015 · Rust: dependencies written with a TOML dotted key (`foo.workspace = true`, `foo.path = "../foo"`) are not read from Cargo.toml, so every `use foo::…` from such a crate is silent

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-aert
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/resolve-path.mts, Yggdrasil/docs/relations-flows-ports.md, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/resolve-path.mts: parseCargoManifest, the key regex at l.388 `/^("[^"]+"|'[^']+'|[A-Za-z0-9_.-]+)\s*=\s*(.*)$/`, the DEP_TABLE branch l.402-404 (`into.set(key, value.startsWith('{') ? specOf(value) : { workspace: false })`), dependencyFor ~245-280; in the shipped package dist/relations/resolve-path.mjs:374 and :398
**Branch:** jarl/015-rust
**Merged:** dac58df in ../../../Runes
**CI:** none

## What
The key regex allows a dot in a bare key, so `shop-core.workspace = true` is recorded as a dependency named `shop-core.workspace` with an empty spec (the value `true` or `"../core"` does not start with `{`), dependencyFor finds neither a path nor a workspace for `shop-core`, and `use shop_core::…` is silent. Reproduction (a fresh Yggdrasil clone 2493aa16 and npm @chrisdudek/yg@6.1.0 with runes 1.0.0; `yg init --no-reviewer`; nodes app (crates/app) and core (crates/core) with no relations; app/src/main.rs: `use shop_core::Order;`), `yg check --json`: A `shop-core.workspace = true`: exit 0, no edge; B control `shop-core = { workspace = true }`: exit 1, relation-undeclared-dependency app main.rs:1 -> core; C control `[dependencies.shop-core]`: an edge; D `shop-core.path = "../core"`: none; E control `shop-core = { path = "../core" }`: an edge; F a dotted key in the root `[workspace.dependencies]` (`shop-core.path = "crates/core"`) with an inline `{ workspace = true }` in app: none; G `[dev-dependencies] shop-core.workspace = true`: none. smol-toml reads A, B and C as the same value `{"shop-core":{"workspace":true}}`, while a direct call to parseCargoManifest returns `[["shop-core.workspace",{"workspace":false}]]` for A. zed-industries/zed (crates/editor/Cargo.toml has 84 lines `.workspace = true`): in the finder's run editor→collections 36 files with `use collections::` and 0 edges, project→text 24 and 0, settings→util 4 and 0. In addition, the current check `!into.has(key)` (the first entry wins) would lose the second field of a crate written in several dotted lines. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-12/log.txt (repro.sh, make-fixture.sh, fixtures/).

## Why
The undeclared-dependency gate passes silently (exit 0) for the notation used by the workspace inheritance example in the Cargo reference and by large Rust workspaces, so it loses every edge from such a crate. docs/relations-flows-ports.md:49 promises resolving `{ workspace = true }` inheritance and path dependencies with no exception for spelling.

## Acceptance
- In a dependency table an unquoted dotted key is split into the crate name and a field (path, package, workspace), and fields from several lines merge into one spec; cases A, D, F and G give the edge app → core.
- Tests in Runes for dotted keys in [dependencies], [dev-dependencies] and [workspace.dependencies]; a Runes release and a bumped pin in Yggdrasil.

## Changelog
- Fixed: Cargo.toml dependencies written with dotted keys (`foo.workspace = true`, `foo.path = "../foo"`) in [dependencies], [dev-dependencies], [build-dependencies] and [workspace.dependencies] are now read, so `use foo::…` from such a crate gives an edge; before, every import of that crate was silently ignored.

## Evidence

- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1492, pass 1492, fail 0, dist/ is fresh; npm run coverage: tests 1492, pass 1492, fail 0, all files 98.71 / 93.59 / 98.49, exit 0; merge dac58df

