# Runes 1.2.0 — plan

The planner's read-only pass over Runes at `release/1.2.0` = `origin/main` = tag `v1.1.0` = `1f3476b`. Loop: `releases/1.2.0/.jarl`. Rulings in force: runes-1-2-0-on-runes-alone, runes-1-2-0-scope, and the carried ones (work-in-area-packages, load-limits-raised: at most two workers in Runes, confirm-the-fault-before-the-fix, cap-every-test-run-raised, one-runes-corpus-cache, ci-green-on-github-and-bounded-agents, runes-1-1-0-changelog-from-1-0-0 read for 1.2.0). 1.2.0 is a minor: an optional parameter or field may be added, edges may move, and every extractor whose output moves bumps its `rev`.

Facts that shape the plan:

- The worker brief carried from 6.2.0 (`releases/6.2.0/briefs/worker-runes.md`) points a worker at section 2 of `plans/plan-<version>.md`. This file is `plans/plan-runes-1.2.0.md`, and its packages are section 2: the 1.2.0 brief names this file.
- The goal maps light and standard to Haiku and strong to Opus, so a package is standard only where the work is mechanical and a hard check decides.
- This host has no `rustc` or `cargo`: the two Rust build tests in `test/relations/rust-cases-build.test.mjs` skip (`test/helpers/rust-fixtures.mjs` `rustToolchainVerdict`), so `npm run check` cannot fail on a Rust case that does not build (D6). It has no `go` and no `dotnet`, so the Go and .NET corpus oracles skip locally. Docker is present; the 6.2.0 reviewers ran cargo 1.99.1 from the `rust:1.99.1-slim` image.
- The local `main` ref in the Runes checkout is `de8df7a`, 505 commits behind `origin/main`. Workers cut from `release/1.2.0`, so nothing depends on it; the order to `main` at ship time starts from `origin/main`.

## 1. Scope check at 1f3476b

Every fault still holds. Three were confirmed by a probe on an extraction of `1f3476b` (754, 709, and the line of 764); the rest by reading.

