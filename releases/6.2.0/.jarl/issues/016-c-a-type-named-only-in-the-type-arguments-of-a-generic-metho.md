# 016 · C#: a type named only in the type arguments of a generic method (AddScoped<IFoo,Foo>(), GetRequiredService<T>(), Deserialize<T>(), Substitute.For<T>()), in `new T[n]`, `foreach (T x in …)` or `out T x` gives no edge; check passes on an undeclared dependency

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-vlht
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/reference/relations/csharp/csharp-di-reflection-extension-silence.md, Yggdrasil/docs/relations-flows-ports.md, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/csharp.mts: the main walk extractCsharpRefs (the walk from ~928 to ~1150); invocation_expression :1124 (pushes only the extension reference and returns), member_access_expression (handles generic_name only in the expression field, not name), emitTypeNode/emitTypeArguments :790-826; no cases for array_creation_expression, foreach_statement and declaration_expression (the last two only in the local-name collector)
**Branch:** jarl/016-csharp-refs
**Merged:** a474f33 in ../../../Runes
**CI:** none

## What
The main walk does not emit types from four AST shapes (confirmed with the shipped tree-sitter-c_sharp.wasm): generic_name in the method name position (invocation_expression.function and member_access_expression.name), array_creation_expression.type, foreach_statement.type, declaration_expression.type. Reproduction (npm @chrisdudek/yg@6.1.0, runes 1.0.0, `yg init --no-reviewer`): node api declares a relation only to domain; Program.cs: `builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>(); builder.Services.AddSingleton<ShopDbContext>();`; Report.cs: `sp.GetRequiredService<ShopDbContext>()`, `new SqlOrderRepository[4]`, `foreach (SqlOrderRepository r in rows)`, `TryFind(out ShopDbContext found)`; `yg check`: PASS, exit 0 (with .csproj and without), although api depends on infra in six places. Isolating the forms (node app with no relation to core): the controls in the same files (a local variable's type, `new Repo()`, typeof, `new List<Ctx>()`, `o is Ctx`, a fully qualified `GetService<Shop.Core.Ctx>()`) give app → core, so name resolution works; eight forms are silent: `services.AddScoped<IRepo,Repo>()`, `sp.GetRequiredService<Ctx>()`, `Generic<Ctx>()`, `Substitute.For<Ctx>()`, `new Repo[4]`, `foreach (Repo r in rows)`, `out Ctx found`, `System.Array.Empty<Ctx>()`. A real repo jasontaylordev/CleanArchitecture @5353a9e (one node per project in src/, no relations): Web/DependencyInjection.cs:15 `AddScoped<IUser, CurrentUser>()` (IUser in Application) and Infrastructure/DependencyInjection.cs:42, :77 (IApplicationDbContext, IIdentityService) without an edge. The finder's regex survey: 1/23 lines with method type arguments between nodes are reported in CleanArchitecture, 5/48 in eShop, 335/1231 in jellyfin. Issue 214 (6.1.0) fixed generic_name in type positions, not method type arguments. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-13/log.txt (script repro.sh; run-*-di, run-*-forms, ca-check.json, yg-install/parse.mjs).

## Why
The documentation (relations-flows-ports.md:50) and `yg knowledge read ports-and-relations` say that a type argument is a dependency just like an import. DI registration, service locator, mocks, Deserialize<T>, Array.Empty, foreach and out are very common C# forms, and the edge from the composition root (Web → Infrastructure through AddScoped<I, Impl>) is exactly what Clean Architecture users want to catch. The palette case csharp-di-reflection-extension-silence wrongly calls `AddScoped<IFoo, Foo>()` statically unresolvable. This is a recall gap (no false alarms), but the gate lets an undeclared dependency through.

## Acceptance
- The walk emits the generic_name type arguments in the method name position (without the method identifier itself) and the type from the `type` field of array_creation_expression, foreach_statement and declaration_expression; all eight silent forms give the edge app → core, and the api scenario gives FAIL.
- Runes palette cases for each form; the rule in csharp-di-reflection-extension-silence corrected; a Runes release and a bumped pin in Yggdrasil.

## Changelog
- Fixed: C# types named only as type arguments of a generic method call (services.AddScoped<IFoo, Foo>(), sp.GetRequiredService<T>(), Substitute.For<T>(), Array.Empty<T>()), in new T[n], in foreach (T x in …), and in out T x or a typed deconstruction now count as dependencies; these were hidden before, so a graph that passed may now report undeclared dependencies after the upgrade.

## Evidence

- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** first npm run check: 1578/1579, the one failure the lock property test 'withLock takes over exactly the locks…' (withLockAsync did not reject a young lock; load average ~108), which passed alone 3/3; npm run check re-run: tests 1579, pass 1579, fail 0, catalogue 483 cases, dist/ is fresh; npm run coverage: tests 1579, pass 1579, fail 0, all files 98.75 / 94.02 / 98.58, exit 0; merge a474f33 (catalogue count conflict resolved to 470 + 13 = 483)

Rerun 2026-11-11 on the built Yggdrasil (release/6.2.0 plus this lease, Runes build of commit c5124ca0525e stamped 1.1.0) beside the published @chrisdudek/yg@6.1.0, on a synthetic project rebuilt from the issue text (one node per directory, no relations, yg check --no-approve --json). 016: api uses AddScoped<IOrderRepository, SqlOrderRepository>(), GetRequiredService<ShopDbContext>(), new SqlOrderRepository[4], foreach (SqlOrderRepository r in rows) and out ShopDbContext found from namespace Shop.Infra. 6.1.0: Report.cs:6 and :8 only; built: Program.cs:3 and Report.cs:4, :5, :6, :7, :8 -> infra (all six forms). CleanArchitecture @5353a9e: built adds src/Web/DependencyInjection.cs:15 -> application and src/Infrastructure/DependencyInjection.cs:42 and :77 -> application.

