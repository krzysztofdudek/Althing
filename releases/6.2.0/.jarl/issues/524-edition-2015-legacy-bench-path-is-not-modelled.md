# 524 · Edition 2015 legacy_bench_path is not modelled

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-axkb
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-benchleg
**Where:** src/relations/resolve-path.mts:262
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
Claim: In edition 2015 Cargo roots a [[bench]] named bench with no path at src/bench.rs when no benches/bench.rs exists. Runes models the legacy paths of binaries only, so src/bench.rs is read as a module of the library and its `mod x;` is looked for under src/bench/.

p09: silence; Rust gives src/bench.rs:1 -> node:helpers (src/helpers/mod.rs). Cargo targets.rs normalize_benches, legacy_bench_path. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015, a [[bench]] named bench that gives no path is rooted at src/bench.rs when benches/bench.rs does not exist and src/bench.rs does (Cargo targets.rs, normalize_benches, legacy_bench_path), so its mod helpers; binds src/helpers/mod.rs, with the audit's probe p09 as a catalogue case (src/bench.rs:1 -> helpers), red before and green after · by: npm run check
- [test] From edition 2018, or when benches/bench.rs exists, src/bench.rs stays a module of the library, with a case · by: npm run check

## Changelog
- In edition 2015, a `[[bench]]` named `bench` without a `path` is rooted at `src/bench.rs` when `benches/bench.rs` is missing, as Cargo does, so its `mod helpers;` binds the module beside it.

## Reviews
- **changes** · by rev-509-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1129-zikf
  Important (509, src/relations/resolve-path.mts:440 topLevelModules, used at :296 and :322): in a package with src/lib.rs and src/main.rs a module loses every crate:: root-item edge to the library when the root declares it in a way the text reader does not see, where the base bound the library correctly. Reproduced on the built tool against the base: mod unix; inside a cfg_if! block; mod late; after a function holding the char literal '{' ; mod late; after a raw string holding a quote and a brace; #[path = "imp/thing.rs"] mod thing; and a mod written by a macro_rules! expansion. Each gave src/lib.rs before and nothing after. The brace counter treats a char literal and a raw string as code, and a module at brace depth above zero as undeclared. No test covers these; a case for each is needed, and the choice of what a root that cannot be read means (keep the old binding, or silence) belongs in the fix. Important (511, src/relations/extractors/rust-resolve.mts:191): for a src/bin directory that two binaries declare, every path with super is dropped, also one that stays inside the directory (super::y::T from src/bin/common/x.rs names src/bin/common/y.rs in either binary). The base gave that edge, the branch gives none; two binaries sharing a common directory is an ordinary layout, and acceptance line 2 asks silence only for crate:: paths. Minor (512, src/relations/resolve-path.mts:414 and :427, known limitations to state in the changelog): the patched crate's version is not compared with the requirement, so a patch Cargo leaves unused still gives an edge; workspace exclude and package.workspace are not read, so an excluded nested package takes the upper root's patch (a false edge) and its own patch or a root named by package.workspace is ignored; :626 does not lowercase a github URL as Cargo does. Judged sound: the four changed unit tests are true updates (each old fixture asked a root item of a module no root declared, and each keeps its intent with the declaration added); the p04 case lists the library's own mod edge and still proves no edge leaves tools/build.rs; a module both roots declare gives no root item while module paths still bind, as line 3 and the changelog say; legacy_bench_path, infer_subdirectory, target_path and normalize_build were read at Cargo tag 0.88.0 and the code follows them; source matching of [patch] held for a git dependency against a crates-io patch, an alternative registry, target and dev dependencies, the table form, and renames on either side. Not checked: the heavy corpus tier (zed), the go and dotnet oracles (toolchains absent), and the per-commit red of each test commit (the branch's tests were instead run over the base code: 22 fail there, the named cases among them).
