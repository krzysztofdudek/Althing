# Triage

Every run is on Runes v1.1.0 at 1f3476b0e49f982a0d7615acfdd29d279fe3c53a (tag v1.1.0, tree clean, dist/ as committed, grammars from `.grammars/`). Paths are `Runes/<path>:<line>` at that commit. Each case is a minimal repository in a folder from `mktemp -d`; the commands are `bash research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0/materials/repros.sh <Runes checkout>`, which prints one line per use as `file:line`, the candidates and the `classifyUse` answer, and removes each folder after. A listed file view of the whole folder stands for the repository.

## 1. A bundler alias is answered outside

Verdict: gap. Runes reads tsconfig and jsconfig `paths`, `baseUrl`, package `exports` and `imports`; it reads no bundler configuration, so the specifier is taken for an installed package.

- `alias_vite` (a `vite.config.ts` with `resolve.alias` for `@` and `~data`, and `src/data/d.ts`): `@/data/d` and `~data/d` each printed `{"kind":"absent","reason":"outside"}`; `../data/d` in the same file printed resolved to `src/data/d.ts`.
- `alias_webpack` (`webpack.config.js` `resolve.alias`): `require("data-alias/d")` printed outside. `alias_babel` (`.babelrc` with `module-resolver`): `@d/d` printed outside.
- `alias_tsconfig` (the same `@/*` as a tsconfig `paths` entry): `@/data/d` printed resolved to `src/data/d.ts`.
- Cause: `explainTsMiss` (`Runes/src/relations/extractors/typescript-resolve.mts:80`) answers `outside` for a bare specifier that matches no workspace package and no `paths` pattern. Nothing tells it the repository has a bundler configuration that may define an alias.
- Effect: a consumer that stays quiet about `outside` reports nothing for every use through the alias, with no sign that a reader did not look.

## 2. import.meta.glob, require.context and vi.mock are not read

Verdict: gap. No document of Runes lists them as unread.

- `glob_forms` (`const m = import.meta.glob("../data/*.ts");`, `const c = require.context("../data", false, /\.ts$/);`, `vi.mock("../data/d");` in `src/ui/g.ts`): the run printed no use for the file at all.
- Cause: the TypeScript extractor emits the forms it knows (`import`, `export from`, `require`, dynamic `import`, `import x = require`, `new URL`, import types); a call of `import.meta.glob`, `require.context` or `vi.mock` is none of them (`Runes/src/relations/extractors/typescript.mts:334` is where a recognised form is emitted).

## 3. A Python package under a root that only configuration names loses its absolute self-imports

Verdict: gap. `makePythonProjectRoots` takes a project's source root to be its `src/` child or the folder of the manifest, and `docs/api.md` says the text of `pyproject.toml`, `setup.cfg` and `setup.py` is not read, only their names.

- `py_lib` (`pyproject.toml` with `[tool.setuptools.packages.find] where = ["lib"]`, a package `pkg` under `lib/` with `ui` and `data`, and `lib/pkg/ui/a.py` holding `from pkg.data.d import x`, `from ..data.d import x as y` and `import pkg.data.d`): lines 1 and 3 printed `{"kind":"absent","reason":"outside"}`; line 2 printed resolved to `lib/pkg/data/d.py`.
- `py_src` (the same tree under `src/`, the manifest holding only the name): lines 1, 2 and 3 each printed resolved to `src/pkg/data/d.py`.
- The report's real case is sqlalchemy at 572b5982e3513aa0139134f1d80a4f6248bb6825: 33 absolute imports in `lib/sqlalchemy/util/preloaded.py` (lines 26 to 58) of other layers answered outside; the reporter's independent `ast` checker finds them, and the same package's relative imports match it exactly. Not re-measured here.
- Cause: `Runes/src/relations/resolve-path.mts:1145-1199` (`makePythonProjectRoots`) and the absolute resolver `Runes/src/relations/extractors/python-resolve.mts:207-232`; `pkg` is held by no root, so `explain` (`python-resolve.mts:125-136`) says `outside`.
- Effect: for the most common way to write a Python import, a package in `lib/`, `python/` or `backend/` is read as if its own name were an installed package.

## 4. A relative from-import of a member is unfollowed, the absolute one resolves

Verdict: defect of the answer. The two spellings name the same file and the readers answer differently.

