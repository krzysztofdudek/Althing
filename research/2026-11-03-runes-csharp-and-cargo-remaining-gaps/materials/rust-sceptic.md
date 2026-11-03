# Rust sceptic: the 19 findings of the Rust audit, checked again

Sceptic: skp-runes-rust-opus, a fresh Opus instance that did not run the audit.

## What I ran

- Both auditor runners on all 53 probes, on the 5227538 tree and the v1.0.0 tree, from `materials/` with `timeout 300 nice -n 15 node rust-probe-runner-owned.mjs <tree> probes/rust/*.md` and `rust-probe-runner.mjs` on 5227538. My output is in `sceptic/run-5227538.txt`, `sceptic/run-5227538-treerunner.txt` and `sceptic/run-v1.0.0.txt`. The two runners agree on 5227538, and the v1.0.0 diff is the one in section 5 of the audit, line for line.
- Cargo `src/cargo/util/toml/targets.rs` at tag `0.85.0`, fetched read-only into a scratch directory outside the repository. Every quotation in rules R1 to R7 of the audit matches the file: `normalize_lib`, `inferred_bins`, `infer_subdirectory` (`if main.exists()`), `toml_targets_and_inferred` (the edition 2015 branch returns `false`), `target_path` (a declared path returns at once; the legacy path applies only in 2015 and only when the name matches no inferred target), `normalize_benches` (`legacy_bench_path`) and `normalize_build`.
- The cited lines of `src/relations/resolve-path.mts`, `src/relations/extractors/rust-resolve.mts` and `src/relations/extractors/rust.mts` at 5227538. Each finding's `where` points at the code that produces the behaviour.
- `grep` of the v1.0.0 tree for `2015` and `edition` in the Rust passes: it has no edition handling at all.
- The 6.2.0 issues on Rust and Cargo (237, 470, 472, 481, 484, 488, 490): none of them names any of the 19 gaps.

## A defect in six probes, and the corrected probes

p10, p13, p14, p15, p16 and p17 put the importing file at `src/api/client.rs` while the root says only `mod api;` and no `src/api.rs` or `src/api/mod.rs` exists. rustc rejects that tree (E0583, file not found for module `api`), and `client.rs` sits in no module tree, so the probes as written test no compilable crate. The Runes outcome does not depend on the declaration for these paths, so I rewrote them with `src/api/mod.rs` declaring the client modules, under `materials/sceptic/`:

| Probe | Covers | 5227538 | v1.0.0 |
|---|---|---|---|
| s10-edition-inline-declared | p10 | `app/src/api/client.rs:1 -> node:config`, false | no false edge |
| s13-uniform-declared | p13, plus a uniform path whose module is its own node | `src/api/other.rs:2 -> node:round` lost | same |
| s15-2015-declared | p14, p15, p16 in one 2015 crate | `src/api/a.rs:1 -> node:depsrc` false; `b.rs:1` and `c.rs:1` lost | same |
| s17-2021-extern-alias-declared | p17 | `src/api/client.rs:1 -> node:dep` lost | same |
| s40-edition-inline-criterion-bench | rust-1-edinline on the criterion shape `[[bench]] name = "parse" harness = false` | `app/benches/render/main.rs:1 -> node:helpers` lost | edge present |

Each finding holds on the corrected probe. s40 widens rust-1-edinline: a member that spells its edition `edition = { workspace = true }` and declares a single criterion bench loses every other auto-discovered bench, and v1.0.0 kept them.

## Verdicts

