# Source: gaps of the Runes readers found by a stress test of a new tool

Reported on 2026-11-15 by the builders of a new family tool that uses the readers as they are, from a stress test of that tool across twelve languages before its first release. The test built each case as a small repository, ran the tool on it, and compared every marked line with what the tool reported; two real repositories were added (a Go one and a Python one, the Python one being sqlalchemy at 572b5982e3513aa0139134f1d80a4f6248bb6825). Of the report's findings, the ones whose cause lies in the readers and not in the tool are, as stated there:

1. A use through a bundler alias is answered `outside`. Vite `resolve.alias`, webpack `resolve.alias` and Babel `module-resolver` are not read; the specifier looks like an installed package. The same blind spot applies to `import.meta.glob`, `require.context` and `vi.mock`, which are neither read nor counted.
2. A Python package under `lib/` (a root that only configuration names, here `[tool.setuptools.packages.find] where = ["lib"]`) has all its absolute self-imports answered `outside`, while its relative imports resolve. In sqlalchemy this hides 33 lines of `lib/sqlalchemy/util/preloaded.py` (26 to 58).
3. Rust: `#[path]` modules are not read, and neither is an inline path to a path-dependency crate (`datacrate::dc()` with no `use`), though `use datacrate::dc;` is read.
4. Python: `from .m import Name` is answered unfollowed when `Name` is not a module, while the absolute `from app.m import Name` is not (347 such answers in django, 4,127 in sqlalchemy, every one relative).
5. Go: a sibling module wired only with `replace` in `go.mod` is answered `outside` although the repository holds it; with a `go.work` listing both it resolves.
6. Vue and Svelte: a `<script>` block inside an HTML comment is read; `<script src="...">` is not read.
7. A TypeScript file with lone CR line ends (old Mac style) gives line 1 for an import on line 3.

Two more findings of the same report belong to issues that already exist: the C `-I` include path with no reason (753), and the 22 seconds a 3 MB file of garbage costs in a typed folder (188). Findings 4 (an ambiguous use whose candidates are all forbidden), 5 (a waiver on the last line of a multi-line import), 9's UTF-16 file and `uses-not-read` counts, 10 (Java declaration cost) and 11 (the tool's own docs) are decisions or documentation of the tool and are not filed here.

The sender asked that each reader gap be verified on Runes at tag v1.1.0 with a minimal reproduction and filed for after 1.1.0.