| Issue | Where the fault is at 1f3476b | Stale in the issue |
|---|---|---|
| 188 | No sentence on the grammar's own parse cost: README's host section (`README.md:168-193`) has none; `CHANGELOG.md:104` speaks of walking and extracting only | Files `Runes/src/relations`: the change is `README.md`, `docs/api.md` and `CHANGELOG.md`; Where empty |
| 586 | `package.json:68` (peer), `:76`, `:81` (devDependencies) and `grammars/manifest.json` `runtime`/`cli` pin 0.27.0; `test/grammars.test.mjs:35`, `test/runtime-pins.test.mjs:39,53,57` assert it | Where names a 6.2.0 worker, no file |
| 700 | 46 ids in `DO_NOT_BUILD_YET`, `test/relations/rust-cases-build.test.mjs:23-68`; the one unparsable on purpose is `rust-module-of-unparsable-lib-root-item-edge` | — |
| 709 | Probe: the c02ae8f text declares `primaryConstructor` at line 13, 14, 13 after 0, 1, 2 filler lines; `src/relations/extractors/kotlin.mts` declarations | The text is in commit `c02ae8f`, which is on no release branch (still in the object store) |
| 736 | `corpus/manifest.json:29` hiredis `defines` lack `HIREDIS_NO_PEER_NAME_VERIFICATION`; `corpus/explained.md:26227` holds the ssl.c entry; the oracle already passes `-nostdinc` (`scripts/corpus.mjs:987`) | — |
| 737 | `src/relations/resolve-path.mts:122-131`: `holdsModulesBeside` asks `crateRootFor(by, declaresModule)?.fileIsRoot`, so a root `lib.rs` with only an inline module puts its modules under `lib/`; `CHANGELOG.md:114` lists it as a 1.1.0 limit | The issue names no file |
| 739 | `src/relations/extractors/python-resolve.mts:125-137` `explain` answers a string only, `:228-229` drops two or more matches; `php-resolve.mts:207` likewise; `CHANGELOG.md:116` | — |
| 741 | `csharp.mts:2199` emits a lone identifier of a constant pattern whatever the file declares | — |
| 743 | `csharp.mts:2187-2188` needs the pattern's parent to be the `is` test; under `is not` it is a `negated_pattern`; `CHANGELOG.md:117` | — |
| 747 | `csharp.mts:2309` drops a receiver whose first name is a declared value | — |
| 750 | `csharp.mts:2194-2203` reads an identifier, a qualified, generic or member-access name; a `tuple_expression` falls through | — |
| 752 | `package.json:45-51` `files` has no grammar bytes; `src/grammars/build.mts:128-143` `buildFromSource`; `README.md:193` states it | — |
| 753 | `resolve-path.mts:221-228` `explainMiss`; `resolver.mts:855` (no reason for a symbol hint outside C# and the JVM), `:900` | Ruby emits no use for `require` at all (`ruby.mts:103`): section 6 |
| 754 | Probe: `java.util.AbstractMap+Entry \| app.Entry` answers `absent unfollowed`; `resolver.mts:814` returns `pass` for an inherited reading whose supertype is outside, `:900` | Its "stays unfollowed" half: section 6 |
| 755 | `src/relations/extractors/typescript-resolve.mts:98-111` `explainBare` reads tsconfig `paths` and `baseUrl` only | Where `:80` is the doc comment; the code is `:82-111` |
| 756 | `typescript.mts:367-384` reads only an `import` or `require` callee | Where `:334` is `emit`; the place is `:367-384` |
| 757 | `resolve-path.mts:1165-1196` takes a manifest by name, never its text | — |
| 758 | `python-resolve.mts:254-288` `resolveRelative` has no parent fallback; `:126` `explain` answers `unfollowed` for every relative specifier | — |
| 759 | `rust.mts:463` skips a file-backed `mod` with `#[path]`; `docs/api.md:118` says "the `mod` that carries the attribute still gives no edge" | Where `:459` is the comment; the code is `:461-466` |
| 760 | `rust.mts:373-377` `emitInline` keeps `crate`/`self`/`super` only | — |
| 761 | `resolve-path.mts:1283-1300` `modulesFor` reads `go.mod` `module` and `go.work` `use` only | Where `:1258` is the go.work cache; the fix is in `modulesFor` and `go-resolve.mts` |
| 762 | `typescript.mts:474` `SCRIPT_BLOCK` regex, loop `:489-497`, no notion of `<!-- -->` | — |
| 763 | `typescript.mts:495-496` keeps the body only; attributes are read only for `lang` (`:492`) | Where `:498` → `:495` |
| 764 | Probe: an import on line 3 of a CR-only file is reported at 1; `typescript.mts:334`; 65 `Position.row` places in 13 extractor files | — |
| 765 | `src/ast/parser.mts:41` takes no option; `:138-156` `parseFile`, `:194-201` `withParsedFile`; `kotlin-recover.mts:603-605` already passes `progressCallback` and resets after a stop | — |

## 2. Packages

Twelve worker packages and the jarl's final pass. One worker, one branch, one review per package; one issue per commit, in the order given.

| # | Branch | Issues (commit order) | Wave | Tier | Rev | API page |
|---|---|---|---|---|---|---|
| P1 | `jarl/586-tree-sitter-pins` | 586 | 1 | standard | — | — |
| P5 | `jarl/743-csharp-patterns` | 743, 750, 741, 747 | 1 | strong | csharp 44→48 | — |
| P3 | `jarl/765-parse-stop` | 765, 188 (README half) | 2 | strong | — | ast: optional parameter, limits paragraph |
| P6 | `jarl/737-rust-path-modules` | 737, 759, 760 | 2 | strong | rust 26→28 | Rust paragraphs |
| P2 | `jarl/752-shipped-grammars` | 752 | 3 | strong | — | grammars section |
| P10 | `jarl/762-sfc-and-ts-calls` | 762, 763, 756 | 3 | standard | typescript 6→9 | `sfcScriptView`, unread forms |
| P7 | `jarl/758-python-go-roots` | 758, 757, 739, 761 | 4 | strong | — | file view, candidates, Go |
| P12 | `jarl/700-rust-cases-build` | 700 | 4 | strong | — | — |
| P9 | `jarl/755-bundler-alias` | 755 | 5 | strong | — | TS paragraph |
| P4 | `jarl/709-kotlin-annotation-line` | 709 | 5 | strong | kotlin 10→11 | — or a limit |
| P8 | `jarl/753-classify-reasons` | 753, 754, 736, 2, 3 | 6 | strong | — | reasons `:124-126` |
| P11 | `jarl/764-lone-cr-lines` | 764 | 6 | strong | every extractor +1 | one sentence |
| F | (jarl, on `release/1.2.0`) | final pass, 188's CHANGELOG half, 1 | after all | — | — | — |

### Waves

| Wave | Slot A | Slot B | A package starts when |
|---|---|---|---|
| 1 | P1 | P5 | now |
| 2 | P3 | P6 | P3: P1 merged. P6: D6 settled |
| 3 | P2 | P10 | P2: P1 merged and D1 ruled. P10: D3 and D4 recorded |
| 4 | P7 | P12 | P12: P6 merged |
| 5 | P9 | P4 | P9: D2 recorded |
| 6 | P8 | P11 | P11: P4, P5, P6 and P10 merged, D5 recorded |

A slot that frees takes the next package whose condition holds; P2 slides behind the others if D1 waits for the owner, since nothing but the final pass depends on it. No pair in one wave shares a source file. Every package touches `test/relations/catalogue.test.mjs` (the merger sums the deltas from 992) and most touch `test/relations/extractor-rev.test.mjs` (one line per language) and `docs/api.md` (different paragraphs); `corpus/explained.md` is appended to. After P1 merges, every worktree runs `npm ci` again (the lockfile moves). Corpus runs are one at a time on the machine, each with the shared `RUNES_CORPUS_DIR`.

### P1 · `jarl/586-tree-sitter-pins` · 586 · standard

**Files:** `package.json` (`:68`, `:76`, `:81`), `package-lock.json`, `grammars/manifest.json`, `test/grammars.test.mjs:35`, `test/runtime-pins.test.mjs:39,53,57`; `src/grammars/build.mts` only if the Windows refusal names the old wasi-sdk; `corpus/goldens/*`, `corpus/explained.md` only if an edge moves.

**Direction.** Take the newest stable version that both `web-tree-sitter` and `tree-sitter-cli` publish and that still loads the prebuilt WASM of the npm-pinned grammar packages (`tree-sitter-javascript`, `-go`, `-python` 0.25.0 and the others): a runtime that refuses their ABI forces the newest 0.27.x, said on the issue. Rebuild every source pin with `buildGrammars({ rebuild: true })`; this is the one package that adds entries to the shared cache `~/.cache/runes/grammars` and may fetch the wasi-sdk the new cli asks for (its brief says so; network needed). Record each new sha256 and the runtime's `wasmSha256`; an npm or `github-release` pin whose bytes move is a finding, not an edit. Run the whole suite: a catalogue expectation that moves is explained on the issue, never edited to pass. Then `npm run corpus -- --tier all`.

**Notes for the final pass:** `README.md:193` (0.27.0 twice), `:195` (wasi-sdk-34 for tree-sitter-cli 0.27.0: check the Windows `producers` claim against the new cli).

**Risk:** medium. A runtime change can move trees in every language, and every later package then runs on it, which is why it goes first. **Tier standard:** a pin move decided by sha256, the suite and the corpus; if any expectation or edge moves, the jarl re-raises the review as strong.

### P5 · `jarl/743-csharp-patterns` · 743, 750, 741, 747 · strong

**Files:** `src/relations/extractors/csharp.mts` (constant pattern `:2182-2205`, member access `:2302-2330`), `test/relations/extractors/csharp.test.mjs`, `csharp-name-resolution-matrix.test.mjs`, `reference/relations/csharp/*`, `test/relations/extractor-rev.test.mjs`, `catalogue.test.mjs`, rebuilt `dist/`.

- **743** (rev 45). `:2187-2188` reads a torn chain only when the constant pattern's parent is the `is` test. Climb through `negated_pattern` (and a `parenthesized_pattern` if the grammar wraps it) to the `is_pattern_expression`, then read the chain as 708 does. Cases: `||` and `&&`.
- **750** (rev 46). Under a constant pattern, read each element of a `tuple_expression`: an identifier, qualified, generic or `global::` name as a type; a member access with `emitMemberAccessType(e, true)` as `:2203` does, so `Models.Order` is the whole name and not a receiver; `_`, literals and names the file declares as values give nothing; nested tuples recurse. The switch arm `(Models.Order, _) =>` is the same node. Four cases plus a value negative.
- **741** (rev 47). At `:2199`, skip a lone identifier the file declares as a value (the test `:2309` uses: `declaredNames` and not `typeOnlyNames`); a name only a type keeps its edge.
- **747** (rev 48). At `:2309`, C#'s Color Color rule (spec §12.8.7.2): a first name declared as a value whose written type's last simple name is that name (a property, a field, a typed local or parameter; the reader at `:543` already knows `Color Color` members) is read as the type receiver. A `var` local and an implicitly typed lambda parameter, which write no type, are read as the type as rev 43 reads them in a constant pattern (section 6 on the acceptance wording).

**Corpus:** CleanArchitecture, eShop, jellyfin. **API page:** none (no shape change). **Risk:** `declaredNames` is file-wide, so 741 can drop an edge where the value lives in another member; 747's `var` reading can give a false edge where a PascalCase `var` holds another type. **Tier strong:** four grammar quirks in a 3 071-line extractor where 696, 701, 708 and 744 each needed review rounds in 6.2.0.

### P3 · `jarl/765-parse-stop` · 765, 188 (README half) · strong

**Files:** `src/ast/parser.mts` (`:38-41`, `:138-156`, `:194-201`), `test/parser-host.test.mjs`, `docs/api.md` (ast section `:128-143`, the codes line `:16`), `README.md` host section (`:168-193`), rebuilt `dist/`. This package is the one exception to "workers do not edit README prose": it writes the limits paragraph of 188 and 765 once, so the two agree.

- **765.** `parseFile` and `withParsedFile` take an optional last argument carrying a progress callback, passed as `parser.parse(content, null, { progressCallback })`. A parse the callback stops returns null: reset the parser (as `kotlin-recover.mts:603-605` does; without it the next file's parse resumes the stopped one), skip the retry at `:145-153` (a stop is no trap), and reject with an error that carries a stable code, listed at `docs/api.md:16`. Without the argument no callback is passed. Tests: a stopped parse rejects with no tree and the callback ran; after a stop the same host parses another file whole; every existing test unchanged.
- **188 and 765, the words.** One paragraph in README's host section and one in `docs/api.md`: a file that is not source code in its language parses in time that grows with its size and, on short repeated text, in memory that grows about fourfold per doubling; a consumer caps the size of the files it reads, skips binaries, and passes the callback to stop a parse past its budget. Measure again on the runtime P1 pins (`research/2026-11-15-runes-parse-memory-no-cancel/materials/parse-memory.mjs` and the 188 timing shape, each under its own cap), or state the runtime version the numbers come from. The CHANGELOG half of both is the final pass's.

**API page:** the optional parameter on two `ParserHost` methods; a named options type, if exported, is a type marked "—" (reached by a signature). **Risk:** the reset; the parameter's shape is promised for every 1.x. **Tier strong:** an API that 1.x keeps and a runtime trap.

### P6 · `jarl/737-rust-path-modules` · 737, 759, 760 · strong

**Files:** `src/relations/resolve-path.mts` (`:121-133` and the Rust deps), `src/relations/extractors/rust-resolve.mts`, `src/relations/extractors/rust.mts` (`:84-91` doc, `:373-377`, `:461-466`), `test/relations/extractors/rust*.test.mjs`, `reference/relations/rust/*`, `extractor-rev.test.mjs`, `docs/api.md:112`, `:118`, rebuilt `dist/`. Needs D6 for every red and green of a case that builds.

- **737** (resolver only, no rev). Confirm that `holdsModulesBeside` (`:122-123`) misplaces `outer/loaded.rs` when the root `lib.rs` declares no file module, then make the crate-root answer for a `[lib] path = "lib.rs"` root independent of that. The 1.1.0 known limit (`CHANGELOG.md:114`) becomes a fix in the final pass.
- **759** (rev 27). Emit, for a file-backed `mod` with `#[path]` outside inline modules, a use in a specifier form no Rust path can start with (as `use::` and `extern::` already are), which the Rust resolver binds relative to the declaring file's directory, as rustc reads it, only when the file exists and is not excluded. Inside an inline module it stays silent. `rust-mod-path-attribute-override-silence` flips: rename it `…-edge`, rewrite its Rule and Why, and leave its place in `DO_NOT_BUILD_YET` to P12.
- **760** (rev 28). Emit an inline path whose first segment is not `crate`/`self`/`super`, not `Self`, not capitalised and not a name in scope of the module (the 1.1.0 names-in-scope reading, so a local module shadows a crate of its name); the resolver binds a path dependency's root as for `use datacrate::dc;` and answers `std` and registry crates `outside`.

**Corpus:** ripgrep, zed. **Risk:** 760 adds an `outside` use for every `std::` call to a consumer's counts; names in scope must win over a dependency's name. **Tier strong:** `#[path]` semantics across the extractor and the resolver, proven only under rustc.

### P2 · `jarl/752-shipped-grammars` · 752 · strong

Under D1 (a). **Files:** `package.json` (`files`, a `prepack` that builds and verifies every pin, devDependencies for the six npm grammar packages Runes does not install yet), `src/grammars/build.mts` (a shipped tier read before the cache at `:189-193`, checked by sha256 as every source is, so `offline` succeeds with an empty cache), `scripts/build-grammars.mjs` (every pin, not `--table`, for the pack), `.github/workflows/release.yml` and `ci.yml` (all 23 built before the pack, a pack check), `test/grammars.test.mjs`, `docs/api.md` grammars section `:145-169`.

**Test:** pack, unpack into a temp folder, and run `buildGrammars` from the unpacked package with an empty `cacheDir`, `offline: true` and `resolveFrom` an empty folder: 23 pairs written, each matching the manifest. Grammar bytes still never enter git.

**Notes for the final pass:** `README.md:193`, `:195`, `:279`. **Risk:** the publish path; a `prepack` must not run on a consumer's install. **Tier strong:** it changes what the package ships and how it is published.

### P10 · `jarl/762-sfc-and-ts-calls` · 762, 763, 756 · standard

**Files:** `src/relations/extractors/typescript.mts` (`:367-384`, `:463-509`), `typescript.test.mjs`, the TypeScript and JavaScript matrices, `reference/relations/{typescript,javascript}/*`, `extractor-rev.test.mjs`, `docs/api.md` (`:41`, `:120`, and the `SfcScriptView` promise).

- **762** (rev 7). Replace the single regex pass with a scan that, outside script elements, skips `<!-- … -->`; inside a script body `<!--` stays text. A component whose only script is commented out gives no use; one beside a real block gives the real block's uses on their own lines.
- **763** (rev 8, D4 a). For a script element with `src` and an empty body, write `import "<src>";` into the view in the tag's own blanked bytes on the element's line, so every newline stays where it was; a tag spread over lines with no room gives no use and a stated limit.
- **756** (rev 9, D3 b). `vi.mock('<literal>')` emits a path use as `import()` does; `import.meta.glob` and `require.context` are listed in `docs/api.md` as unread, with a test pinning no use. `jest.mock` has the same shape: take it in the same commit or file it.

**Corpus:** the TypeScript and JavaScript repositories (skywalking-booster-ui and vitepress hold `.vue` files). **Risk:** the scan must keep every existing SFC answer (`{@html '<script>'}`, a `<script>` in a template string). **Tier standard:** three local changes in two functions, each with a red-before case; the view's wording is spelled out here.

### P7 · `jarl/758-python-go-roots` · 758, 757, 739, 761 · strong

**Files:** `python-resolve.mts` (`:122-137`, `:207-249`, `:254-288`), `resolve-path.mts` (`:1145-1196`, `:1208-1310`), `php-resolve.mts` (`:178-230`), `go-resolve.mts`, `test/relations/reference-case-runner.mjs` (`:20`, `:80-84`: a `pyproject.toml` maps to the TOML grammar and is read as a source today, a `setup.cfg` throws; make both support files), the Python, PHP and Go tests and cases, `docs/api.md` (`:70` says Python manifests are read by name only; `:122`, `:126`).

- **758.** `resolveRelative` gains the parent fallback `probeRoot` has (`:244-248`): `..data.m.x` binds `data/m.py`, `..data.x` binds `data/__init__.py`; `explain` answers `unfollowed` only when nothing binds. First, because it is the largest count (347 in django, 4 127 in sqlalchemy).
- **757.** Source roots from the keys `[tool.setuptools.packages.find] where` and `[tool.setuptools] package-dir` in `pyproject.toml`, `[options] package_dir` and `[options.packages.find] where` in `setup.cfg`, Poetry's `packages = [{ include, from }]` and Hatch's `[tool.hatch.build.targets.wheel] packages`, read through the file view by a small TOML and INI subset reader, no dependency; `setup.py` stays unread (it is code). The src/ rule and the standard-library filter (`:215-226`) stay. `docs/api.md` names the keys.
- **739.** `explain` returns the candidate files when `resolveAbsolute` saw two or more matches, and `explainPhpMiss` when two PSR-4 prefixes map the class; `resolver.mts:792` already turns that object into `ambiguous` with candidates. `docs/api.md:122`, `:126` say Python and PHP.
- **761.** `modulesFor` adds the directories a `replace <module> => <relative dir>` of the nearest `go.mod` names, when inside the repository and holding a `go.mod` that declares that module; a replace to a version or outside the repository stays `outside`.

**Corpus:** airflow, click, flask, poetry, google-cloud-python, Slim, gin. **Risk:** a root read from configuration moves edges repo-wide; the standard-library filter must apply to it. **Tier strong:** a new reader of manifest text whose misreading moves edges silently.

### P12 · `jarl/700-rust-cases-build` · 700 · strong

**Files:** `reference/relations/rust/*` (the 46 ids at `rust-cases-build.test.mjs:23-68`), that list, `test/helpers/rust-fixtures.mjs` (stubs the writer lacks: `cfg_if!`, a proc-macro crate, `[patch]`), the Rust matrix where a case is renamed.

**Direction:** each case gets what rustc needs (a crate root, the `mod` lines, the bench or test file, a stub); where that changes the expectation, the case is renamed and its Why says why (ruling rust-fixtures-build-list). Proof: both build tests run under cargo 1.99.1 (D6): no case broken, the list holding only the unparsable one. **Risk:** a fixture that builds can stop testing what it was written for; the reviewer reads each diff against the case's Rule. **Tier strong:** 46 expectation reviews.

### P9 · `jarl/755-bundler-alias` · 755 · strong

**Files:** `typescript-resolve.mts` (`:76` before `resolveBare`, `:82-111`, the config reads in `makeTsResolveDeps`), its tests, the TypeScript and JavaScript matrices and cases, `reference-case-runner.mjs` (`.babelrc` as a support file; `vite.config.ts` and `webpack.config.js` are sources there today), `docs/api.md:120`.

**Direction (D2 a).** The nearest `vite.config.{ts,js,mjs,mts,cjs}`, `webpack.config.{js,ts,cjs,mjs}`, `babel.config.{js,json,cjs,mjs}` or `.babelrc(.json)` at or above the importing file. Read Vite `resolve.alias` (an object, or `[{ find, replacement }]` with a string `find`), webpack `resolve.alias` (`name$` exact), Babel module-resolver `alias` (string keys; `^` keys unread). A replacement counts when it is a string literal (relative to the config's directory; a Vite `/src` from the project root), `path.resolve(__dirname, '<lit>')`, `path.join(__dirname, '<lit>')` or `fileURLToPath(new URL('<lit>', import.meta.url))`. The alias applies before packages, as a bundler applies it. A configuration that exists but whose alias cannot be read makes a bare specifier that names no declared dependency `unfollowed`. A token reader (strings, comments, brackets), no parser, no dependency.

**Corpus:** skywalking-booster-ui and vitepress first, then the other TypeScript and JavaScript repositories. **Risk:** a misread alias is a false edge, so the reader refuses every form not listed. **Tier strong.**

### P4 · `jarl/709-kotlin-annotation-line` · 709 · strong

**Files:** `kotlin.mts` (declarations), `kotlin-recover.mts` if the reading goes through recovery, `kotlin.test.mjs`, the Kotlin matrix and a case, `extractor-rev.test.mjs`.

**Direction** (rev 11). Rebuild the test from `git show c02ae8f`. When a top-level declaration directly follows an `annotated_expression` sibling that holds only annotations and ends where the declaration starts, the declaration's line is the annotation's, as an unsplit annotated declaration has it. If the grammar's parse cannot be worked around, the line's second option: a limit in `docs/api.md` and a test pinning the answer. **Risk:** an `annotated_expression` that is a real expression statement. **Tier strong:** recovery heuristics that earlier rounds broke.

### P8 · `jarl/753-classify-reasons` · 753, 754, 736 · strong

**Files:** `resolver.mts` (`:806-824`, `:849-870`), `resolve-path.mts:221-228`, `include-resolve.mts`, `ruby-resolve.mts`, `docs/api.md:124`, `:126`, `corpus/manifest.json:29`, `corpus/explained.md:26227`, tests and cases in C, C++, Ruby and Java.

- **753.** `explainMiss` answers for C and C++ (an angle include that binds nothing `outside`, a quoted include with no file `unfollowed`) and Ruby (a `require_relative` with no file `unfollowed`); `readingReason` (`:855`) answers for a Ruby constant and a C++ name (`unfollowed` when the repository declares its head as a type or namespace, else `outside`). `docs/api.md:124` no longer says the reason is left out. Ruby's plain `require`: section 6.
- **754.** At `:814`, an inherited reading (`+`) whose supertype lies outside the repository answers `outside` when the package declares no type of the bare name, where it now reads on.
- **2 and 3** (filed from section 7 on 2026-11-17): the Java same-name reading next to 754, and Ruby's plain `require` next to 753's Ruby half.
- **736.** Add `HIREDIS_NO_PEER_NAME_VERIFICATION` to hiredis's `c.defines`, run `npm run corpus -- --only hiredis` (it must print hiredis checked: c 50), and retire the ssl.c explanation.

**Corpus:** hiredis, leveldb, rack, javapoet, jsoup, spring-petclinic; no edge may move. **Risk:** 754 sits in the walk every C#, Java and Kotlin answer takes; the catalogue's `answers` lines are the guard. **Tier strong.**

### P11 · `jarl/764-lone-cr-lines` · 764 · strong

**Files:** a new internal module (for example `src/relations/extractors/lines.mts`) and the 65 `Position.row` places: csharp 25, rust 11, ruby 6, java 5, c 3, kotlin 3, typescript 3, go 2, php 2, python 2, cpp 1, c-cpp-shared 1, kotlin-recover 1 (and its `lineStarts`, `kotlin-recover.mts:610-614`, which counts LF only); `extractor-rev.test.mjs` (all eleven); one case per language; one sentence in `docs/api.md`.

**Direction (D5 a).** `lineOf(file, node)`: for content with no lone CR, `row + 1`, so every existing file answers as before by construction; otherwise the line counted by LF, CRLF and lone CR up to the node's start (check on the runtime whether `startIndex` counts UTF-16 code units). U+2028 stays no line break. **Risk:** a place that counts lines from a padded span (Kotlin recovery, C# offsets) needs its own case. **Tier strong:** every extractor and every `rev`.

## 3. Order constraints

- **586 before 752.** 752 ships the bytes 586 builds; its test pins their sha256. Shipping first would ship bytes 586 then replaces.
- **586 before 765 and 188.** Their numbers describe the runtime that ships.
- **586 early.** A runtime change can move trees anywhere; landing it first lets every later package show its red and green on the shipped runtime, and the merger's suite after each merge catches a tree it moved.
- **188 with 765.** One paragraph by one author (P3), so the time limit and the memory limit agree; their CHANGELOG lines go together under "Known limits" in the final pass.
- **737 before 759, 759 before 700.** 737 places the files a `#[path]` loads; 759 then gives the declaring `mod` its use and flips a case 700 would otherwise rewrite twice. 760 is independent and last in P6.
- **C#: 743, 750, 741, 747.** 743 and 750 widen the constant-pattern reading; 741 then narrows its lone-identifier branch; 747 changes the member-access reading at `:2309`, which the pattern branch bypasses through `readAsType` (`:2203`), so its cases run with the pattern forms already settled. Four `rev` bumps in one branch; no other package touches `csharp.mts` before P11.
- **P10 before P11; P4, P5, P6 before P11.** P11 edits every extractor file.
- **758 before 757.** 757's cases import absolutely and lean on 758's `explain`.
- **753 with 739.** Both rewrite `docs/api.md:122-126`; they are in different waves, and the later one edits on top.
- **P7 and P8** edit different functions of `resolve-path.mts`, in different waves.
- **The two TS packages** (P10, P9) touch different files and the same matrices; P9 follows so its alias cases see the final view.

## 4. Decisions

| # | Issue | Question | Options and what each costs | Recommendation | Whose |
|---|---|---|---|---|---|
| D1 | 752 | How the 23 pinned grammars reach a consumer | **(a)** Ship all 23 built grammars in `@chrisdudek/runes`: today's 16 built grammars gzip to 2.1 MB (25 MB unpacked), against a package of 0.46 MB in 162 files; no network and no toolchain for a consumer, Windows works; the bytes are built in the release workflow and checked against the manifest's sha256 before the pack, so the trust stays the manifest's; six more npm grammar devDependencies and the three release downloads at publish time; never in git. **(b)** A companion package with the bytes: the main package stays small; a second package, a second trusted publisher on npm to set up, a version lockstep check, one more dependency for each consumer. **(c)** Assets of each Runes GitHub release, fetched by `buildGrammars`: no size cost; network to github.com at every cold build (CI, containers), 46 uploads per release, an air-gapped consumer still builds. **(d)** Keep the build and document it: no work; the 940 MB toolchain and the Windows copy stay | (a): the smallest machinery for the whole gap, and the sha256 check makes it no weaker than today | Owner: what the package ships and how a consumer installs it |
| D2 | 755 | A bare specifier in a repository with a bundler configuration | **(a)** Read the alias from the listed literal forms (P9), and answer `unfollowed` where a configuration exists but its alias cannot be read: edges for the common forms (the create-vue `@` → `./src` idiom included), a token reader and per-bundler cases to keep, a false edge where a form is misread. **(b)** `unfollowed` only: no reader, no false edge; no layer check either, and a Vue app with hundreds of `@/` imports reports hundreds of unfollowed uses, the noise 758 complains of. **(c)** Read literals without the fallback: an unreadable alias stays `outside`, the false green the issue is about | (a) | Jarl: how a resolver reads a configuration |
| D3 | 756 | `import.meta.glob`, `require.context`, `vi.mock` | **(a)** Read all three: a glob names a set of files, and a path use binds at most one file (`resolver.mts:782-786`), so it needs a new hint form or a use per matched file at resolution, which every consumer's edge walk must learn, plus Vite's glob syntax, `eager`, negations and webpack's regex filter. **(b)** Read `vi.mock` (one literal path, a use like `import()`); list the two globs as unread with a test. **(c)** List all three as unread | (b), and a new issue for the set form when a consumer asks for it; the acceptance line changes (section 6) | Jarl |
| D4 | 763 | `<script src>` in Vue and Svelte | **(a)** Read it: the view writes the `src` as an import in the tag's own bytes; Vue's SFC spec defines `src` imports and svelte-preprocess reads them (Svelte's compiler alone does not); it binds only a file that exists; the documented promise of `sfcScriptView` gains one clause, and both consumers parse the view as they do today. **(b)** List it as unread | (a) | Jarl |
| D5 | 764 | Where lone-CR lines are fixed | **(a)** A shared line helper in all eleven extractors (P11): reaches every consumer, 65 places, every `rev`, last in the order. **(b)** Turn each lone CR into LF in the parser host before parsing (one place, same offsets): Grain parses with its own parser and keeps LF-only lines, and trees change with no change of `grammarDigest`. **(c)** TypeScript only, the other ten named in `docs/api.md` as counting LF only | (a) | Jarl |
| D6 | 700, 737, 759, 760 | How a worker and a reviewer run the Rust build tests here | **(a)** cargo and rustc 1.99.1 from the `rust:1.99.1-slim` image, through a wrapper on PATH that runs the test's `cargo` in the container with its temporary folder mounted at the same path: no change to the host, as 6.2.0's reviewers did. **(b)** The owner adds rustup 1.99.1 to this machine through WorkspaceSetup. **(c)** CI on GitHub only, which needs D7 and turns every red-before into a push | (a), with CI as the gate of record; (b) if (a) does not run | Jarl for (a); the owner for (b) |
| D7 | 1 | Pushing `release/1.2.0` before the candidate | CI must be green on the exact tagged commit (ci-green-on-github-and-bounded-agents); it is the only place where the Rust build tests and the Go and .NET corpus oracles run with `--strict`, and its corpus job runs only on `release/*` pushes (`ci.yml:155`). **(a)** A standing permission to push `release/1.2.0`, no tag and no publish, as runes-push-branch gave for 1.1.0. **(b)** One push by the owner at the candidate. **(c)** No push before the tag: CI first runs on the tag | (a) | Owner |

## 5. The final pass (the jarl, on `release/1.2.0`, after the last merge)

1. **Version.** `package.json` `version`, `package-lock.json:3` and `:9`, `src/version.mts` `RUNES_VERSION`, `npm run build` for `dist/version.mjs`; all `1.2.0`, in one commit with the CHANGELOG.
2. **CHANGELOG `## [1.2.0] - <date>`**, written from the issues' changelog entries against the published 1.1.0, as a user of 1.1.0 meets it, with no line for a fault introduced and fixed inside 1.2.0's own work. Intro paragraph; **Before you upgrade:** new edges (C# patterns and Color Color receivers, Rust `#[path]` modules and calls into path dependencies, Python roots from configuration and relative members, Go `replace`, bundler aliases, `vi.mock`, Vue `<script src>`), edges that go away (a commented-out SFC script, `o is Config` with `Config` a value), the runtime pin (consumers move `web-tree-sitter` to the new pin, or `checkRuntimePins` fails), lines that move in CR-only files, stored results stale by the new `rev`s; **Added to the API** (the parse stop; shipped grammars under D1 a); the language sections, where the 1.1.0 known limits 737, 739 and 743 (`CHANGELOG.md:114`, `:116`, `:117`) read as fixes; **Known limits** (188 and 765, the unread glob forms, any limit a package names).
3. **Counts and prose.** `README.md:7` status line (1.2.0, a minor release after 1.1.0) and its catalogue count, `README.md:201`, `CLAUDE.md:9`; the paragraphs the workers noted (`README.md:193`, `:195`, `:279`).
4. **Checks on the clean tree:** `nice -n 15 npm run check`, `nice -n 15 npm run coverage` (98% lines, 92% branches, 97% functions), the Rust build tests under cargo 1.99.1 (D6) with both running, and `npm pack --dry-run` listing what D1 says.
5. **The corpus gate before the candidate.** `npm run corpus -- --tier all` under its cap with the shared `RUNES_CORPUS_DIR`: every repository's edges equal its golden or are explained, every oracle that ran agrees or is explained, hiredis prints checked: c 50 with no ssl.c entry, and no explanation matches nothing. Locally the Go and .NET oracles skip and the run says it is not a full oracle run, so the gate of record is CI's corpus job with `--strict` on the pushed `release/1.2.0` (D7): the routine tier on the push and the heavy tier through a dispatch with tier `all`, both on the commit to be tagged.
6. Then issue 1's shipping checklist; the push, the tag and the publish are the owner's word.

## 6. Acceptance lines to change, and risks

| Issue | Problem | Proposed line or method |
|---|---|---|
| 700, 737, 759, 760 | "builds under rustc … by: npm run check": here both build tests skip, so the method passes whatever the cases do | `by: npm run check; node --test test/relations/rust-cases-build.test.mjs with rustc and cargo 1.99.1 on PATH (D6), both build tests run, none skipped` |
| 754, line 1 | "the same name declared in the package stays unfollowed": at 1f3476b the use resolves to that type (probe: `app/Entry.java`) | "…; where the package also declares a type of that name, the answer stays what it is at v1.1.0, and every existing answer and edge stays as it is" |
| 754, line 2 | The method lacks its two arguments | `by: node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/java-inherited-nested-type.mjs <the worktree, built, with .grammars/> <google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, fetched into scratch>` |
| 753, Ruby | "a gem or standard library require gives reason outside": the Ruby reader emits no use for `require` (`ruby.mts:103`); the research probe built that hint by hand | "In Ruby, a `require_relative` with no file gives unfollowed, a constant the repository declares nothing of (`JSON`) gives outside, a constant under a namespace the repository declares that binds no file gives unfollowed; a plain `require` stays unread and docs/api.md says so" |
| 756 | All three read, or all three unread; D3 reads one | "`vi.mock` with a literal path gives a use of that file, in a unit test and a catalogue case, red at v1.1.0 (no use) and green after; `import.meta.glob` and `require.context` are listed in docs/api.md as unread and a test pins the empty answer" |
| 747 | "a value named Status whose type is not Status still gives no edge" cannot hold for a `var` local, whose type is not written | "…whose written type is not Status still gives no edge" |
| 765, line 1 | 64 KiB of `a<a,` parses to about 6 GiB uncancelled (1.5 GiB at 32 KiB, fourfold per doubling): the red run, and any regression of the test inside the suite or on CI, can be killed by the kernel | "…on `a<a,` repeated to 16 KiB, stopped at the first call: the call rejects without a tree, and a later parse on the same host gives the whole tree of its own file" |
| 765, line 2 | "the same tree as at v1.1.0 on every catalogue case": no v1.1.0 tree is stored, so `npm run check` cannot compare | "without the option, no progress callback reaches the runtime (a test over a stub runtime), and the catalogue and every existing test pass unchanged" |
| 752, line 2 | "no toolchain on the machine": a test in a checkout cannot remove it | method: pack, unpack into a temp folder, `buildGrammars` from it with an empty `cacheDir`, `offline: true` and `resolveFrom` an empty folder |
| 188 | Its CHANGELOG half is not a worker's to write | closes after the final pass; Files: `README.md`, `docs/api.md`, `CHANGELOG.md` |

**Risks.**

- **New refusals for consumers.** Most packages add edges; a consumer's graph that passed on 1.1.0 can show new refusals. Each issue's changelog entry says so; the final pass gathers them.
- **753, C.** A quoted include of a third-party header the repository does not hold (`#include "openssl/ssl.h"`) reads `unfollowed` under the line as written. The worker states the rule in `docs/api.md`; if the corpus (hiredis, leveldb) shows such includes, it is a ruling, not a quiet narrowing.
- **The runtime pin** moves the peer dependency; Yggdrasil's adoption stays with 586 of the 6.2.0 loop.
- **Load.** Two workers and one corpus run at a time; P1's `--tier all` and P11's run over every language are the long ones.

## 7. Findings to file

- Java: where the package declares a type of the same name, a bare nested name inherited from a library supertype resolves to the package's type (probe: `Entry` in `class Tree extends AbstractMap` binds `app/Entry.java`), while Java binds the inherited member type (JLS §8.5, §6.4.1). Runes cannot see a library's members, so this is a known limit or a false edge to weigh.
- Ruby: a plain `require 'x'` gives no use at all (`ruby.mts:103`), so an in-repository `require 'app/models/user'` on the load path has no edge. A gap of its own if the 753 line keeps it unread (section 6).
- TypeScript: `jest.mock` has `vi.mock`'s shape (P10 takes it or files it).
