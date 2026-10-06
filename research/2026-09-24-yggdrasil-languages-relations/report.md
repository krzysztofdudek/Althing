# Yggdrasil 6.1.0: language grammars and relation coverage

## 1. Verdict

No supported grammar has a newer stable release on npm. All 16 grammar packages and web-tree-sitter 0.27.0 are at npm `latest`. There is also no ABI problem: the runtime accepts ABI 13–15, and all 16 shipped wasms load. "Latest on npm" still overstates how fresh they are:

- **GitHub-only releases:** tree-sitter-rust 0.24.2, tree-sitter-c 0.24.2 and tree-sitter-yaml 0.7.2 are tagged releases that never reached npm. The build pipeline can only take wasms from npm tarballs, so it cannot pick them up.
- **Stale grammars:**
  - tree-sitter-typescript has been frozen since Nov 2024, is built on JS 0.23, and silently misparses `using`.
  - The Kotlin fork Yggdrasil ships has been dormant since Jan 2025. It turns Kotlin 2.2+ syntax into a rest-of-file ERROR, and that is a real relation blocker.
  - C# 14, C++20/23 modules, PHP 8.4 and the Ruby heredoc crash fix exist only on upstream master.

On relations, every form in the palette behaves as catalogued. Outside the palette, though, the checks found:

- **False or wrong edges.** The "zero false positives" invariant breaks in several reproducible places: the Kotlin ambiguity flip, the Python ancestor-module shadow, three Ruby reopening and lexical-lookup cases, Rust inline `mod tests { use super::* }`, C# `global using` across projects, TS type-position `import()`, and C/C++ `#if (0)` / `__has_include`.
- **Structural recall holes.** Recall is missing in exactly the layouts real monorepos use: Java multi-module, grouped Rust `use crate::{…}`, C# generic bases and partial classes, TS `paths` and workspaces, Python src-layout and workspaces, PHP with several composer.json files, and C/C++ `-I` roots.

The palette does not catalogue any of these shapes, so a green 1:1 matrix proves nothing about them. Consolidated result: **5 blockers, 22 majors, 34 minors**.

## 2. Grammar freshness

Column notes: "Pinned" is the package.json range. "Installed" is the lock and host version; the dev container differs only for web-tree-sitter (see m3). "Latest stable" is npm `latest`. ABI is from `Language.abiVersion` on 0.27.0.

