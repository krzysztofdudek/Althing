# Rust audit: crate roots and use paths in Runes at 5227538

Auditor: aud-runes-rust-opus. Scope: `src/relations/extractors/rust.mts`, `src/relations/extractors/rust-resolve.mts` and the Rust parts of `src/relations/resolve-path.mts`, read at Runes release/1.1.0 commit 5227538 and run from its built `dist/`. Every probe also ran against the v1.0.0 tag, to label each finding a regression or a gap that already existed.

Already filed and not counted: 488 (inferred targets dropped by name, autolib) and 490 (autolib with a use of the package's own crate name). No probe here exercises either of them.

## How the probes ran

Each probe is a case file under `materials/probes/rust/`, in the shape of the catalogue's `reference/relations/rust/*.md`: a `## Files` section with a Cargo.toml and `.rs` files, and an `## Expect` section holding what rustc and Cargo resolve. A fence may name its owner with `owner=<id>`, so two files in one directory can belong to two nodes.

The runner that was in materials/ when the audit opened had been removed, so I wrote two of my own:

- `materials/rust-probe-runner.mjs` imports the tree's own `test/relations/reference-case-runner.mjs` and prints every cross-owner edge `caseEdges` returns.
- `materials/rust-probe-runner-owned.mjs` drives the same pipeline the trees' runners drive (extractor declarations into one `SymbolTable`, the files materialized under the OS temp dir, `makeResolver` with `makeResolvePathToFile`, `resolveDetectedEdges`). It reads `owner=` itself. I needed it because the v1.0.0 runner ignores `owner=` and assigns owners by parent directory, which would have made the v1.0.0 results meaningless for the probes that use it.

On 5227538 the two runners printed the same output for all 53 probes (`diff` empty). Every result below comes from the owned runner.

Commands, from the research folder's `materials/` directory, with `C=Althing/.cache`:

```
timeout 200 nice -n 15 node rust-probe-runner.mjs $C/audit-runes-5227538 probes/rust/*.md
timeout 200 nice -n 15 node rust-probe-runner-owned.mjs $C/audit-runes-5227538 probes/rust/*.md
timeout 300 nice -n 15 node rust-probe-runner-owned.mjs $C/audit-runes-5227538 probes/rust/*.md
timeout 300 nice -n 15 node rust-probe-runner-owned.mjs $C/audit-runes-v1.0.0 probes/rust/*.md
```

Cargo source read: `src/cargo/util/toml/targets.rs` at Cargo tag `0.85.0`, fetched read-only from raw.githubusercontent.com into a scratch directory outside the repository.

## 1. The rules that decide which file a path binds

Cargo targets (targets.rs at 0.85.0):

- R1. The library is `[lib].path` when written, else `src/lib.rs` (`inferred_lib`: `let lib = Path::new("src").join("lib.rs");`). In edition 2015 a `[lib]` with no path falls back to `src/<name>.rs` (`normalize_lib`: `if edition == Edition::Edition2015 && package_root.join(&legacy_path).exists()`).
- R2. Binaries are `src/main.rs`, named like the package, plus each `src/bin/<x>.rs` and each `src/bin/<x>/main.rs` (`inferred_bins`; `infer_subdirectory`: `let main = path.join("main.rs"); ... if main.exists() { ... Some((name, main)) } else { None }`). A directory under `src/bin/` without `main.rs` is no target.
- R3. A declared target's `path` is its root (`target_path`: `if let Some(ref path) = target.path { return Ok(path.0.clone()); }`); a target that gives only a name is matched against the inferred ones by name.
- R4. In edition 2015 a declared target of a kind turns that kind's discovery off unless the flag says otherwise (`toml_targets_and_inferred`: `if edition == Edition::Edition2015 { ... false } else { true }`).
- R5. Legacy paths, 2015 only: `legacy_bin_path` (`src/<name>.rs`, `src/main.rs`, `src/bin/main.rs`) and `legacy_bench_path` (`src/bench.rs` for a bench named `bench`: `if !(name_or_panic(bench) == "bench" && package_root.join(&legacy_path).exists())`).
- R6. The build script is `build.rs` beside the manifest, or the file `[package] build` names (`normalize_build`: `Some(StringOrBool::String(build_file)) => { let build_file = paths::normalize_path(Path::new(build_file)); ...`).
- R7. Dotfiles in a discovery directory are skipped (`is_not_dotfile`).

Editions (Rust Reference, Use declarations, Paths, Preludes):

- R8. 2015: a `use` path is relative to the crate root; a path starting with `::` is relative to the crate root too; crates in the extern prelude "cannot be referenced via use declarations" (Preludes, Extern prelude, edition differences), so a dependency needs `extern crate`.
- R9. 2018 and later (2021, 2024 alike): a `use` path starts with `crate`, `self`, `super`, a crate in the extern prelude, or a name in scope in the current module (uniform paths); an ambiguity between the last two is an error.
- R10. `extern crate a as b;` at the crate root puts `b` in the extern prelude.
- R11. The edition is `[package].edition`, inherited with `edition.workspace = true` (TOML also allows `edition = { workspace = true }`, the same key); absent means 2015. `[lib]` and each target may set their own.

Modules (Rust Reference, Modules):

- R12. `mod x;` in a crate root or a `mod.rs` file is `x.rs` or `x/mod.rs` beside it; in a non-mod-rs file `a.rs` it is under `a/`; each inline module adds a directory.
- R13. `#[path = "..."]` overrides the location; a file loaded through `#[path]` outside inline modules owns its directory as a mod-rs file does. `#[cfg_attr(pred, path = "...")]` applies it on some targets.
- R14. A file is a module only when a `mod` declares it.

Packages and dependencies (The Cargo Book):

- R15. Path dependencies in `[dependencies]`, `[dev-dependencies]`, `[build-dependencies]` and their `[target.<cfg>]` forms; `package =` renames; `workspace = true` inherits `[workspace.dependencies]` (paths relative to the workspace root); the code name is the key when renamed, else the dependency's lib name.
- R16. `[patch.<registry>]` in the workspace root replaces a dependency with a path for the whole workspace.
- R17. A package is the directory of its own Cargo.toml, so a fixture package nested in another is a crate of its own.

Re-exports and macros:

- R18. `pub use m::X;` and `pub use m::*;` at the root make `X` a root path; `#[macro_export]` puts a macro in the root namespace wherever it is defined; `#[proc_macro_derive(Name)]` defines a derive called `Name` in a proc-macro crate's root.

## 2. Every probe

Each line is `<probe>: <edges at 5227538>`. Where v1.0.0 printed something else, its line follows. A verdict says pass, or which finding the probe supports.

| Probe | Rule | Output at 5227538 | v1.0.0 | Verdict |
|---|---|---|---|---|
| p01 lib path under a src subdirectory | R1, R12 | `src/core/engine/mod.rs:1 -> node:core`, `src/core/engine/mod.rs:2 -> node:core`, `src/core/lib.rs:1 -> node:engine`, `src/core/lib.rs:2 -> node:util` | same | F2 (line 1 should be node:util) |
| p02 same, beside `src/main.rs` | R1, R2 | `src/core/engine/mod.rs:1 -> node:bin_util`, `src/core/lib.rs:1 -> node:engine`, `src/core/lib.rs:2 -> node:util`, `src/main.rs:1 -> node:bin_util` | same | F2 (line 1 binds the binary's module) |
| p03 `build = "build/main.rs"` with `mod gen;` | R6, R12 | silence | same | F6 (two edges lost) |
| p04 `build = "tools/build.rs"` with `crate::util` | R6 | `src/lib.rs:1 -> node:util`, `tools/build.rs:2 -> node:util` | same | F6 (`tools/build.rs:2` is false) |
| p05 `src/bin/common/mod.rs` shared module | R2, R12 | `src/bin/app.rs:1 -> node:common`, `src/bin/app.rs:2 -> node:config` | same | F5 (two edges from common lost) |
| p06 `[[bin]] path = "src/cli.rs"` beside `src/lib.rs` | R3 | `src/args/mod.rs:1 -> node:lib`, `src/cli.rs:1 -> node:args` | `src/args/mod.rs:1 -> node:lib` | F3 (`-> node:lib` is false, should be node:cli) |
| p07 `build.rs` with `mod codegen;` | R6, R12 | `build.rs:1 -> node:codegen` | silence | pass (fixed since 1.0) |
| p08 `examples/demo/main.rs` modules | R2, R12 | three expected edges | same | pass |
| p09 2015 `[[bench]] name = "bench"`, `src/bench.rs` | R5 | silence | same | F18 |
| p10 `edition = { workspace = true }`, workspace 2021 | R11, R9 | `app/src/api/client.rs:1 -> node:config`, `app/src/lib.rs:1 -> node:config` | `app/src/lib.rs:1 -> node:config` | F1 (client.rs:1 is false), regression |
| p11 control, `edition.workspace = true` | R11 | `app/src/lib.rs:1 -> node:config` | same | pass |
| p12 2021 root `mod shapes; pub use shapes::Circle;` | R9 | `src/lib.rs:1 -> node:shapes` | same | F10 (line 2 lost) |
| p13 2021 `use crate::shapes; use shapes::Circle;` | R9 | `src/api/client.rs:1 -> node:shapes`, `src/lib.rs:1 -> node:shapes` | same | F10 (line 2 lost) |
| p14 2015 `use ::shapes::Circle;` | R8 | `src/lib.rs:1 -> node:shapes` | same | F11 (client.rs:1 lost) |
| p15 2015 root `mod util;` and path dep `util` without `extern crate` | R8 | `src/api/client.rs:1 -> node:depsrc`, `src/lib.rs:1 -> node:localutil` | same | F8 (client.rs:1 should be node:localutil) |
| p16 2015 `extern crate engine_core as core2;` | R8, R10 | `src/lib.rs:1 -> node:dep` | same | F9 (client.rs:1 lost) |
| p17 2021 `extern crate engine_core as core2;` | R10 | `src/lib.rs:1 -> node:dep` | same | F9 (client.rs:1 lost) |
| p18 2024 bare `use shapes::Circle;` in a submodule | R9 | `src/lib.rs:2 -> node:shapes` | same | pass |
| p19 2015 bin `src/bin/tool.rs`, `use cli::Args;` in `src/bin/run/mod.rs` | R8, R2 | `src/bin/tool.rs:1 -> node:cli`, `src/bin/tool.rs:2 -> node:run` | same | F5 (run/mod.rs:1 lost) |
| p20 `#[path]`, then a doc comment, then `mod sys;` | R13 | `src/lib.rs:3 -> node:sys` | same | F12 (false edge to the decoy) |
| p21 `#[cfg_attr(unix, path = ...)]` twice, then `mod sys;` | R13 | `src/lib.rs:3 -> node:sys` | same | pass: `src/sys/mod.rs` is the module on every other target, so the edge is real there |
| p22 non-mod-rs file with nested inline `mod proto { mod wire; }` | R12 | three expected edges | same | pass |
| p23 `mod` inside `cfg_if!` | R12 | silence | same | F13 |
| p24 `mod.rs` and `name.rs` children | R12 | four expected edges | same | pass |
| p25 `self::Thing` in `src/a.rs` | R12 | silence | same | pass |
| p26 `super::super` inside an inline module in a fn | R12 | three expected edges | same | pass |
| p27 `crate::serve()` in bin `server.rs`, another bin `src/bin/serve.rs` | R14 | `src/bin/server.rs:2 -> node:servebin` | same | F14 |
| p28 `crate::util::parse` (a fn) with a stale undeclared `src/util/parse.rs` | R14 | `src/cmd/mod.rs:1 -> node:stale`, `src/lib.rs:1 -> node:util`, `src/lib.rs:2 -> node:cmd` | same | F14 |
| p30 `[patch.crates-io] kit = { path = ... }` | R16 | silence | same | F7 |
| p31 `[patch]` in a virtual workspace root | R16 | silence | same | F7 |
| p32 `[target.'cfg(target_os = "linux")'.dependencies]` | R15 | `app/src/lib.rs:1 -> node:sysdep` | same | pass |
| p33 dev-dependency from tests, build-dependency from build.rs | R15 | `app/build.rs:1 -> node:gen`, `app/tests/it.rs:1 -> node:fixtures` | same | pass |
| p34 `package =` rename and a dependency's `[lib] name` | R15 | `app/src/lib.rs:1 -> node:db`, `app/src/lib.rs:2 -> node:fmt` | same | pass |
| p35 rename inside `[workspace.dependencies]`, `store.workspace = true` | R15 | `crates/app/src/lib.rs:1 -> node:db` | silence | pass (fixed since 1.0) |
| p36 the same dependency in normal and dev tables | R15 | `app/tests/t.rs:1 -> node:core` | same | pass |
| p37 dev-dependency renaming the same package differently | R15 | `app/tests/t.rs:1 -> node:engine`, `app/tests/t.rs:2 -> node:engine` | same | pass |
| p38 `use derive_kit::Builder;` for `#[proc_macro_derive(Builder)]` | R18 | silence | same | F15 |
| p39 `[workspace.dependencies]` path relative to the root | R15 | `services/api/src/main.rs:1 -> node:util` | same | pass |
| p40 `edition = { workspace = true }` with a declared `[[bin]]` | R11, R4 | silence | `app/src/bin/worker/main.rs:1 -> node:jobs`, `app/src/bin/worker/main.rs:2 -> node:jobs` | F1 (two edges lost), regression |
| p41 root `pub use types::*;`, `use crate::Order;` | R18 | `src/lib.rs:1 -> node:types`, `src/lib.rs:2 -> node:api` | same | F16 (in-crate side; `src/lib.rs:3` lost is F10) |
| p42 `use crate::ensure;` for a `#[macro_export]` macro | R18 | `src/lib.rs:2 -> node:api` | same | pass |
| p43 as p42, the root text names `fn ensure` in a string and a nested fn | R18 | `src/api/mod.rs:1 -> node:root`, `src/lib.rs:1 -> node:mac`, `src/lib.rs:2 -> node:api` | same | F17 (`-> node:root` is false and closes a cycle with `src/lib.rs:2`) |
| p44 `use crate::billing::{self, Invoice as Inv};`, `use super::orders as o;` | R12 | five expected edges | same | pass |
| p45 own crate name `my_app` from a binary module | R1 | three expected edges | same | pass |
| p46 `crate::Opts` from a module of `src/main.rs`, lib.rs also has `Opts` | R2, R12 | `src/cli/mod.rs:1 -> node:root`, `src/main.rs:1 -> node:cli` | same | F4 (should be node:bin) |
| p47 nested fixture package with its own Cargo.toml | R17 | `src/lib.rs:1 -> node:config` | same | pass |
| p48 2015 `extern crate kit;`, `use kit::Engine;` in a submodule | R8 | three expected edges | same | pass |
| p49 2015 root `pub use error::Error;`, `use Error;` in a submodule | R8 | five expected edges | `src/lib.rs:1 -> node:error`, `src/lib.rs:2 -> node:api` | pass (fixed since 1.0) |
| p50 path dependency whose root is `pub use types::*;` | R18 | `kit/src/lib.rs:1 -> node:types` | same | F16 (`app/src/lib.rs:1` lost, the only edge between the crates) |
| p51 `edition = { workspace = true }`, root `pub use tokio;`, `use tokio::spawn;` in a submodule | R11, R9 | `app/src/jobs/mod.rs:1 -> node:root`, `app/src/lib.rs:2 -> node:jobs` | `app/src/lib.rs:2 -> node:jobs` | F1 (false edge closing a cycle), regression |
| p52 `[lib] path = "lib.rs"` at the package root | R1 | three expected edges | `parser/mod.rs:1 -> node:root` instead of node:lexer | pass (fixed since 1.0) |
| p53 children of a `#[path]`-loaded file | R13 | silence | same | F19 |
| p54 `crate::Result` in modules of `src/main.rs` and of `src/lib.rs` | R2, R12 | `src/cmd/mod.rs:1 -> node:root`, `src/lib.rs:1 -> node:store`, `src/main.rs:1 -> node:cmd`, `src/store/mod.rs:1 -> node:root` | same | F4 (`src/cmd/mod.rs:1` should be node:bin) |

Totals: 53 probes, 23 pass (4 of them fixed since 1.0.0: p07, p35, p49, p52), 30 support the 19 findings below. The raw output of both runs is in section 5.

## 3. Findings

Severity follows the brief: high is a false edge that can force a cycle, or a lost edge on a common layout; medium is a false or lost edge on a real but less common layout; low is a rare one.

| ID | Finding | Probes | Severity | Status |
|---|---|---|---|---|
| rust-1-edinline | `edition = { workspace = true }` reads as edition 2015 | p10, p40, p51 | high | regression |
| rust-1-libsubdr | a `[lib]` path in a subdirectory of `src/` keeps `src/` as the library's module root | p01, p02 | high | pre-existing |
| rust-1-libfirst | a module of `src/main.rs` binds a `crate::` item to `src/lib.rs` when both roots declare the name | p46, p54 | medium | pre-existing |
| rust-1-binpthsr | a `[[bin]]` whose path lies in `src/` is no root for the `src/` modules it declares | p06 | medium | pre-existing |
| rust-1-bincommn | a module directory under `src/bin/` without `main.rs` becomes its own crate tree | p05, p19 | medium | pre-existing |
| rust-1-patchsec | `[patch]` path replacements are not read | p30, p31 | medium | pre-existing |
| rust-1-derivenm | a derive named by `#[proc_macro_derive(Name)]` is not a root item of its proc-macro crate | p38 | medium | pre-existing |
| rust-1-globroot | a path through a root glob re-export (`pub use m::*;`) stays silent, across crates too | p41, p50 | medium | pre-existing |
| rust-1-buildpth | `[package] build = "<file>"` is not read | p03, p04 | low | pre-existing |
| rust-1-dep2015s | edition 2015: a path dependency wins over the root's own module of that name | p15 | low | pre-existing |
| rust-1-externas | `extern crate a as b;` does not make `b` resolve | p16, p17 | low | pre-existing |
| rust-1-uniform1 | 2018+ uniform paths (`mod x; use x::Y;`, `use crate::m; use m::Z;`) are lost | p12, p13, p41, p50 | low | pre-existing |
| rust-1-lead2015 | 2015 `use ::m::X;` is lost | p14 | low | pre-existing |
| rust-1-pathdocc | a `#[path]` attribute followed by a doc comment is not seen | p20 | low | pre-existing |
| rust-1-cfgifmod | `mod` declarations inside `cfg_if!` are lost | p23 | low | pre-existing |
| rust-1-undeclfl | an item is bound to a same-named file that no `mod` declares, another binary included | p27, p28 | low | pre-existing |
| rust-1-textdecl | the `crate::` root-item check reads the root's whole text, strings and nested fns included | p43 | low | pre-existing |
| rust-1-benchleg | 2015 `legacy_bench_path` (`src/bench.rs`) is not modelled | p09 | low | pre-existing |
| rust-1-pathkids | children of a `#[path]`-loaded file are looked for under a directory named after it | p53 | low | pre-existing |

Counts: 2 high, 6 medium, 11 low; 1 regression (rust-1-edinline), 18 pre-existing. The claim, evidence, location and proposal for each are in `materials/rust-findings.json`.

### The three most serious

1. **rust-1-edinline (high, regression).** `parseCargoManifest` handles `[package] edition` only as a string (`resolve-path.mts:735`), so `edition = { workspace = true }` leaves `edition` undefined and `editionInherited` false. `isEdition2015` then defaults to 2015 (`resolve-path.mts:326`). The member's bare `use` paths become crate-relative. In p51, `use tokio::spawn;` in `src/jobs/mod.rs` binds the root `src/lib.rs` because the root has `pub use tokio;`, which closes a cycle with the root's `mod jobs;`. The 2015 discovery rule also turns bin discovery off, so in p40 an auto-discovered `src/bin/worker/main.rs` loses both its edges. v1.0.0 had no 2015 path rules, so it gave neither the false edge nor the lost ones.
2. **rust-1-libsubdr (high).** `rustTargetFor` gives every file under `src/` the tree `src` (`resolve-path.mts:449` skips the deepest-root search for `src/` files, `:453` returns `srcDir: 'src'`). With `[lib] path = "src/core/lib.rs"`, `crate::util::Helper` in the library's `src/core/engine/mod.rs` misses `src/core/util/mod.rs`. It falls back to the root file `src/core/lib.rs` (p01, a cycle with the root's `mod engine;`), or to the binary's `src/util/mod.rs` when `src/main.rs` declares one (p02).
3. **rust-1-libfirst (medium).** A module under `src/` gets root files `[src/lib.rs, src/main.rs]`, library first (`resolve-path.mts:453`), and `resolveFromModuleDir` binds the first root that declares the name (`rust-resolve.mts:280`). In a package with both roots, `crate::Result` or `crate::Opts` in a module that `src/main.rs` declares binds `src/lib.rs` whenever the library has the same name (p46, p54). `Result` and `Error` aliases in both roots are a common shape. Which root declares the module's first segment (`mod cli;`) can be read from the two root files.

## 4. Limits

- I ran no rustc or Cargo. Each expected outcome comes from the quoted Cargo source or the Rust Reference section named in the probe's `cites`.
- Severity rests on my judgement of how common each layout is; I measured no corpus.
- p21 is recorded as a pass: with `cfg_attr` paths the conventional file is the module on the remaining targets, so the edge is real there.

## 5. Raw output

The owned runner on 5227538, all 53 probes:

```
p01-lib-path-under-src-subdir: src/core/engine/mod.rs:1 -> node:core | src/core/engine/mod.rs:2 -> node:core | src/core/lib.rs:1 -> node:engine | src/core/lib.rs:2 -> node:util
p02-lib-path-under-src-subdir-with-main: src/core/engine/mod.rs:1 -> node:bin_util | src/core/lib.rs:1 -> node:engine | src/core/lib.rs:2 -> node:util | src/main.rs:1 -> node:bin_util
p03-custom-build-script-mod: silence
p04-custom-build-script-crate-path: src/lib.rs:1 -> node:util | tools/build.rs:2 -> node:util
p05-bin-shared-common-module: src/bin/app.rs:1 -> node:common | src/bin/app.rs:2 -> node:config
p06-bin-path-in-src-module-root-item: src/args/mod.rs:1 -> node:lib | src/cli.rs:1 -> node:args
p07-build-rs-mod-beside: build.rs:1 -> node:codegen
p08-example-subdir-module: examples/demo/main.rs:1 -> node:ui | examples/demo/main.rs:2 -> node:state | examples/demo/ui/mod.rs:1 -> node:state
p09-legacy-bench-path: silence
p10-edition-inline-workspace-table: app/src/api/client.rs:1 -> node:config | app/src/lib.rs:1 -> node:config
p11-edition-dotted-workspace-control: app/src/lib.rs:1 -> node:config
p12-edition-2018-uniform-path-local-module: src/lib.rs:1 -> node:shapes
p13-edition-2018-uniform-path-imported-module: src/api/client.rs:1 -> node:shapes | src/lib.rs:1 -> node:shapes
p14-edition-2015-leading-colons: src/lib.rs:1 -> node:shapes
p15-edition-2015-local-module-shadows-path-dep: src/api/client.rs:1 -> node:depsrc | src/lib.rs:1 -> node:localutil
p16-edition-2015-extern-crate-alias: src/lib.rs:1 -> node:dep
p17-edition-2018-extern-crate-alias-prelude: src/lib.rs:1 -> node:dep
p18-edition-2024-bare-use-external: src/lib.rs:2 -> node:shapes
p19-edition-2015-bin-crate-relative: src/bin/tool.rs:1 -> node:cli | src/bin/tool.rs:2 -> node:run
p20-path-attr-after-doc-comment: src/lib.rs:3 -> node:sys
p21-cfg-attr-path: src/lib.rs:3 -> node:sys
p22-non-mod-rs-nested-inline: src/lib.rs:1 -> node:net | src/net.rs:3 -> node:proto | src/net/proto/wire.rs:1 -> node:net
p23-mod-inside-cfg-if: silence
p24-mod-rs-and-name-rs-children: src/a/mod.rs:1 -> node:b | src/c.rs:1 -> node:d | src/lib.rs:1 -> node:a | src/lib.rs:2 -> node:c
p25-self-item-in-name-rs: silence
p26-inline-mod-super-in-fn: src/lib.rs:1 -> node:svc | src/lib.rs:2 -> node:db | src/svc/mod.rs:2 -> node:db
p27-undeclared-file-same-name: src/bin/server.rs:2 -> node:servebin
p28-undeclared-submodule-file-function: src/cmd/mod.rs:1 -> node:stale | src/lib.rs:1 -> node:util | src/lib.rs:2 -> node:cmd
p30-patch-crates-io-path: silence
p31-patch-in-workspace-root: silence
p32-target-cfg-dependency: app/src/lib.rs:1 -> node:sysdep
p33-dev-and-build-dependencies: app/build.rs:1 -> node:gen | app/tests/it.rs:1 -> node:fixtures
p34-renamed-dep-and-lib-name: app/src/lib.rs:1 -> node:db | app/src/lib.rs:2 -> node:fmt
p35-workspace-dep-renamed-in-workspace: crates/app/src/lib.rs:1 -> node:db
p36-dep-key-differs-same-table-later: app/tests/t.rs:1 -> node:core
p37-dev-dep-renamed-differently: app/tests/t.rs:1 -> node:engine | app/tests/t.rs:2 -> node:engine
p38-proc-macro-path-dep: silence
p39-nested-workspace-dep-relative-path: services/api/src/main.rs:1 -> node:util
p40-edition-inline-workspace-autobins: silence
p41-glob-reexport-root: src/lib.rs:1 -> node:types | src/lib.rs:2 -> node:api
p42-macro-export-use-crate: src/lib.rs:2 -> node:api
p43-root-declares-in-string: src/api/mod.rs:1 -> node:root | src/lib.rs:1 -> node:mac | src/lib.rs:2 -> node:api
p44-use-self-group-and-rename: src/api/mod.rs:1 -> node:billing | src/api/mod.rs:2 -> node:orders | src/lib.rs:1 -> node:billing | src/lib.rs:2 -> node:orders | src/lib.rs:3 -> node:api
p45-own-crate-name-from-bin-hyphen: src/cli/mod.rs:1 -> node:engine | src/lib.rs:1 -> node:engine | src/main.rs:1 -> node:cli
p46-bin-only-own-name-and-shared-module: src/cli/mod.rs:1 -> node:root | src/main.rs:1 -> node:cli
p47-nested-fixture-package: src/lib.rs:1 -> node:config
p48-edition-2015-extern-crate-then-use: src/api/mod.rs:1 -> node:dep | src/lib.rs:1 -> node:dep | src/lib.rs:2 -> node:api
p49-edition-2015-reexported-root-item: src/api/mod.rs:1 -> node:root | src/api/mod.rs:2 -> node:error | src/lib.rs:1 -> node:error | src/lib.rs:2 -> node:api | src/lib.rs:3 -> node:error
p50-dep-root-glob-reexport: kit/src/lib.rs:1 -> node:types
p51-inline-edition-root-reexported-crate: app/src/jobs/mod.rs:1 -> node:root | app/src/lib.rs:2 -> node:jobs
p52-lib-at-package-root: lib.rs:1 -> node:parser | lib.rs:2 -> node:lexer | parser/mod.rs:1 -> node:lexer
p53-path-loaded-file-children: silence
p54-main-module-result-alias: src/cmd/mod.rs:1 -> node:root | src/lib.rs:1 -> node:store | src/main.rs:1 -> node:cmd | src/store/mod.rs:1 -> node:root
```

The owned runner on v1.0.0; `diff` against the 5227538 run printed only these lines, every other probe printed the same:

```
6c6
< p06-bin-path-in-src-module-root-item: src/args/mod.rs:1 -> node:lib | src/cli.rs:1 -> node:args
---
> p06-bin-path-in-src-module-root-item: src/args/mod.rs:1 -> node:lib
10c10
< p10-edition-inline-workspace-table: app/src/api/client.rs:1 -> node:config | app/src/lib.rs:1 -> node:config
---
> p10-edition-inline-workspace-table: app/src/lib.rs:1 -> node:config
34c34
< p35-workspace-dep-renamed-in-workspace: crates/app/src/lib.rs:1 -> node:db
---
> p35-workspace-dep-renamed-in-workspace: silence
39c39
< p40-edition-inline-workspace-autobins: silence
---
> p40-edition-inline-workspace-autobins: app/src/bin/worker/main.rs:1 -> node:jobs | app/src/bin/worker/main.rs:2 -> node:jobs
48c48
< p49-edition-2015-reexported-root-item: src/api/mod.rs:1 -> node:root | src/api/mod.rs:2 -> node:error | src/lib.rs:1 -> node:error | src/lib.rs:2 -> node:api | src/lib.rs:3 -> node:error
---
> p49-edition-2015-reexported-root-item: src/lib.rs:1 -> node:error | src/lib.rs:2 -> node:api
50,51c50,51
< p51-inline-edition-root-reexported-crate: app/src/jobs/mod.rs:1 -> node:root | app/src/lib.rs:2 -> node:jobs
< p52-lib-at-package-root: lib.rs:1 -> node:parser | lib.rs:2 -> node:lexer | parser/mod.rs:1 -> node:lexer
---
> p51-inline-edition-root-reexported-crate: app/src/lib.rs:2 -> node:jobs
> p52-lib-at-package-root: lib.rs:1 -> node:parser | lib.rs:2 -> node:lexer | parser/mod.rs:1 -> node:root
```