- `py_relative_vs_absolute` (`src/pkg/ui/a.py` over `src/pkg/data/__init__.py` and `m.py`): `from ..data.m import x` printed, for the member, `..data.m.x` as `{"kind":"absent","reason":"unfollowed"}`; `from pkg.data.m import x` printed `pkg.data.m.x` as resolved to `src/pkg/data/m.py`. The same for a package: `from ..data import x` printed `..data.x` unfollowed and `from pkg.data import x` printed `pkg.data.x` resolved to `src/pkg/data/__init__.py`.
- Cause: `resolveAbsolute` falls back to the parent path when the last segment is a member (`Runes/src/relations/extractors/python-resolve.mts:207-232`, `parentPath`); `resolveRelative` (`python-resolve.mts:254`) has no such fallback, and `explain` answers `unfollowed` for every relative specifier (`python-resolve.mts:126`).
- Effect: the reporter counted 347 such answers in django and 4,127 in sqlalchemy, every one relative, against a handful of real gaps; the count stops being a signal.

## 5. Rust: a mod with a #[path] attribute emits no use

Verdict: gap, by design today. The extractor skips the declaration so as not to bind the wrong file ("silence over a guess"), while the attribute's string names the file.

- `rust_path` (a Cargo package `app` with `src/ui/mod.rs` holding `#[path = "../data/orphan.rs"] pub mod via_attr;` and `src/ui/f.rs` holding `#[path = "../data/d.rs"] mod dd;`): the run printed `self::f` for `pub mod f;` on line 1 of `mod.rs` and nothing for `via_attr` or `dd`.
- Cause: `Runes/src/relations/extractors/rust.mts:459-466` (`modHasPathOverride`) and the comment at `rust.mts:88-91`. Since 1.1.0 `declarations()` records the files a path attribute loads (`pathmod:`), so the file side is known; the use of the declaring file is still not emitted.

## 6. Rust: an inline path to a path-dependency crate emits no use

Verdict: gap, by design today. `emitInline` keeps only paths that start at `crate`, `self` or `super`.

- `rust_dep` (`datacrate = { path = "datacrate" }` in `Cargo.toml`): `use datacrate::dc;` in `src/u.rs` printed resolved to `datacrate/src/lib.rs`; `pub fn k() { datacrate::dc(); }` in `src/k.rs` printed nothing. The same shape written `crate::data::d::f()` is read (`rust_path`, `src/ui/f.rs:2`).
- Cause: `Runes/src/relations/extractors/rust.mts:372-376` (`emitInline`).

## 7. Go: a sibling module wired only with replace is answered outside

Verdict: gap. `go.mod` `replace` is not read; sibling modules are known only through a `go.work` `use` list.

- `go_replace` (`ui/go.mod` requiring `example.com/data` with `replace example.com/data => ../data`, and `data/go.mod` declaring that module): `import "example.com/data"` in `ui/a.go` printed `{"kind":"absent","reason":"outside"}`.
- `go_work` (the same tree plus a `go.work` with `use ./ui` and `use ./data`): the same import printed resolved to `data/d.go`.
- Cause: `Runes/src/relations/resolve-path.mts:1258-1316` (the go.work members and the nearest go.mod); no line reads `replace`.

## 8. A commented-out script block of a Vue or Svelte file is read

Verdict: defect.

- `vue_script` (`src/ui/v.vue` holding `<template><b/></template>` and `<!-- <script>import { d } from "../data/d"</script> -->`): the run printed `src/ui/v.vue:2 ../data/d` resolved to `src/data/d.ts`, the same as for the real script block of `ok.vue`.
- Cause: `SCRIPT_BLOCK`, a regular expression over the raw text (`Runes/src/relations/extractors/typescript.mts:474`, used at `typescript.mts:488-495`), has no notion of an HTML comment.

## 9. A script element with src is not read

Verdict: gap.

- `vue_script` (`src/ui/s.vue` holding `<script src="../data/d.ts"></script>`): the run printed no use for the file.
- Cause: the same `sfcScriptView` keeps only the bytes between the tags; an empty body gives no use, and the `src` attribute is never read (`Runes/src/relations/extractors/typescript.mts:498-526`).

## 10. A TypeScript file with lone CR line ends reports line 1

Verdict: defect.

- `cr_lines` (`src/a.ts` made of `const a = 1;`, `const b = 2;` and `import { d } from "../data/d";`, each ended by a lone CR): the run printed `src/a.ts:1`; the import is on line 3. CRLF, a BOM and U+2028 were reported fine by the reporter.
- Cause: lines are `node.startPosition.row + 1` (`Runes/src/relations/extractors/typescript.mts:334`, and 63 more such places in the extractors); tree-sitter counts rows by LF only. Measured in TypeScript only.

## Not filed here

- The C `-I` include path with no reason is 753; the cost of a large unparseable file is 188 (which says garbage parses at 13 to 16 seconds a megabyte); the two get this folder as a further source.
- An ambiguous use whose candidates are all forbidden, a waiver on the last line of a multi-line import, the NUL byte rule that leaves a UTF-16 file untyped, the count of `uses-not-read`, the cost of declaring every Java file on each run and the tool's own documentation lines are decisions or text of the tool, not of the readers.