| Package | Pinned | Installed | Latest stable (npm) | Newer upstream | ABI | Risk | Recommendation |
|---|---|---|---|---|---|---|---|
| web-tree-sitter | ^0.27.0 | 0.27.0 (container: 0.26.12) | 0.27.0 | none | runtime 13–15 | low | Keep. Resync the container with `npm ci` (m3). |
| tree-sitter-c | ^0.24.1 | 0.24.1 | 0.24.1 | GitHub release v0.24.2 (2026-04-22, ABI 15, same node types) | 15 | low | Take v0.24.2 through a GitHub-asset pipeline (M19). `#embed` in an initializer and `_BitInt` still error. |
| tree-sitter-c-sharp | ^0.23.5 | 0.23.5 | 0.23.5 | master 9150f7d: C# 14 (#429, 2026-06-02), #430 cast fix; unreleased | 15 | medium | Plan as its own migration. The extension-block parse changes shape (m2). |
| tree-sitter-cpp | ^0.23.4 | 0.23.4 (2024-11-11) | 0.23.4 | master: modules, deducing this, lambda specifiers, reflection (feat!), ABI 15; 41 commits unreleased (issues #341/#365 open) | 14 | high (AST) | Build from a pinned master commit (M22). The trial passes. |
| tree-sitter-go | ^0.25.0 | 0.25.0 | 0.25.0 | none (HEAD 2025-09-15, CI only) | 15 | medium | No fix exists. Go 1.26 `new(expr)` and 1.27 generic methods ERROR. Document, patch or upstream (M21). |
| tree-sitter-java | ^0.23.5 | 0.23.5 (2024-12-21) | 0.23.5 | none (CI and license commits only) | 14 | low | Keep. Java 25 flexible constructor bodies ERROR locally (m8). |
| tree-sitter-javascript | ^0.25.0 | 0.25.0 | 0.25.0 | none | 15 | low | Keep. `export … with {}` ERRORs (m16). |
| tree-sitter-json | ^0.24.8 | 0.24.8 | 0.24.8 | master fixes `1e+5` (2026-08-17) | 14 | low | Take at the next release (m8). |
| tree-sitter-php | ^0.24.2 | 0.24.2 (2025-08-18) | 0.24.2 | master: ABI 15 regeneration (feat!, Array aliasing), asymmetric visibility in promotion, heredoc UB fix 8b7d0627 | 15 | low–medium | Source-build with cpp. The trial passes (m8). |
| tree-sitter-python | ^0.25.0 | 0.25.0 | 0.25.0 | master 26855ea `feat!`: `expression_statement` becomes a supertype | 15 | medium (breaking queued) | Keep. Do not accept the next minor bump without review (m5). PEP 696 defaults error even on master (m9). |
| tree-sitter-ruby | ^0.23.1 | 0.23.1 (2024-11-11) | 0.23.1 | master ad907a69: heredoc serialization overflow fix (2026-03-10) | 14 | medium | Source-build ≥ ad907a69 (m1). Ruby 4.0 leading `&&`/`\|\|` continuation misparses (m10). |
| tree-sitter-rust | ^0.24.0 | 0.24.0 | 0.24.0 | GitHub releases v0.24.1 and v0.24.2 (2026-03-27, ABI 15, edition-2024 `unsafe extern`) | 14 | medium | Take v0.24.2 now (M19). The trial shows zero regressions. |
| tree-sitter-typescript (+tsx) | ^0.23.2 | 0.23.2 (2024-11-10) | 0.23.2 | none. HEAD 2025-01-30 has only LICENSE/FUNDING commits. Fixes sit in open PRs #357 (JS 0.25), #358/#360, #364, #365 | 14 | high | Vendor a regenerated grammar against JS 0.25 with those PRs applied (M20). |
| @tree-sitter-grammars/tree-sitter-kotlin | ^1.1.0 | 1.1.0 (2025-01-09) | 1.1.0 | fork dormant (guard PR #15 open). fwcd/tree-sitter-kotlin main has guards and `$$` strings, but npm `tree-sitter-kotlin` is 0.3.8, it has different node types, and context parameters still error | 14 | **blocker** | Extractor fallback now (B1), then decide which fork to follow (m6). |
| @tree-sitter-grammars/tree-sitter-toml | ^0.7.0 | 0.7.0 | 0.7.0 | none. TOML 1.1.0 spec is tagged; multi-line inline tables, `\e`, `07:32` ERROR | 14 | low | Document (m8). |
| @tree-sitter-grammars/tree-sitter-yaml | ^0.7.1 | 0.7.1 | 0.7.1 | GitHub release v0.7.2 (2025-10-07) | 14 | low | Take v0.7.2 via GitHub asset (M19). |

The Kotlin row is the only one where current language syntax causes a relation blocker. The npm ABI-14 prebuilds (10 wasm files) carry the web-tree-sitter 0.27.0 README warning about the older dynamic-linking format. They all load today (m7).

**Trial-upgrade result:**

| Setup | Result |
|---|---|
| Clean `npm ci` scratch on web-tree-sitter 0.27.0 | 1357/1357 relation, AST and structure tests pass. `rootNode.toString()` hashes for 1884 real files (32 containing errors) are identical under 0.26.12 and 0.27.0. |
| GitHub-release wasms swapped in (c v0.24.2, rust v0.24.2, yaml v0.7.2) | 1357/1357 pass. node-types.json unchanged for all three. Rust goes from ABI 14 to 15. Zero regressions. |
| C#, C++ and PHP master built with tree-sitter-cli 0.27.0 | C# master: 1368 pass / 4 fail. The failures are `csharp-extension-receiver-type` plus 3 Kotlin probe cases (B1), which also fail on the shipped Kotlin grammar. C++ and PHP master: all tests pass. |
| fwcd Kotlin HEAD | 37 of 230 Kotlin matrix and AST tests fail because the node types differ. It is not a drop-in fix. |

## 3. Per-language coverage matrix

Legend:
- **covered**: produces the edge or silence the palette documents.
- **covered†**: works live but no palette case pins it.
- **silenced (design)**: a documented deliberate silence.
- **missing**: a real dependency with no edge.
- **wrong**: a false or wrong-target edge.
- **grammar**: the form parses as ERROR but relations survive; AST rules only.

### TypeScript / JavaScript

| Form | Status |
|---|---|
| default, named, namespace, side-effect import; default+named; mixed inline-type | covered |
| named, star and namespace re-export; `require`; `import = require`; `export = require`; literal dynamic `import()` | covered |
| .ts/.tsx/.js probing, NodeNext `.js`→`.ts`, directory `index.*`, same-name sibling trap | covered |
| `import defer` (via ERROR), .mts→.mjs, .cts `require('.cjs')`, JSX in .js, template dynamic import, explicit `.ts` extension | covered† |
| `import type`, all-inline `type`, `export type {}`, `export type *` | silenced (design, undocumented in docs: m13) |
| `typeof import('x')`, `let v: import('x').T`, `import type X = require('x')` | wrong: emits edges, contradicting the type-only policy (M8) |
| tsconfig `paths` / `baseUrl` | missing (M10) |
| npm/pnpm/yarn workspace package `@scope/pkg` | missing (M11) |
| in-repo package.json `main` / `exports` / `#imports`; `index.mjs` / `index.cjs` | missing (m14) |
| Vite root-absolute `/src/…`, `?raw`, `new URL('…', import.meta.url)`, `import.meta.glob` | missing; the `/` join can give a wrong node (m15) |
| `export {…} from … with {…}` | missing, grammar drops the statement (m16) |
| imports in .vue/.svelte SFCs; `.json` targets | missing (m17) |
| static import after `for (await using …)` | missing, grammar swallows it (m11) |
| .tsx `import('x').T<U>` annotation followed by a static import | missing, grammar swallows it (m12) |
| `using` in .ts | grammar: silently misparsed as an assignment (M20) |

### Python

| Form | Status |
|---|---|
| `import a.b`, alias, multi; `from a import b` (with submodule candidate); relative sibling and parent; star | covered |
| conditional, function-local and `TYPE_CHECKING` imports; PEP 420 namespace submodules; re-export via `__init__` | covered |
| `__future__`, importlib, namespace-package object, stdlib/external, relative escape, `__all__` | silenced (design) |
| stdlib or third-party name shadowed by a module in an ancestor package dir (`logging.py`, `celery.py`) | **wrong** (M1) |
| src-layout `tests/` → `src/`; uv/Poetry workspace member → member | missing (M12) |
| one import resolving to the same file twice | duplicate report lines (m18) |
| 3.15 `lazy import` | grammar; edge survives |
| PEP 696 type-parameter defaults | grammar (m9) |

### Ruby

| Form | Status |
|---|---|
| `require_relative`, top-level superclass, include/extend/prepend, qualified values and receivers, rooted `::X`, compact class, assignment RHS, pattern-match constants | covered |
| plain `require`, `const_get`, `autoload`, reopening ambiguity, compact reopened external | silenced (design) |
| unrooted `A::B` inside a namespace | **wrong**: bound as absolute, ignores `Module.nesting` (M2) |
| nested reopening `module ActiveRecord; class Base` | **wrong**: `< ActiveRecord::Base` binds to the initializer (M3) |
| core_ext reopening `class String` | **wrong**: every top-level `String` binds to it (M4) |
| bare constant in a class or method body; bare superclass inside a module | silenced (design) (m19) |
| Zeitwerk implicit namespace (`class Billing::Invoice` with no `module Billing`) | silenced (design) (m20) |
| `.rake`, `Rakefile`, `Gemfile`, `.gemspec`, `config.ru` | missing: owned but never parsed (m21) |
| heredoc delimiter ≥256 chars | crash that poisons the cached parser for every Ruby file (m1) |
| Ruby 4.0 leading `&&`/`\|\|` continuation | grammar (m10) |

### Go

| Form | Status |
|---|---|
| single, grouped, raw-string, aliased, blank and dot imports | covered |
| stdlib, external, `go.work`, `replace`, unmapped package, intra-package | silenced (design) |
| generics, cgo `import "C"`, `internal/`, `/vN` module path, split-package owner-set silence, nested-submodule re-rooting | covered† |
| go.work member → member; nested module → parent module | silenced (design) (m24) |
| quoted `module "…"` in go.mod | missing (m25) |
| Go 1.26 `new(expr)`, Go 1.27 generic methods | grammar; methods also drop out of `declarations()` (M21) |

### Rust

| Form | Status |
|---|---|
| `use crate::…`, alias, grouped with leaf items only, glob, `pub use`, file-backed `mod foo;`, inline `crate::`/`self::`/`super::` paths | covered |
| bare-root inline path, external crate, `#[path]`, inline mod body, macro token trees | silenced (design) |
| `use crate::{a::X, b::Y}` | **missing**: no edge at all (B2) |
| `use crate::p::{a::X, b::Y}`, `use super::{a::X, …}` | **wrong**: binds the prefix module's node (B2) |
| `mod tests { use super::*; }` at depth ≥2 | **wrong**: false edge to the parent module's node (M5) |
| crate-root items (`crate::Error` defined in lib.rs) | missing (M13) |
| `crate::` from `src/bin/*.rs` | wrong node (M9) |
| `mod x;` in bin/tests/examples targets | missing (M9) |
| Cargo workspace path dependency `use core_lib::…` | silenced (design, uncatalogued) (m22) |
| raw identifiers `mod r#gen;` | missing (m23) |
| edition-2024 `unsafe extern` | grammar (M19) |

### Java

| Form | Status |
|---|---|
| single-type, static and wildcard imports (with one-owner collapse); inline FQN; `import module` silence | covered (single source root) |
| import across Maven/Gradle module roots; `src/test` → `src/main` | **missing** (B3) |
| Java → Kotlin class or `…Kt` facade | missing (M14) |
| Java 25 flexible constructor prologue | grammar, local; edges survive (m8) |

### Kotlin

| Form | Status |
|---|---|
| import, alias, `@file:JvmName` facade and the rest of the 45 catalogued cases | covered |
| wildcard `import p.*` | silenced (design) (m26) |
| declarations after a when-guard, `context(…)` or `$$"…"` in the declaring file | **missing**; can also flip an ambiguity into a **wrong** edge (B1) |
| expect/actual; top-level overloads spread across files in one node | missing (B4) |
| local `val`/`fun`/class inside a function | indexed as top-level, which **silences** real imports (M15) |
| Kotlin → Java class | missing (M14) |
| same-package use across nodes, no import | silent, uncatalogued (m28) |

### C#

| Form | Status |
|---|---|
| `using`, alias, `global using`, qualified names, type positions, extension-block receiver | covered (the extension receiver only via misparse: m2) |
| `global using` from another .csproj | **wrong** edge (M6) |
| `global using X = …` defined in two projects | **wrong** target, last writer wins (M7) |
| partial class across files; `Result` and `Result<T>` in separate files | missing (B4) |
| generic base or container `Repository<T>`, `IHandler<,>` | **missing** (B5) |
| static member or enum access `Guard.NotNull()`, `OrderStatus.Paid` | missing (M16) |
| composition-root `using Infra;` + `AddInfrastructure()` | silenced (design, wrong rationale) (m27) |
| `.csproj <Using Include>` | missing (M6) |
| C# 14 `a?.B = new X()` right-hand side | missing, grammar (m2) |

### PHP

| Form | Status |
|---|---|
| `use`, group use, leading-backslash FQN, PSR-4, PHP 8.1–8.5 inline forms (hooks, pipe, enums, anonymous class) | covered |
| composer.json in several packages, or a root map shadowed by a package map | missing (M18) |
| `require_once __DIR__ . '/…'` | missing, uncatalogued (m30) |
| namespace-relative or alias-qualified names (`Model\Id`) | silenced (design) (m32) |
| PSR-4 empty prefix `""`; PSR-0 | missing (m34) |
| PHP 8.4 `private(set)` in promotion; 8.5 clone-with, `(void)` | grammar; edges survive (m8) |

### C / C++

| Form | Status |
|---|---|
| quoted include relative to the includer; `#if 0` dead branch; angle system include silence; include in a global module fragment of a .cpp | covered |
| `-I`/compile_commands.json roots, root-relative (Google style), in-repo angle include | silenced (design; not caveated in user docs) (M17) |
| `.cppm`, `.ixx`, `.mpp`, `.ipp`, `.inl`, `.tpp` sources | missing: never parsed (m29) |
| header-unit `import "x.hpp"` | silenced (grammar) (M22) |
| `#if (0)`, `#if false`, `__has_include` + `#elif 0` | **wrong** edge from a dead branch (m33) |
| backslash include path | missing (m35) |
| C++ header named `.h` | parsed with the C grammar; AST only, relations survive (m31) |
| C++20/23 modules, deducing this, `if consteval` | grammar (M22) |

## 4. Findings

| Id | Severity | Language | Title | Where | Suggested fix |
|---|---|---|---|---|---|
| B1 | blocker | kotlin | A when-guard, `context(…)` or `$$"…"` string turns the rest of the file into one ERROR node. Later declarations vanish, their imports get no edge, and a KMP-style ambiguity can flip into a wrong edge | kotlin grammar 1.1.0; kotlin.ts `declarations()`; palette kotlin-context-parameter-type-silent | Add an ERROR-tolerant declaration rescan, or mark the file "declarations incomplete" and fail closed on anything that binds into or disambiguates through it. Add a hasError diagnostic. Then change grammars (m6). |
| B2 | blocker | rust | Grouped `use crate::{a::X, b::Y}` emits nothing, and nested-path groups bind to the prefix node | rust.ts `scoped_use_list`; rust-resolve.ts empty-tail branch | Recurse per list item with the accumulated prefix. Emit the prefix only for bare leaves or `self`. |
| B3 | blocker | java | Imports never resolve across Maven/Gradle module roots or from `src/test` to `src/main` | java-resolve.ts:86-133 | Fall back to the Java SymbolTable, or probe every discovered source root. |
| B4 | blocker | csharp, kotlin | Ambiguity counts files, not owner nodes, so partial classes, `Result`/`Result<T>`, expect/actual and split overloads are silenced | resolver.ts:181 | Collapse the files to owners and stay ambiguous only for 2+ owners. Optionally key C# declarations by arity. |
| B5 | blocker | csharp | The base name of a `generic_name` is skipped, so `Repository<T>`, `IHandler<,>` and `Result<T>` never produce an edge | csharp.ts `emitTypeNode` case `generic_name` | Emit the base identifier as its own candidate group and let external containers fail to silence. |
| M1 | major | python | Stdlib or third-party import binds to a same-named module in an ancestor package dir (false edge) | python-resolve.ts:99-120 | Probe only non-package ancestor dirs (sys.path-like roots). |
| M2 | major | ruby | Unrooted `A::B` inside a namespace is treated as absolute (wrong node) | ruby.ts:65-73, :222 | Only `::`-rooted refs are complete. Otherwise build `Module.nesting` candidates. |
| M3 | major | ruby | Nested reopening of a gem namespace anchors the root (false edge on `ApplicationRecord`) | resolver.ts:128-132; ruby.ts `declarations()` | A reopening is not a definition. Require path corroboration. |
| M4 | major | ruby | core_ext `class String` makes every top-level `String` a false edge | ruby.ts:222 + declarations | Never bind core or stdlib constants to in-repo reopenings. |
| M5 | major | rust | `super`/`self` inside an inline `mod tests` resolves from the file (false edge) | rust.ts `uses()`; rust-resolve.ts `resolveRelative` | Track inline-module depth and consume `super` accordingly. |
| M6 | major | csharp | `global using` is aggregated repo-wide and leaks across .csproj files (false edge); `<Using Include>` is ignored | pass.ts:560-570 | Scope to the nearest .csproj and parse its `<Using>` items. |
| M7 | major | csharp | Global aliases are last-wins across projects (wrong target) | pass.ts:562,567 | Scope per .csproj. Treat conflicting targets as ambiguous and silence. |
| M8 | major | typescript | Type-only policy is inconsistent: type-position `import()` and `import type = require()` emit edges | typescript.ts:173-181, :224-238 | Apply one policy everywhere (see m13). |
| M9 | major | rust | `src/bin`, `tests`, `examples` and `benches` roots are resolved as lib modules (wrong node, missed `mod`) | resolve-path.ts `crateRootFor`; rust-resolve.ts:106-109 | Treat Cargo target roots as mod-rs-like with their own `crate::` root. |
| M10 | major | typescript | tsconfig `paths`/`baseUrl` are always silenced | typescript.ts `isRelative`; typescript-resolve.ts | Read tsconfig (with `extends`), apply TS mapping, silence when 2+ targets match. |
| M11 | major | typescript | In-repo workspace packages are silenced as bare specifiers | typescript.ts; resolve-path.ts TS branch | Index in-repo package.json names and resolve via `exports`/`main`. |
| M12 | major | python | src-layout tests and uv/Poetry workspace members are missed | python-resolve.ts:99 | Discover source roots repo-wide (pyproject, `src/`, workspace members). |
| M13 | major | rust | Items defined in lib.rs/main.rs are unreachable | rust-resolve.ts `resolveFromModuleDir` | Fall back to `src/lib.rs`, then `src/main.rs`. |
| M14 | major | kotlin, java | Kotlin↔Java imports never resolve | symbol-table.ts:2-4; java-resolve.ts:100 | Share one JVM namespace, including `…Kt` facades. |
| M15 | major | kotlin | Function-local declarations are published as top-level keys and silence real imports | kotlin.ts:171-212 | Skip declarations with a function, lambda or accessor ancestor. |
| M16 | major | csharp | Static member or enum access through a type name is never detected | csharp.ts main walk | Emit the leftmost identifier of `member_access_expression` unless it is shadowed by a local or member. |
| M17 | major | c, cpp | `-I`, compile DB and root-relative includes never resolve; user docs list C/C++ without a caveat | include-resolve.ts:49-52; c-cpp-shared.ts:40 | Read compile_commands.json when present. Otherwise document the limit. |
| M18 | major | php | The nearest composer.json shadows every other one, so cross-package `use` is missed | resolve-path.ts:394-416 | Repo-wide PSR-4 union with the exactly-one-hit rule. |
| M19 | major | rust (+c, yaml) | The pipeline cannot ship GitHub-only grammar releases; rust 0.24.0 misparses edition-2024 `unsafe extern` | tsup.config.ts `findFile()` | Allow a pinned GitHub asset (URL + sha256) or a source build. Take rust/c/yaml now. |
| M20 | major | typescript | TS grammar frozen at 0.23.2: `using` silently misparsed; `export type *`, `import defer`, `in out`, `static accessor` ERROR | tree-sitter-typescript 0.23.2 | Vendor a build against JS 0.25 with upstream PRs applied. Add a canary. |
| M21 | major | go | Go 1.26 `new(expr)` and 1.27 generic methods ERROR; no upstream fix | tree-sitter-go 0.25.0 | Patch the grammar or document the limit. File upstream. |
| M22 | major | cpp | tree-sitter-cpp 0.23.4 is ~2 years stale: modules and C++23 ERROR; header-unit `import "x.hpp"` is unresolvable | tree-sitter-cpp 0.23.4 | Build from a pinned master commit and route header-unit imports through the include resolver. |
| m1 | minor | ruby | Heredoc delimiter ≥256 chars traps the scanner; the cached parser is poisoned and every Ruby file fails with a wrong "reinstall" fix | ruby scanner.c; parser.ts:38; pass.ts:334-346 | Evict and retry on throw, report per file, take ad907a69. |
| m2 | minor | csharp | C# 14 is unsupported: the extension-block edge rests on a misparse (drops on master), and the `?.` assignment RHS is lost | csharp.ts:669; c-sharp 0.23.5 | Handle `extension_declaration > receiver_parameter` now. Bump as its own migration. |
| m3 | minor | all | Dev container node_modules drift from the lock (web-tree-sitter 0.26.12, vitest 4) | container /workspaces/.../node_modules | `npm ci` after lock changes, plus an `npm ls` preflight. |
| m4 | minor | all | Deterministic verdicts are not keyed on grammar bytes; facts key omits the runtime version | pair-hash.ts:55-57, :270-276; pass.ts:417 | Fold the per-language wasm hash into `DetHashInput`. |
| m5 | minor | all | Breaking 0.x grammar bumps arrive in grouped "minor" dependabot PRs | .github/dependabot.yml | Ungroup grammars and add node-types.json snapshot tests. |
| m6 | minor | kotlin | Kotlin grammar source is split: the shipped fork is dormant, the active fwcd grammar is unpublished with different node types | package.json; fwcd/tree-sitter-kotlin | Decide which fork to follow, build from a pinned commit, port kotlin.ts (37 failing cases as the checklist). |
| m7 | minor | all | Registry pin fields are empty, `externalScanner: false` is wrong on 10 grammars, 10 wasms are old ABI-14 prebuilds | language-registry.ts:22; tsup.config.ts | Implement the pin or delete the fields. Add a load smoke test on the newest runtime. |
| m8 | minor | java, php, toml, json | Smaller parse gaps: Java 25 constructor prologue, PHP 8.4 `private(set)` and 8.5 syntax, TOML 1.1, JSON `1e+5` | respective grammars | Document per language. Take master fixes when released or source-built. |
| m9 | minor | python | PEP 696 type-parameter defaults ERROR (also on master) | tree-sitter-python grammar.js `type_parameter` | Document; propose upstream. |
| m10 | minor | ruby | Ruby 4.0 leading logical-operator continuation misparses | tree-sitter-ruby 0.23.1 | Track upstream; add a fixture. |
| m11 | minor | typescript | `for (await using …)` swallows a following static import or re-export | ts/tsx grammar | Grammar vendoring (M20); add a palette trap. |
| m12 | minor | typescript | .tsx `import('x').T<U>` annotation swallows the next static import | tsx grammar (upstream PR #365) | Grammar vendoring; add a palette trap. |
| m13 | minor | typescript | Type-only imports never produce an edge (documented in the palette, not in the docs) | typescript.ts:9-16; docs/relations-flows-ports.md | Decide the policy (edge or distinct kind) and document it. |
| m14 | minor | typescript | In-repo package.json `main`/`exports`/`imports` and `index.mjs`/`.cjs` are ignored | typescript-resolve.ts:42-71 | Share the implementation with M11. |
| m15 | minor | typescript | Root-absolute `/src/…` joined to the importer dir (can give a wrong node); `?raw` and `new URL()` missed | typescript-resolve.ts:29 | Resolve against the package root; strip query and hash suffixes. |
| m16 | minor | typescript | `export … from … with {…}` disappears in every JS/TS grammar | ts/tsx/js grammars | Add a pinning case; grammar vendoring. |
| m17 | minor | typescript | Vue/Svelte SFC imports and `.json` targets are invisible | language-registry.ts; typescript-resolve.ts | Extract `<script>` blocks; resolve explicit non-source targets. |
| m18 | minor | python | Duplicate violation lines per from-import | python.ts:95-101 | Dedupe on (file, line, owner). |
| m19 | minor | ruby | Bare constants inside class or method bodies are always silenced (Rails recall) | ruby.ts:172, :202, :222 | Lexical candidate resolution. |
| m20 | minor | ruby | Zeitwerk implicit namespaces are treated as unanchored | resolver.ts:128-132 | Anchor by autoload-dir inflection. |
| m21 | minor | ruby | `.rake`, `Rakefile`, `Gemfile`, `.gemspec`, `config.ru` are never parsed | language-registry.ts:157-160 | Map them to Ruby or declare them out of scope. |
| m22 | minor | rust | Cargo workspace path dependencies are always silent, and no palette case exists | rust-resolve.ts; resolve-path.ts | Build a crate-name → dir map from in-repo `path =` deps. |
| m23 | minor | rust | `r#` raw identifiers probe `r#gen.rs` | rust.ts:81, :93, :261 | Strip `r#` per segment. |
| m24 | minor | go | go.work members and nested → parent module imports are silent | resolve-path.ts `modulePathFor`; go-resolve.ts | Index every in-repo go.mod and use the longest-prefix match. |
| m25 | minor | go | Quoted `module "…"` disables resolution | resolve-path.ts:259 | Unquote and handle the block form. |
| m26 | minor | kotlin | Kotlin wildcard imports never produce an edge (Java collapses to one owner) | kotlin.ts:44-51 | One-owner collapse mirroring Java. |
| m27 | minor | csharp | Composition-root extension call is silenced; the palette rationale ("dynamic dispatch") is factually wrong | csharp-di-reflection-extension-silence | Fix the wording; optional `using N;` one-owner edge. |
| m28 | minor | all | Palette coverage gaps: no `javascript` or `c/` segment; common forms uncatalogued (TS-12, go/rust, php/c/cpp, KT-05) | reference/relations/* | See section 6. |
| m29 | minor | cpp | `.cppm`, `.ixx`, `.ipp`, `.inl`, `.tpp` are not registered | language-registry.ts:135 | Add the extensions. |
| m30 | minor | php | `require_once __DIR__ . '…'` is not extracted | php.ts:194-199 | Add a static file-relative include hint. |
| m31 | minor | cpp | `.h` is always the C grammar (AST only) | language-registry.ts:123 | Configurable or sniffed routing. |
| m32 | minor | php | Namespace-relative and alias-qualified class names are unresolved | php.ts:194-197 | Apply PHP name resolution in class positions. |
| m33 | minor | c, cpp | `#if (0)`, `#if false` and `__has_include` + `#elif 0` give false edges | c-cpp-shared.ts:69-70 | Widen the dead-literal set; add a line-based fallback on ERROR. |
| m34 | minor | php | PSR-4 empty prefix and PSR-0 are ignored (the code comment is wrong) | php-resolve.ts:138, :150-157 | Support both. |
| m35 | minor | c, cpp | Backslash include paths never resolve | include-resolve.ts:49 | Normalize `\` to `/`. |

## 5. Details: blockers and majors

### B1: Kotlin rest-of-file ERROR (GF-1 + KT-01)

- **Evidence:**
  - A shipped-wasm parse of `val tpl = $$"price: $$amount"` followed by two classes gives `ERROR [2:0-5:0]` enclosing both classes.
  - A when-guard (`is String if s.isNotEmpty() ->`) and `context(log: Logger)` each give an ERROR that runs to EOF.
  - Live CLI: the control reports `relation-undeclared-dependency c/Use.kt:2 → pay`. The `$$`, guard and context variants report `yg check: PASS` ($TMPDIR/verify-grammars-k0..k3; $TMPDIR/verify-jvm-dotnet-k1/k2 with controls k1c/k2c).
  - Ambiguity flip: the kotlin-same-fqn-two-files-ambiguous-silence layout plus a when-guard above `class Thing` in src/x gives `src/z/Use.kt:2 → y` ($TMPDIR/verify-grammars-kamb-guard). That contradicts the invariant at kotlin-name-resolution-matrix.test.ts:24.
- **Impact:** When-guards and multi-dollar strings are stable since Kotlin 2.2, context parameters since 2.4. One such line removes every later declaration from the SymbolTable, with no diagnostic. The result is both missed dependencies and a false edge.
- **Fix:** In kotlin.ts, rescan a top-level ERROR's token children for `class|object|interface|typealias|fun` + identifier. Otherwise mark the file declarations-incomplete and silence every resolution that binds into or disambiguates through it. Report files whose root has errors. Rewrite kotlin-context-parameter-type-silent to cover the file-wide erasure. There is no drop-in grammar fix (m6).
- **Verifier note:** Both halves (the missed dependency and the wrong edge) reproduced independently in two verifier runs.

### B2: Rust grouped `use` (RS-1)

- **Evidence:** rust.ts:218-240 emits only `groupPrefix`. In $TMPDIR/verify-go-rust-rs1a, `use crate::{billing::Invoice, orders::Order};` produces no edge from app. The split-`use` control (rs1c) gives `app … :1 → billing, :2 → orders`. In rs1b, `use crate::domain::{billing::Invoice, orders::Order};` gives `→ domain`.
- **Impact:** This is the default output of rust-analyzer merge-imports and of rustfmt `imports_granularity = "Crate"`/`"One"`. It loses dependencies and points suggested relations at the parent node.
- **Fix:** Recurse per item with the joined prefix and dedupe. Add rust-use-grouped-crate-root-edge and rust-use-grouped-nested-subpath-edge. Correct the rationale in rust-use-grouped-common-prefix-edge.
- **Verifier note:** Confirmed from the code and live. The palette covers only leaf items.

### B3: Java across source roots (JKC-01)

- **Evidence:** java-resolve.ts probes only `<ancestor-of-importer>/<fqn>.java`. $TMPDIR/verify-jvm-dotnet-j1 (module-a imports module-b, and a test root imports main) gives `yg check: PASS` with no edges. The single-root control (j2) gives `A.java:2 → b`. An inline FQN fires through the SymbolTable while the equivalent import stays silent.
- **Impact:** In a module-per-node graph of a Maven or Gradle build, Java recall is close to zero.
- **Fix:** On an ancestor-walk miss, fall back to the Java SymbolTable (a unique file gives an edge; a wildcard collapses to its owner). Add java-multi-module-sibling-import-edge, java-multi-module-wildcard-edge and java-test-root-to-main-root-edge.
- **Verifier note:** No palette case documents this as a silence.

### B4: Ambiguity counted by files (XR-01)

- **Evidence:** resolver.ts:182 has `files.size !== 1 → undefined`.
  - C#: $TMPDIR/verify-jvm-dotnet-x1, with a `partial class Customer` split in node people and `Result` / `Result<T>` in separate files of node res, gives no edge. The control x1c gives `Uses.cs:5 → people`, `:6 → res`.
  - Kotlin: expect/actual in commonMain/jvmMain and `toDto` overloads across two files are silent. Control k1c edges.
- **Impact:** Every inbound edge is lost for C# partials, generated files, the generic-arity split, and every KMP shared module, even though the target node is unambiguous.
- **Fix:** Map the files to owners and resolve when there is one owner. Keep the cross-node duplicate case as a silence. Optionally key C# declarations by arity (`` Result`1 ``).
- **Verifier note:** The palette mentions expect/actual only in prose, and its fixture uses two different nodes.

### B5: C# generic base names (CS-03)

- **Evidence:** csharp.ts:560-566 descends only into the type arguments. In $TMPDIR/verify-jvm-dotnet-x1, `: Repository<Customer2>`, `: IHandler<string,int>` and the field `Repository<int> repo` give no app→core edge, while `OrderStatus st` in the same file gives `→ core`.
- **Impact:** MediatR handlers, repositories, `Entity<TId>` and `Result<T>` are the main shared-kernel dependencies in modern .NET, and all of them are invisible.
- **Fix:** Emit the base identifier as its own candidate group and rely on fail-to-silence for BCL containers. Add csharp-generic-base-class-edge, csharp-generic-interface-impl-edge and a silence case for `List<Foo>`.
- **Verifier note:** Undocumented. The skip's stated reason is unnecessary, because externals already resolve to nothing.

### M1: Python ancestor shadow (PY-1)

- **Evidence:** In $TMPDIR/verify-python-ruby-p1b, `app/logging.py` plus `import logging` in `app/api/routes.py` gives `api app/api/routes.py:1 → base`. python3 resolves `/usr/lib/python3.13/logging/__init__.py`.
- **Impact:** A CI-blocking false positive with no waiver.
- **Fix:** Skip ancestor dirs that contain `__init__.py`. Add python-stdlib-shadowed-by-ancestor-module-silence.
- **Verifier note:** The Django sibling layout does not fire; the proj-nested layout does.

### M2: Ruby unrooted qualified reference (RB-2)

- **Evidence:** In $TMPDIR/verify-python-ruby-r2, `module Shop; class Cart; … Billing::Invoice.new` gives `→ billing`, but Ruby resolves `Shop::Billing::Invoice`. The cause is ruby.ts:69-72.
- **Fix:** Resolve `A::B` through the nesting candidates; only `::A::B` is absolute. Fix the "shadow-free" text in ruby-qualified-mixin-edge.
- **Verifier note:** No Ruby runtime in the container, so this relies on documented `Module.nesting` semantics.

### M3: Ruby nested reopening of a gem namespace (RB-3)

- **Evidence:** $TMPDIR/verify-python-ruby-r3 gives `models app/models/application_record.rb:1 → init` from a nested `module ActiveRecord; class Base` in an initializer.
- **Fix:** Do not anchor on a reopening; require path corroboration. Add ruby-reopened-external-nested-silence.
- **Verifier note:** The palette covers only the compact form.

### M4: Ruby core_ext reopening (RB-4)

- **Evidence:** $TMPDIR/verify-python-ruby-r4 gives `specs spec/formatter_spec.rb:3 → coreext` from `class String` in lib/core_ext.
- **Fix:** Treat core and stdlib constants as absent. Add ruby-core-class-reopening-silence.
- **Verifier note:** The `declarations()` comment assumes 2+ reopening files, which does not hold.

### M5: Rust inline `mod tests` (RS-2)

- **Evidence:** In $TMPDIR/verify-go-rust-rs2, `src/orders/service.rs` with `#[cfg(test)] mod tests { use super::*; }` gives `service …:5 → orders`.
- **Impact:** The canonical test idiom, at depth ≥2. It pushes users to declare fake relations.
- **Fix:** Track the inline-mod stack and consume `super` per enclosing inline mod. Also fix `mod x;` inside an inline mod.
- **Verifier note:** Masked by the hierarchy exemption when the parent node is an ancestor.

### M6: C# `global using` leak (CS-01)

- **Evidence:** In $TMPDIR/verify-jvm-dotnet-cs1, Api's `global using Api.Models;` makes Worker's `Customer` (from the external Vendor.Crm package) edge `worker … → api`. No code under src reads .csproj files.
- **Fix:** Scope to the nearest .csproj; parse `<Using Include/Remove>` and Directory.Build.props.
- **Verifier note:** The false edge needs a simple-name collision with a binding the tool cannot see. In-repo collisions become silences instead.

### M7: C# alias collision (CS-02)

- **Evidence:** $TMPDIR/verify-jvm-dotnet-cs2 gives `billing Billing/Invoice.cs:2 → smodel`.
- **Fix:** Per-project scoping. Treat an alias with more than one target as ambiguous.
- **Verifier note:** An uncommon setup, but a wrong target and order-dependent.

### M8: TS type-only inconsistency (TS-3)

- **Evidence:** In $TMPDIR/verify-typescript-js-ts3, `typeof import("../b/value")` gives `→ b`, `import("../c/value").T` gives `→ c`, and `import type B = require()` in a .cts gives `→ b`, while `import type {T}` is silent.
- **Impact:** vitest `importOriginal<typeof import('…')>()` is ubiquitous, so the false edges show up in real code.
- **Fix:** Skip `import()` calls under a type ancestor. Apply the statement-level `type` guard before the `import_require_clause` branch. Catalogue all three forms.
- **Verifier note:** Contradicts the palette's own "cardinal false positive" rule.

### M9: Rust target roots (RS-4)

- **Evidence:** In $TMPDIR/verify-go-rust-rs4, `src/bin/cli.rs` gives `→ libargs` (wrong node) and misses `mod args;`. `tests/it.rs` `mod common;` gives no edge.
- **Fix:** Treat target roots as mod-rs-like with their own `crate::` root. Add rust-bin-target-crate-root-edge and rust-integration-test-mod-common-edge.
- **Verifier note:** The wrong-node half needs a same-named lib module to collide.

### M10: TS paths and baseUrl (TS-5)

- **Evidence:** $TMPDIR/verify-typescript-js-ts5: `@/b/value` and `src/c/value` both give PASS with no edge.
- **Fix:** Parse tsconfig with `extends` and apply longest-prefix wildcards. Flip typescript-tsconfig-alias-silence to an edge and add a baseUrl case.
- **Verifier note:** Deliberate ("tolerated false-negative"), but it is the default cross-folder style in Next.js, Angular and Nx, and TS resolves it deterministically.

### M11: TS workspaces (TS-6)

- **Evidence:** In $TMPDIR/verify-typescript-js-ts6, `import { X } from "@acme/b"` (an in-repo workspace package) gives PASS.
- **Fix:** Index in-repo package names and resolve via `exports`/`main`. Add workspace-package-edge and workspace-subpath-exports-edge.
- **Verifier note:** The palette lists `@scope/pkg` only as external.

### M12: Python source roots (PY-2)

- **Evidence:** $TMPDIR/verify-python-ruby-p2 and p2b give PASS with no edge. The control p2c (importer under src/) edges.
- **Fix:** Discover source roots (pyproject.toml, setup.cfg, `src/`, `[tool.uv.workspace]`) and keep the 2+-match ambiguity rule.
- **Verifier note:** tests→src matters less; cross-member workspace imports are the real loss.

### M13: Rust crate-root items (RS-3)

- **Evidence:** $TMPDIR/verify-go-rust-rs3: `use crate::Error; use crate::{Config};` against lib.rs items gives no orders→root edge.
- **Fix:** Probe `src/lib.rs`, then `src/main.rs`, for the crate src dir. Add rust-use-crate-root-item-edge.
- **Verifier note:** Confirmed from the code; affects the common `crate::Error` / `crate::Result` pattern.

### M14: JVM interop (KT-03)

- **Evidence:** $TMPDIR/verify-jvm-dotnet-k1/k1c: Kotlin `import com.app.j.JavaSvc` and Java `import com.app.w.Wild;` never fire, while Kotlin-to-Kotlin edges in the same run do.
- **Fix:** One JVM namespace, honouring `@file:JvmName`. Add kotlin-imports-java-class-edge and java-imports-kotlin-class-edge.
- **Verifier note:** Mixed Android and Spring repos cross this boundary constantly.

### M15: Kotlin local declarations (KT-04)

- **Evidence:** In $TMPDIR/verify-jvm-dotnet-k1, a local `val format` in another node's function silences `import com.app.u.format`. In k3 the same happens even within one node (it combines with B4).
- **Fix:** Skip declarations under a function, lambda, initializer or accessor. Add kotlin-local-val-not-a-top-level-key.
- **Verifier note:** Worse than reported, because it also fires within a single node.

### M16: C# static member access (CS-04)

- **Evidence:** $TMPDIR/verify-jvm-dotnet-x1:10: `Guard.NotNull(o); OrderStatus.Paid` gives no edge, while the field `OrderStatus st` on line 12 does.
- **Fix:** Emit the leftmost identifier of `member_access_expression` unless it is shadowed by a local, parameter or member. Add a shadowing silence case.
- **Verifier note:** The shadowing guard is required to keep zero FP.

### M17: C/C++ include roots (CPP-1)

- **Evidence:** $TMPDIR/verify-php-c-cpp-cc: `-I` via compile DB, root-relative and in-repo angle includes all give no edge. The control `../core/…` edges. docs/relations-flows-ports.md:41 lists C/C++ with no caveat.
- **Fix:** Read compile_commands.json when present (`-iquote`, then `-I`, excluding `-isystem`), and silence a header found under two roots. Otherwise document the limit.
- **Verifier note:** Deliberate and catalogued (cpp-nonexistent-quoted-include-silence), so major rather than blocker. The docs gap is what makes a green check misleading.

### M18: PHP multiple composer.json (PHP-1)

- **Evidence:** $TMPDIR/verify-php-c-cpp-mono gives PASS even with a root map covering both prefixes. With packages/a/composer.json removed it gives `→ b`.
- **Fix:** Nearest map first, then the union of all maps with the exactly-one-hit rule. Add php-psr4-monorepo-sibling-package-edge and php-psr4-root-map-shadowed-edge.
- **Verifier note:** The symfony/symfony split-monorepo layout hits this.

### M19: GitHub-only grammar releases, Rust `unsafe extern` (GF-4 + GR-RS)

- **Evidence:** tsup.config.ts `findFile()` only calls `require.resolve(`${pkg}/package.json`)`. npm has rust 0.24.0, c 0.24.1 and yaml 0.7.1, while GitHub has v0.24.2, v0.24.2 and v0.7.2 with wasm assets. The shipped rust wasm (sha256 f65f3542…, identical to npm 0.24.0) gives `ERROR "unsafe extern \"C\""`. v0.24.2 gives `foreign_mod_item` with no error. The trial ran 1357/1357 with those three wasms.
- **Impact:** Edition 2024 requires `unsafe extern`, so every FFI file has broken trees for `ctx.parseAst` rules. Relations are unaffected.
- **Fix:** Add a pinned-asset or source-build path to tsup.config.ts that fills `grammarCommit` and `treeSitterCliVersion`, then take the three releases.
- **Verifier note:** The verifier did not re-run the 1357-test trial. `safe fn` errors even on upstream HEAD.

### M20: TS grammar frozen (GF-5 + TS-7)

- **Evidence:** In .ts, `using res = open();` parses without error as `assignment_expression(using …)`; the JS grammar gives `using_declaration`. `import defer`, `export type *`, `in out T`, `static accessor`, `for (await using)` and `export … with` all ERROR. The last tag is v0.23.2 and it depends on JS ^0.23.1.
- **Fix:** Vendor a regenerated grammar (PRs #357, #358, #364, #365) with a pinned CLI. Add per-release canaries.
- **Verifier note:** The verifiers split: one kept major, the other called the standalone item minor. The ERROR-text guard for `export type *` would survive a grammar fix (typescript.ts:77-79), and runCase pins it. Kept major under the rubric because of the silent `using` misparse.

### M21: Go 1.26/1.27 syntax (GR-GO)

- **Evidence:** npm 0.25.0 is latest and upstream has only CI commits since. The shipped wasm gives `ERROR` for a generic method `func (r *Rand) N[Int …]` and `ERROR "42"` for `new(42)`. go.dev/doc/go1.27 confirms generic methods.
- **Impact:** AST rules break, and generic methods drop out of `declarations()`. Imports are unaffected.
- **Fix:** Patch the grammar (type_parameters on method_declaration; `new` taking an expression) or document the limit. File upstream.
- **Verifier note:** This is a limitation, not a stale dependency.

### M22: C++ grammar stale (CPP-2 + GF-11)

- **Evidence:** `export module geo.shapes;`, deducing `this`, `if consteval`, static lambdas and `_BitInt` ERROR. Master grammar.js has `import_declaration` with a `header` field. Issues #341 and #365 are open. The master trial passes 1357.
- **Impact:** Only header-unit `import "x.hpp"` edges are lost. GMF includes in a .cpp survive (`math2.cpp:2 → hdr`).
- **Fix:** Build from a pinned commit, route `import_declaration.header` through the quoted-include resolver, and drop the version-specific wording from the palette.
- **Verifier note:** GF-11's verifier rated minor and CPP-2's kept major. Consolidated as major under "a stale grammar that misparses the current language version". The `#embed` claim holds only in initializer position.

## 6. Palette gaps: proposed cases

Format: `id` (category, expectation).

- **Schema:** add `javascript` to the `language` enum in `_reference-schema.yaml`. Create `reference/relations/c/` and move `c-header-parses-as-c-routing-edge` there.
- **javascript:**
  - `javascript-cjs-require-edge` (import, edge)
  - `javascript-mjs-import-edge` (import, edge)
  - `javascript-jsx-in-js-edge` (import, edge)
  - `javascript-jsdoc-import-silence` (usage-site, silence)
  - `javascript-export-from-with-attributes` (trap, edge or silence per decision)
- **typescript:**
  - `typescript-import-defer-edge` (import, edge)
  - `typescript-mts-mjs-rewrite-edge` (import, edge)
  - `typescript-cts-cjs-require-edge` (import, edge)
  - `typescript-explicit-ts-extension-edge` (import, edge)
  - `typescript-template-no-substitution-dynamic-import-edge` (dynamic, edge)
  - `typescript-typeof-import-type-query` (usage-site, per the M8 policy)
  - `typescript-import-type-member-annotation` (usage-site, per the M8 policy)
  - `typescript-import-type-equals-require` (import, per the M8 policy)
  - `typescript-tsconfig-paths-edge` (import, edge; replaces the alias silence)
  - `typescript-tsconfig-baseurl-edge` (import, edge)
  - `typescript-tsconfig-paths-multi-target-silence` (trap, silence)
  - `typescript-workspace-package-edge` (import, edge)
  - `typescript-workspace-subpath-exports-edge` (import, edge)
  - `typescript-package-main-directory-edge` (import, edge)
  - `typescript-index-mjs-cjs-edge` (import, edge)
  - `typescript-root-absolute-specifier` (trap, silence or root-edge)
  - `typescript-query-suffix-import-edge` (import, edge)
  - `typescript-new-url-import-meta-edge` (dynamic, edge)
  - `typescript-for-await-using-then-import-edge` (trap, edge)
  - `typescript-tsx-import-type-args-then-import-edge` (trap, edge)
  - `typescript-relative-module-augmentation` (usage-site, per the m13 policy)
  - `typescript-vi-mock-silence` (dynamic, silence)
- **python:**
  - `python-stdlib-shadowed-by-ancestor-module-silence` (trap, silence)
  - `python-src-layout-tests-edge` (import, edge)
  - `python-workspace-member-edge` (import, edge)
  - `python-lazy-import-edge` (import, edge)
  - `python-from-import-single-report` (trap, edge, exactly one line)
- **ruby:**
  - `ruby-qualified-ref-lexical-shadow-edge` (nested, edge to the nested namespace)
  - `ruby-qualified-ref-lexical-ambiguous-silence` (trap, silence)
  - `ruby-reopened-external-nested-silence` (trap, silence)
  - `ruby-core-class-reopening-silence` (builtin, silence)
  - `ruby-bare-constant-in-method-edge` (nested, edge once lexical resolution exists)
  - `ruby-zeitwerk-implicit-namespace-edge` (nested, edge)
  - `ruby-rake-file-edge` (import, edge)
  - `ruby-long-heredoc-delimiter-parses` (trap, edge survives)
- **go:**
  - `go-nested-submodule-edge` (import, edge)
  - `go-split-package-silence` (trap, silence)
  - `go-cgo-import-silence` (builtin, silence)
  - `go-major-version-module-edge` (import, edge)
  - `go-external-test-package-edge` (import, edge)
  - `go-internal-package-edge` (import, edge)
  - `go-nested-module-parent-import` (import, edge or silence per decision)
  - `go-quoted-module-path-edge` (import, edge)
- **rust:**
  - `rust-use-grouped-crate-root-edge` (import, edge ×2)
  - `rust-use-grouped-nested-subpath-edge` (import, edge ×2)
  - `rust-inline-mod-tests-super-glob-silence` (nested, silence)
  - `rust-mod-decl-inside-inline-mod-edge` (nested, edge)
  - `rust-use-crate-root-item-edge` (import, edge)
  - `rust-bin-target-crate-root-edge` (import, edge)
  - `rust-integration-test-mod-common-edge` (import, edge)
  - `rust-workspace-path-dependency` (import, edge or silence per decision)
  - `rust-raw-identifier-module-edge` (import, edge)
  - `rust-macro-export-silence` (dynamic, silence)
  - `rust-extern-crate-alias` (import, per decision)
  - Also move the existing importing fixtures from `src/c/lib.rs` to a realistic module file.
- **java:**
  - `java-multi-module-sibling-import-edge` (import, edge)
  - `java-multi-module-wildcard-edge` (import, edge)
  - `java-test-root-to-main-root-edge` (import, edge)
  - `java-imports-kotlin-class-edge` (import, edge)
  - `java-flexible-constructor-prologue-edge` (trap, edge)
- **kotlin:**
  - `kotlin-when-guard-subsequent-decls-edge` (trap, edge)
  - `kotlin-multidollar-subsequent-decls-edge` (trap, edge)
  - `kotlin-context-parameter-subsequent-decls-edge` (trap, edge; replaces the understated context-parameter case)
  - `kotlin-error-decl-no-ambiguity-flip-silence` (trap, silence)
  - `kotlin-expect-actual-same-node-edge` (import, edge)
  - `kotlin-toplevel-overload-multi-file-edge` (import, edge)
  - `kotlin-local-val-not-a-top-level-key` (trap, edge preserved)
  - `kotlin-imports-java-class-edge` (import, edge)
  - `kotlin-wildcard-one-owner-edge` (import, edge; with a split-owner silence)
  - `kotlin-same-package-cross-node-silence` (usage-site, silence)
  - `kotlin-kmp-source-set-import-edge` (import, edge)
- **csharp:**
  - `csharp-global-using-other-project-no-leak` (trap, silence)
  - `csharp-global-alias-cross-project-collision-silence` (trap, silence)
  - `csharp-csproj-using-item-edge` (import, edge)
  - `csharp-partial-class-multi-file-edge` (usage-site, edge)
  - `csharp-generic-arity-split-files-edge` (usage-site, edge)
  - `csharp-generic-base-class-edge` (usage-site, edge)
  - `csharp-generic-interface-impl-edge` (usage-site, edge)
  - `csharp-generic-external-container-silence` (builtin, silence)
  - `csharp-static-member-access-edge` (usage-site, edge)
  - `csharp-enum-member-access-edge` (usage-site, edge)
  - `csharp-local-shadows-type-name-silence` (trap, silence)
  - `csharp-extension-block-receiver-edge` (usage-site, edge, with an AST-shape assertion)
  - `csharp-null-conditional-assignment-rhs-edge` (usage-site, edge)
  - `csharp-extension-via-owned-namespace` (usage-site, per decision; split from the DI/reflection case)
- **php:**
  - `php-psr4-monorepo-sibling-package-edge` (import, edge)
  - `php-psr4-root-map-shadowed-edge` (import, edge)
  - `php-psr4-cross-package-duplicate-silence` (trap, silence)
  - `php-require-dir-relative-edge` (import, edge)
  - `php-require-bare-path-silence` (dynamic, silence)
  - `php-psr4-empty-prefix-edge` (import, edge)
  - `php-psr0-edge` (import, edge)
  - `php-namespace-alias-qualified-usage` (usage-site, per decision; fixture without `Models.php`)
  - `php-84-asymmetric-promotion-edge` (trap, edge)
- **c:**
  - `c-embed-silence` (builtin, silence)
  - `c-elifdef-dead-branch` (trap, silence)
  - `c-extern-c-wrapper-edge` (import, edge)
  - `c-if-paren-zero-silence` (trap, silence)
  - `c-has-include-elif-zero-silence` (trap, silence)
- **cpp:**
  - `cpp-include-root-via-compile-db-edge` (import, edge)
  - `cpp-in-repo-angle-include-via-I-edge` (import, edge)
  - `cpp-header-under-two-roots-silence` (trap, silence)
  - `cpp-root-relative-google-style-edge` (import, edge)
  - `cpp-ipp-source-include-edge` (import, edge)
  - `cpp-cppm-global-module-fragment-edge` (import, edge)
  - `cpp-if-false-silence` (trap, silence)
  - `cpp-backslash-include-edge` (import, edge)
  - `cpp-header-unit-import-edge` (import, edge; replaces cpp-import-header-unit-silence after M22)
  - `cpp-cpp-header-named-h` (trap, edge)

## 7. What is solid

- **Runtime and ABI:** web-tree-sitter 0.27.0 accepts ABI 13–15. All 16 wasms load, and trees on 1884 real files are identical to 0.26.12.
- **npm currency:** every grammar is at npm latest, and the trial upgrades (GitHub releases; cpp and php master) cause zero relation regressions.
- **Palette integrity:** the 1:1 case-to-runCase contract holds everywhere it was counted (Python 22/22, Ruby 19/19, Rust 14, Go 12, Kotlin 45, PHP 56, cpp 17, TS 42), and every catalogued case behaves as specified live.
- **Error recovery:** relation extraction survives local ERROR nodes in most languages (C#, Java, Rust, Go, PHP, Python `lazy import`, C++ deducing-this). Kotlin (B1) and the two narrow TS swallow cases are the exceptions.
- **Modern syntax, clean parses:**
  - Python 0.25.0 parses PEP 695/701/750/758 cleanly.
  - PHP 8.1–8.5 inline forms all edge.
  - JS 0.25.0 parses `using`.
  - C# primary constructors, collection expressions and `field` parse cleanly.
  - Java record patterns, sealed types and unnamed `_` parse cleanly.
  - Rust let-chains, `use<'a>`, `&raw`, async closures parse cleanly.
  - Go range-over-func and generic aliases parse cleanly.
- **Baseline correctness:** Go single-module resolution (generics, cgo, `internal/`, `/v2`), Java single-root imports (including the wildcard owner collapse), PHP PSR-4 single-map resolution, and relative TS/JS resolution including NodeNext are correct.
- **Fail-closed where it matters:** a parser that cannot load raises `relation-parse-failed` rather than passing. The relation facts cache is already keyed on the grammar wasm hash.
- **Deliberate silences are documented and reasoned:** tsconfig aliases, go.work, `-I` roots, Ruby bare constants, Kotlin wildcards. They are policy, not accidents.

## 8. Completeness critique

- **Live evidence ran on web-tree-sitter 0.26.12.** Most live CLI evidence came from a dev container whose node_modules has 0.26.12 rather than the locked 0.27.0. The Kotlin, Ruby, C# and Python behaviours were re-checked on 0.27.0 and matched, and a corpus diff found identical trees, but not every scratch project was re-run on 0.27.0.
- **Missing toolchains:** the container has no Ruby, so RB-2's lexical-lookup claim rests on documented semantics, not a runtime check. It has no Go toolchain, so the `module ( … )` block form in m25 was not verified.
- **Trials not re-run by verifiers:** the 1357-test upgrade trial and fwcd Kotlin's 37 failures come from the finder only.
- **Deterministic `ctx.parseAst` rules:** judged only by inspecting ERROR nodes, not by running real `check.mjs` rules. The practical blast radius of grammar staleness on user rules is inferred.
- **Scale:** all relation evidence comes from small scratch projects. Nobody measured precision or recall on a real mid-size repo per language, so "common" is a judgement, not a measurement.
- **Coverage depth:** JavaScript was covered only through the TypeScript angle, and C only through the cpp angle (no dedicated C palette exists). TOML, YAML and JSON were checked for grammar freshness only; they carry no relations. Cross-language edges were probed only for Kotlin↔Java; TS↔JSON and Python↔C extensions were not considered.
- **Fixes interact:** B4 (owner collapse) changes the failure mode of the B1 ambiguity flip and of M15. They should land together with the new trap cases, or one fix can hide another regression.
- **Missing pipeline:** several fixes (M19, M20, M22, m1, m2, m6) depend on a build-from-source or pinned-asset grammar pipeline that does not exist yet. That pipeline is the real prerequisite, and it is not costed here.
- **Unexamined:** performance and incremental behaviour of the relation pass under grammar changes (m4 aside).

## 9. Refuted findings

- RB-9: "gem-internal `require 'x/y'` and `autoload` have no cases". Refuted: both are catalogued silences (ruby-plain-require-silence, ruby-dynamic-const-get-silence).
- GF-2 / RB-1 (partial): "any delimiter over 255 crashes". Refuted: a 1100-char delimiter parsed, so the trigger depends on length mod 256. Downgraded to minor (pathological input, fails closed).
- GF-3 (partial): "the C# bump would drop the edge silently". Refuted: the csharp-extension-receiver-type runCase fails in CI.
- GF-5 (partial): "the `export type *` guard breaks when the grammar is fixed". Refuted: `isWholeStatementTypeToken` also accepts an anonymous `type` token.
- GF-11 (partial): "`#embed` errors in C++". Refuted at top level (it parses as `preproc_call`); it errors only in initializer position.
- TS-1 (partial): "any following import or require is lost". Refuted: dynamic `import()` and `require()` inside the ERROR still edge; only trailing static imports are lost.
- TS-2 (partial): "common in React/TSX". Refuted: type-literal members parse cleanly; only a generic import-type annotation before a static import triggers it.
- TS-4: "type-only silence is a defect". Refuted as a defect: it is documented v1 policy pinned by 8 cases; only the user-docs gap remains.
- TS-6 (partial): "the palette never mentions `@scope/pkg`". Refuted: typescript-bare-specifier-silence lists it as external.
- TS-7 (partial): "a newer stable TS grammar is available". Refuted: none exists; the gap needs vendoring.
- PY-1 (partial): "the canonical Django+Celery layout fires". Refuted for the documented sibling layout; it fires only with the app nested inside the project package.
- RB-5, RB-6, KT-02, GO-1, RS-5, CPP-1: "defects". Refuted as defects: each is a documented deliberate silence. They are kept as recall enhancements (or as major for CPP-1, because of the missing docs caveat).
- CS-01 (partial): "every multi-project solution with `global using`". Refuted: it needs a simple-name collision with a binding the tool cannot see; in-repo collisions become silences.
- CPP-3 (partial): "unregistered extensions break the fail-closed promise". Refuted: that promise covers parser loading, not unregistered extensions.
- CPP-4 (partial): "relations degrade on C++ `.h` files". Refuted: extraction and the dead-branch guard survived under the C grammar.
- PHP-3 (partial): "php-qualified-usage-via-alias-edge hides the gap". Refuted: the case text states the qualified usage is silenced.
- PHP-2 (partial): "a common modern form". Refuted: Composer autoload covers modern class dependencies, so it is downgraded to minor.
