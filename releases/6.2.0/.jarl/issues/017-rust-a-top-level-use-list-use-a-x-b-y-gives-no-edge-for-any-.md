# 017 · Rust: a top-level use list `use {a::X, b::Y};` gives no edge for any item, although the extractor's comment says this form is handled

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-izxn
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/rust.mts, Runes/test/relations/extractors/rust.test.mjs, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/rust.mts: the handleArgument switch :264-321 (no `case 'use_list'`, falls through to `default: return` :319), the call `handleArgument(arg, '')` :327, comment :301-303; test test/relations/extractors/rust.test.mjs:176-181
**Branch:** jarl/015-rust
**Merged:** dac58df in ../../../Runes
**CI:** none

## What
tree-sitter-rust 0.24.2 turns the argument of `use {a::X, b::Y};` into a bare `use_list`, which handleArgument does not handle, so nothing is emitted, also for nested groups and `pub use {…}`. The comment says that `use {a, b};` goes through the scoped_use_list branch 'with no usable prefix', but that branch handles only `use ::{a, b};`. Reproduction (npm @chrisdudek/yg@6.1.0 with runes 1.0.0, a project with no AST cache): app depends on the path crate core-lib; app/src/a.rs: `use {core_lib::Invoice, std::fmt::Debug};`, b.rs: `use core_lib::total;`; `yg check --json` reports only b.rs:2 → core. `use core_lib::{Invoice};` (c.rs) and `use ::{core_lib::Invoice};` (e.rs) also work. Silent: a.rs, `use { core_lib::{Invoice, total}, std::fmt::Debug };` (d.rs) and `pub use {core_lib::total};` (g.rs). A copy of dist with only `case 'use_list'` added (4 lines) restores a.rs:2, d.rs:3 and g.rs:2 → core. BurntSushi/ripgrep @3fce3b5 (one node per crates/<name>; 28 files start with `use {`): ignore→globset and regex→matcher have no edge at all, although they are real path dependencies; with the patch they appear (ignore→globset ×2, regex→matcher ×6) plus 12 edges on existing pairs, +20 in total. The test rust.test.mjs:176-181 pins the empty result as the 'unhandled-argument case', contrary to the comment in the source. The verifier's correction: the finder's third example, rg (crates/core) → grep, does NOT follow from this defect: it stays silent with the patch too, and also for a plain `use grep::matcher::Matcher;` (a separate cause, probably the re-export `pub extern crate grep_matcher as matcher;` or `[[bin]] path` in the root; unverified, for a separate issue). Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-14/log.txt (repro.sh).

## Why
A silent false negative in the basic relation check, which loses whole dependencies between crates in a well-known repository. docs/relations-flows-ports.md:49 promises resolving 'every item of a use tree on its own', and the table of known grammar limitations (the Rust row) does not list this gap; `use {…}` is valid Rust 2018+ and the house style of a well-known project. Grain ships the same extractor.

## Acceptance
- handleArgument has a `case 'use_list'` that walks the named children with the current prefix; a.rs, d.rs and g.rs give an edge to core, and on ripgrep ignore→globset and regex→matcher appear.
- The test rust.test.mjs:176-181 expects edges for `use {a, b};`, the comment :301-303 corrected; a Runes release and a bumped pin in Yggdrasil.

## Changelog
- Fixed: Rust imports written as a brace list with no path prefix (`use {core_lib::Invoice, std::fmt::Debug};`, also nested and `pub use {…}`) now give an edge for every item; before, the whole declaration was ignored and cross-crate dependencies went unreported.

## Evidence

- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1492, pass 1492, fail 0, dist/ is fresh; npm run coverage: tests 1492, pass 1492, fail 0, all files 98.71 / 93.59 / 98.49, exit 0; merge dac58df

Rerun 2026-11-11 on the built Yggdrasil (release/6.2.0 plus this lease, Runes build of commit c5124ca0525e stamped 1.1.0) beside the published @chrisdudek/yg@6.1.0, on a synthetic project rebuilt from the issue text (one node per directory, no relations, yg check --no-approve --json). 017: app depends on the path crate core-lib (edition 2021). 6.1.0: only b.rs:1 (use core_lib::total;). Built: a.rs:1 (use {core_lib::Invoice, std::fmt::Debug};), b.rs:1, d.rs:1 (nested list) and g.rs:1 (pub use {...}) -> core. ripgrep was not rerun.

