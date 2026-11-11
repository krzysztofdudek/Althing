# 512 · [patch] path replacements are not read

**Status:** in-progress
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
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
Claim: A [patch.<registry>] entry with a path replaces the registry crate for the whole workspace, so the dependency is in the repository. Runes reads no [patch] table and leaves the dependency external.

p30 ([patch.crates-io] in the package's own manifest) and p31 (in a virtual workspace root): silence for `use kit::Engine;`; Cargo builds vendor/kit, so the edge is app -> node:vendored. The Cargo Book, Overriding dependencies, The [patch] section. Same at v1.0.0.

## Why


## Acceptance
- [test] A [patch.<registry>] entry with a path, in the workspace root manifest or in the manifest of a package that is its own workspace, replaces the dependency of that name for every package of the workspace, so a use of it binds the patched path's library (The Cargo Book, Overriding dependencies, The [patch] section), with the audit's probes p30 and p31 as catalogue cases (-> vendored), red before and green after · by: npm run check
- [test] A patch entry that renames with package = is matched by the dependency's package name, and its path is relative to the manifest that writes the [patch], with a case · by: npm run check
- [test] A [patch] in a member manifest that is not the workspace root is ignored, as Cargo ignores it, a dependency with its own path keeps that path, and a patch entry without a path leaves the dependency external, with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- A `[patch.crates-io]`, `[patch.<registry>]` or `[patch."<git url>"]` entry with a `path`, in the workspace root manifest or the manifest of a package that is its own workspace, replaces the dependency of that package name for every package of the workspace, so `use kit::Engine;` binds the patched library. The path is relative to the manifest that writes the `[patch]`, `package =` renames are matched, and a `[patch]` in a member manifest is ignored, as Cargo ignores it. A graph can show new edges for such repositories.

## Reviews
- **changes** · by rev-509-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1129-zikf
  Important (509, src/relations/resolve-path.mts:440 topLevelModules, used at :296 and :322): in a package with src/lib.rs and src/main.rs a module loses every crate:: root-item edge to the library when the root declares it in a way the text reader does not see, where the base bound the library correctly. Reproduced on the built tool against the base: mod unix; inside a cfg_if! block; mod late; after a function holding the char literal '{' ; mod late; after a raw string holding a quote and a brace; #[path = "imp/thing.rs"] mod thing; and a mod written by a macro_rules! expansion. Each gave src/lib.rs before and nothing after. The brace counter treats a char literal and a raw string as code, and a module at brace depth above zero as undeclared. No test covers these; a case for each is needed, and the choice of what a root that cannot be read means (keep the old binding, or silence) belongs in the fix. Important (511, src/relations/extractors/rust-resolve.mts:191): for a src/bin directory that two binaries declare, every path with super is dropped, also one that stays inside the directory (super::y::T from src/bin/common/x.rs names src/bin/common/y.rs in either binary). The base gave that edge, the branch gives none; two binaries sharing a common directory is an ordinary layout, and acceptance line 2 asks silence only for crate:: paths. Minor (512, src/relations/resolve-path.mts:414 and :427, known limitations to state in the changelog): the patched crate's version is not compared with the requirement, so a patch Cargo leaves unused still gives an edge; workspace exclude and package.workspace are not read, so an excluded nested package takes the upper root's patch (a false edge) and its own patch or a root named by package.workspace is ignored; :626 does not lowercase a github URL as Cargo does. Judged sound: the four changed unit tests are true updates (each old fixture asked a root item of a module no root declared, and each keeps its intent with the declaration added); the p04 case lists the library's own mod edge and still proves no edge leaves tools/build.rs; a module both roots declare gives no root item while module paths still bind, as line 3 and the changelog say; legacy_bench_path, infer_subdirectory, target_path and normalize_build were read at Cargo tag 0.88.0 and the code follows them; source matching of [patch] held for a git dependency against a crates-io patch, an alternative registry, target and dev dependencies, the table form, and renames on either side. Not checked: the heavy corpus tier (zed), the go and dotnet oracles (toolchains absent), and the per-commit red of each test commit (the branch's tests were instead run over the base code: 22 fail there, the named cases among them).

## Evidence

### Proof

- **ran (line 004b38e94169):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at 4352c12 (rust-patch-crates-io-path-edge, p30, and rust-patch-workspace-root-edge, p31, failed) and green after 942eb41
- **ran (line d7ad438e09d8):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at 4352c12 (rust-patch-renamed-package-relative-path-edge failed: got none) and green after 942eb41; it has a decoy at crates/app/vendor/kit that the member-relative path would take
- **ran (line a36d4441f209):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; rust-patch-member-manifest-ignored-silence, rust-patch-own-path-dependency-kept-edge and rust-patch-without-path-silence pass at 942eb41 (they pass before the change as well, as guards against over-patching)
- **ran (line d0bad6f909cb):** nice -n 15 npm run corpus (tip 942eb41, under a 12G cap) · **saw:** corpus gate: passed; every repository 0 added, 0 removed, 0 explained (ripgrep 372 edges, cargo oracle 12 checked, 0 disagreements); the heavy zed run (--tier heavy --only zed) also passed with 0 added, 0 removed, cargo oracle 269 checked
- **ran (line 004b38e94169):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-patch-crates-io-path-edge and rust-patch-workspace-root-edge fail
- **ran (line d7ad438e09d8):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-patch-renamed-package-relative-path-edge fails
- **ran (line a36d4441f209):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; the three guard cases pass, before and after
- **ran (line d0bad6f909cb):** nice -n 15 npm run corpus -- --cache <a fresh scratch folder> (tip 942eb41, under a 12G cap) · **saw:** corpus gate: passed; every repository 0 added, 0 removed (ripgrep 372 edges, cargo oracle 12 checked, 0 disagreements); 3 oracle runs skipped for a missing toolchain (go twice, dotnet), none of them Rust; the heavy tier (zed) was not re-run

### Notes

Assumed: a patch table replaces only dependencies of the source it names, so the dependency's git or registry key is now read: [patch.crates-io] (or the index URL) takes dependencies with neither key, [patch.<name>] those with registry = "<name>", [patch."<url>"] those with git = "<url>" (a trailing slash or .git ignored). The parsed dependency spec therefore gains git and registry fields, and two expectations of one existing parse test now list the git field. A workspace root is the nearest manifest at or above the package with a [workspace] table, else the package itself; membership lists are not checked.