- **changes** · by rev-509b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1150-vlka
  Important (509, src/relations/resolve-path.mts:1071 readRustRootModules, its result at :1091, used at :300): a root the reader cannot read still gives silence where the base bound the library, in four shapes reproduced on the built tool against the base (package with src/lib.rs and src/main.rs, crate::Opts asked from the module): the modules are written by a macro whose definition is not in the root file (#[macro_use] mod macros; decl_mods!(a, b);), by include!("mods.rs"), or by a macro 2.0 definition (macro decl($n:ident) { mod $n; }); and the root does not parse, with a bracket left open before mod a; (fn broken() { ... mod a; or fn f( { } mod a;). Each gave src/lib.rs on the base and nothing on the branch. The opaque mark is set only for a path attribute and a macro_rules! body in the same file; brackets still open at the end of the file, a top-level include!, and a top-level invocation of a macro the file does not define are not treated as unreadable. Important (509, src/relations/resolve-path.mts:300): the opaque mark is read only when no root declares the module, so a new false edge appears: lib.rs with #[path = "imp/thing.rs"] mod thing; and main.rs with mod imp; binds crate::Opts in src/imp/thing.rs to src/main.rs, where the base gave src/lib.rs, which is what Rust compiles. Minor (509, src/relations/resolve-path.mts:1028): a C raw string is not read as one token, because the raw check is skipped after the letter c: const C: &CStr = cr#"a " {"#; before mod a; loses the edge the base had. Minor (509, src/relations/resolve-path.mts:1005 rustCodeOnly): a shebang first line is read as code, so #!/usr/bin/env -S sh -c with a quoted brace before mod a; loses the edge. Minor (509, reference/relations/rust/rust-module-after-raw-string-brace-of-lib-root-item-edge.md): this case passes over the code of 942eb41, so it was never red and does not prove the raw string fix; the worker reported five red cases, four were. Its string holds an even number of quotes, which the old reader happened to survive; an odd number makes it fail there. Minor (509, changelog): the entry does not say that a root with a path attribute or a macro that writes a mod leaves the module to the first root, nor what the reader does not see. Held under attack on the built tool: nested block comments, byte chars and byte strings, plain C strings, raw identifiers (fn r#match, mod r#async), lifetimes and loop labels beside char literals, astral characters, escaped quotes and line continuations in strings, attributes and doc attributes on a mod, pub(in path) mod, mod with a comment or a newline before its name end, cfg_if! written with a path, a user macro with braces or square brackets, macro invocations with nested braces before the mod, a mod inside a const block, a function or an impl (not declared), CRLF, a byte order mark, a stray closing bracket, macro_rules! written with parentheses. 511: in a directory two binaries declare, super:: one or two levels up inside the directory and self::super:: keep their edge, a climb to the root of the tree and crate:: give none; the case and the unit test fail over the code of 942eb41. 512: the limits are in the changelog. Outside the issue nothing moved: the two fix commits touch only the two source files, their dist and tests; no test was weakened; the catalogue count is 720; the built dist equals the committed one. Not checked: the heavy corpus tier (zed), the go and dotnet oracles (toolchains absent), the dist step of npm run check as the script runs it (the extracted copy is no git repository; the output was compared by hand).

## Evidence

### Proof

- **ran (line 319a52e87326):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at 725f2ae (rust-edition-2015-legacy-bench-path-edge, p09, failed: got none) and green after cbc0ebd
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; rust-edition-2015-bench-file-exists-src-bench-module-edge and rust-edition-2018-src-bench-module-edge pass at cbc0ebd, and the unit test covers the two-files and other-name forms
- **ran (line 319a52e87326):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-edition-2015-legacy-bench-path-edge fails
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; the two guard cases pass, before and after
- **ran (line 319a52e87326):** nice -n 15 npm run check (tip e4bcb4c, under a 12G cap) · **saw:** 2179 tests, 2178 pass, 0 fail, 1 skipped, dist/ is fresh; p09 case green
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip e4bcb4c, under a 12G cap) · **saw:** 2179 tests, 2178 pass, 0 fail, 1 skipped, dist/ is fresh; the file-exists and edition-2018 cases green
- **ran (line 319a52e87326):** nice -n 15 npm run check (tip e4bcb4c, extracted with git archive, under a 12G cap); the branch's Rust tests also run over the code of 942eb41 · **saw:** 2179 tests, 2178 pass, 0 fail, 1 skipped; the built dist/ is the same as the committed one (compared by hand, the dist step needs a git repository); the legacy bench path case green
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip e4bcb4c, extracted with git archive, under a 12G cap); the branch's Rust tests also run over the code of 942eb41 · **saw:** 2179 tests, 2178 pass, 0 fail, 1 skipped; the built dist/ is the same as the committed one (compared by hand, the dist step needs a git repository); the two guard cases green

### Notes

Assumed: Cargo's legacy bench path is applied when benches/bench.rs and benches/bench/main.rs are not exactly one existing file, as the bin rule does, and only for edition 2015 and a bench named bench with no path.