| ID | Verdict | Severity after | Reason |
|---|---|---|---|
| rust-1-edinline | confirmed | high | `assign` sets `edition = tomlString(value)` for `['package','edition']`, which is undefined for an inline table, and only the dotted `edition.workspace` path sets `editionInherited` (`resolve-path.mts:735`); `isEdition2015` then returns `(manifest.edition ?? '2015') === '2015'`. TOML reads both spellings as one key, so Cargo inherits 2021. Reproduced on p10, p40, p51, s10 and s40. Regression: v1.0.0 has no edition rules and gives the right edges on p40 and s40 and no false edge on p10, p51 and s10. The inline spelling is used by some large workspaces, and the error flips every file of the member to 2015 rules, so high stands. |
| rust-1-libsubdr | confirmed, severity changed | medium | `rustTargetFor` returns `srcDir: 'src'` for any non-root file under `src/` (the final return), so `crate::util` from `src/core/engine/mod.rs` misses `src/core/util/mod.rs` and falls to the root file, closing a cycle (p01) or to the binary's module (p02). Same at v1.0.0. The harm per package is real, but a `[lib] path` in a subdirectory of `src/` is a rare layout; `path = "lib.rs"` and `path = "src/<name>.rs"` are the usual custom paths, and neither is affected. |
| rust-1-libfirst | confirmed | medium | The final return of `rustTargetFor` lists `[src/lib.rs, src/main.rs]` and `resolveFromModuleDir` takes the first root that declares the name (`rust-resolve.mts:280`). The Reference says `crate` is the root of the current crate, here the binary. Reproduced on p46 and p54, same at v1.0.0. It needs a name declared in both roots, so medium. |
| rust-1-binpthsr | confirmed | medium | A `[[bin]] path = "src/cli.rs"` is a root only for the file itself (`targets.includes(rel)`); its module `src/args/mod.rs` gets the `src` tree with the library and `src/main.rs` as roots. Cargo's `target_path` returns the declared path as the root. Reproduced on p06, same false edge at v1.0.0. When the library has no item of that name, the edge is lost instead. |
| rust-1-bincommn | confirmed | medium | The `src/bin/<dir>/...` branch of `rustTargetFor` returns root `src/bin/<dir>/main.rs` without checking that it exists, while Cargo's `infer_subdirectory` makes the directory a target only `if main.exists()`. Reproduced on p05 and p19, same at v1.0.0. Lost edges only. |
| rust-1-patchsec | confirmed | medium | `dependencyFor` reads only `[dependencies]` paths and `[workspace.dependencies]`; no `[patch]` table is parsed. The Cargo Book's `[patch]` section replaces the registry crate with the path for the whole workspace. Reproduced on p30 and p31, same at v1.0.0. |
| rust-1-derivenm | confirmed | medium | `rustFileDeclares` matches item keywords, `macro_rules!`, `extern crate` and `use` lines; a name that appears only inside `#[proc_macro_derive(Builder)]` matches none. The Reference, Derive macros: the derive's name is the attribute's argument. Reproduced on p38, same at v1.0.0. In-repo derive crates are common in workspaces, and a facade crate's `pub use x_derive::Builder;` loses its edge the same way. |
| rust-1-globroot | confirmed | medium | `rustFileDeclares` finds no `Order` in `mod types; pub use types::*;`, so `use kit::Order;` binds nothing (p50), and that was the only edge between the crates. p41 alone would not count: its own Rule accepts silence for the in-crate case. Same at v1.0.0. |
| rust-1-buildpth | confirmed | low | `rustTargetFor` treats only `rel === 'build.rs'` as the build script; `tools/build.rs` falls to the `src` tree with the library root, giving the false `tools/build.rs:2 -> node:util` of p04 and the silence of p03. Cargo's `normalize_build` takes the written file. A custom build path is rare. |
| rust-1-dep2015s | confirmed | low | `resolveRustPath` calls `dependencyFor` (`rust-resolve.mts:127`) before the 2015 crate-relative branch (`:133`). The Reference, Extern prelude, edition differences: in 2015, crates in the extern prelude cannot be referenced through `use`. Reproduced on p15 and s15. Needs a 2015 crate with a path dependency named like a root module. |
| rust-1-externas | confirmed | low | The extractor emits the crate name of `extern crate engine_core as core2;` and drops the alias (`rust.mts:352`); no resolver path knows `core2`. The Reference: an `extern crate` at the crate root adds its name to the extern prelude. Reproduced on p16, p17, s15 and s17. |
| rust-1-uniform1 | confirmed | low | `resolveRustPath` returns undefined for a bare first segment that is neither the package, a path dependency nor a 2015 root item (`rust-resolve.mts:139`). s13 shows a lost edge that no other line repeats (`use shapes::round::Arc;`), but most such lines repeat an edge their file already has, so low stands. |
| rust-1-lead2015 | confirmed | low | In 2015 a leading `::` is relative to the crate root (Reference, Paths, path qualifiers); the extractor drops the path. Reproduced on p14 and s15, same at v1.0.0. Rare in live code. |
| rust-1-pathdocc | confirmed | low | `modHasPathOverride` walks back only over `attribute_item` siblings (`rust.mts:220`); a `///` doc comment is a comment node in tree-sitter-rust and stops the walk. Rust accepts attributes and doc comments in any order. Reproduced on p20. Rare ordering. |
| rust-1-cfgifmod | confirmed, severity changed | medium | p23 is silent: the macro body is a token tree, and the extractor emits no `mod` from it. `cfg_if!` with `mod` declarations inside its branches is the standard shape of platform layers in widely used crates (libc and getrandom among them), so this is a real, less common layout, which the brief's scale calls medium. Lost edges only. |
| rust-1-undeclfl | confirmed | low | `resolveFromModuleDir` takes `<dir>/<seg>.rs` when it exists (`rust-resolve.mts:268`) and never asks whether a `mod` declares it. The Reference, Modules: a file is a module only through a `mod` declaration. Reproduced on p27 and p28. Both shapes are rare. |
| rust-1-textdecl | confirmed | low | `rootDeclares` uses `rustFileDeclares`, a regex over the comment-stripped text; strings and nested `fn`s count, and the source comment at `stripRustComments` admits the string case. Reproduced on p43, with p42 silent. It needs a `#[macro_export]` name the root mentions in a string or a nested fn, which is rare, even though the false edge closes a cycle. |
| rust-1-benchleg | confirmed | low | `legacy_bench_path` exists in Cargo exactly as quoted and applies only in 2015 when no `benches/bench.rs` matches; Runes models legacy bin paths only. Reproduced on p09. Very rare. |
| rust-1-pathkids | confirmed | low | rustc treats a file loaded through `#[path]` outside inline modules as owning its directory, the way a `mod.rs` does; Runes skips the `#[path]` mod and then reads `src/platform/linux.rs` as a non-mod-rs file. Reproduced on p53. Rare. |

## Counts after this check

- Verdicts: 17 confirmed, 2 confirmed with a changed severity, 0 refuted.
- Severity: 1 high, 8 medium, 10 low. The auditor had 2 high, 6 medium and 11 low. rust-1-libsubdr moved from high to medium, rust-1-cfgifmod from low to medium.
- Regressions: one, rust-1-edinline. s40 shows it also reaches the common criterion bench shape.

## Limits

- I ran no rustc or Cargo either. The verdicts rest on the Cargo source quoted above, the Rust Reference and the outputs of the built trees.
- How common each layout is rests on my judgement, not on a corpus count.
- p21 is outside the 19 findings, and I did not judge it. Its own Rule names silence as the safe outcome, and Runes gives `src/lib.rs:3 -> node:sys` because `modHasPathOverride` does not read `cfg_attr(…, path = …)`. The auditor recorded it as a pass.
