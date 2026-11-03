# C# audit: name lookup in Runes release/1.1.0 at 5227538

Auditor: aud-runes-csharp-opus. Scope: `src/relations/extractors/csharp*.mts`, `src/relations/resolver.mts`, `src/relations/symbol-table.mts`, read in the source at 5227538 and run from the built `dist/` of two scratch trees under Althing's `.cache/` (`audit-runes-5227538` and `audit-runes-v1.0.0`).

## How a probe runs

Each probe is a reference case (a small file tree and its expected edges) in `probes/csharp/`. `csharp-probe-runner.mjs` loads it with the tree's own `test/relations/reference-case-runner.mjs` (`loadCaseDoc`, `caseEdges`), so the real pipeline runs: extractor, symbol table, global-using pre-pass, the reference graph (5227538 only; v1.0.0 has none), resolver. A node is the parent directory of a file. The commands, run from each tree's directory:

```
timeout 400 nice -n 15 node <materials>/csharp-probe-runner.mjs . <materials>/probes/csharp/*.md > <materials>/csharp-probe-output-5227538.txt
timeout 400 nice -n 15 node <materials>/csharp-probe-runner.mjs . <materials>/probes/csharp/*.md > <materials>/csharp-probe-output-v1.0.0.txt
```

The raw outputs are `csharp-probe-output-5227538.txt` (43 probes, 39 differ) and `csharp-probe-output-v1.0.0.txt` (43 probes, 40 differ). `csharp-parse-shapes.mjs` prints the parse of the type positions found unread.

Controls, to show the runner reads cases the way the tree's suite does:

- Five catalogue cases through the runner (`csharp-nested-type-keying`, `csharp-extension-referenced-project-edge`, `csharp-type-pattern-binding`, `csharp-generic-arity-split-files-edge`, `csharp-file-local-type-no-cross-file`): 5 pass.
- `timeout 300 nice -n 15 node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs` at 5227538: 158 tests, 158 pass.

Two probes list fewer edges than their support files give: p30 and p32 omit the edge a support file gives on its own line (`BillingExtensions.cs:2 -> core`, `Derived.cs:2 -> core`). That edge is correct C#; the finding in each is the missing edge of the web file.

## The rules checked

| # | Rule | Spec | Probes |
|---|---|---|---|
| R1 | A simple name inside a type reads the type's nested types (every partial part) before any namespace member, alias or using | §7.6.1, §12.8.4 | p01, p02, p19, p31, p38 |
| R2 | The nested types of base classes count as members of the derived type | §7.6.1 | p03, p32 |
| R3 | A simple name that names a member of the enclosing type (inherited, or in another partial part) is that member, not a type | §12.8.4 | p04, p18, p30, p42 |
| R4 | The arity is part of the lookup: `N<…>` with K arguments binds only a type with K parameters | §7.6.1 | p05, p06, p17, p40 |
| R5 | A delegate declaration declares a type | §21 | p07, p08, p33 |
| R6 | An attribute name has two readings; the one that is an attribute class is the result | §23.3 | p09, p10 |
| R7 | An extension method is considered only when no applicable instance method exists | §12.8.10.3 | p11, p29, p41 |
| R8 | `using static` imports nested types and extension methods | §14.5.4 | p12, p13, p35 |
| R9 | Each type position names its types: patterns and `is`, ref types, query range variables, function pointers, explicit lambda return types | §11, §12.12.12, §15.6.1, §12.20.3.2, §12.19.1 | p14, p15, p23 to p28, p34, p43 |
| R10 | A type parameter of an enclosing type is in scope in nested types | §7.6.1 | p20 |
| R11 | A file-local type is in scope in its own file | C# 11 file-local types | p16 |
| R12 | Implicit usings follow the SDK and the evaluated `ImplicitUsings` value | MS Learn, implicit usings | p36, p37 |
| R13 | A project sees only the assemblies the compiler is given (ProjectReference metadata, `Compile Remove`) | MSBuild | p21, p22, p39 |

Rules the tree already covers, checked through its catalogue and matrix (158 cases, all green) and not probed again: enclosing namespaces before usings (§7.6.1), the global namespace before compilation-unit usings (485), usings and aliases per namespace body (476, 486, 469, 295, 479), CS0104 sets, `using A;` importing no sub-namespaces, `global::`, `S::` aliases, extern aliases, global usings per project, `<Using>` items, the implicit `Program`, type parameters shadowing types (138), nested-type keys with `+`, project references and their transitive closure. Known and not counted: 487 (extension lookup order) and 489 (linked `Compile` reachability and internal types). `nameof` gives no edge by ruling (185).

## Every probe

Each line: the probe, what 5227538 printed, what v1.0.0 printed when it differs.

| Probe | Expected | 5227538 | v1.0.0 |
|---|---|---|---|
| p01 nested type of enclosing type vs namespace member | silence | `CreateOrder.cs:4->shared` | same |
| p02 nested type of enclosing type vs using | silence | `GetOrder.cs:5->shared` | same |
| p03 nested type from base class | `MyHandler.cs:3->core`, `:4->core` | `:3->core`, `:4->cfg` | same |
| p04 inherited property as receiver | `OrdersController.cs:3->core` | `:3->core`, `:4->legacy` | same |
| p05 arity: nearer non-generic | `Api.cs:4->lib` | `Api.cs:4->core` | same |
| p06 arity: bare name, nearer generic | `Api.cs:4->lib` | `Api.cs:4->core` | same |
| p07 delegate type | `Bus.cs:4->core` | silence | same |
| p08 delegate in enclosing namespace | silence | `Bus.cs:4->core` | same |
| p09 attribute: written name not an attribute | `Dto.cs:5->val` | `Dto.cs:5->domain` | same |
| p10 attribute: suffixed reading nearer | `Controller.cs:4->attrs` | `Controller.cs:4->lib` | same |
| p11 instance method in other file vs extension | `Checkout.cs:4->core` | `:4->core`, `:5->ext` | same |
| p12 using static nested type | `Draw.cs:1->core`, `:4->core` | `:1->core` | same |
| p13 using static extension method | `A.cs:1->ext`, `:4->ext` | `:1->ext` | same |
| p14 patterns (qualified, not, or, switch arm, array) | lines 4 to 8 `->models` | lines 5, 6, 7 | same |
| p15 ref return, ref readonly, ref local, query, lambda return | lines 4 to 8 `->models` | silence | same |
| p16 file-local type in own file | silence | `Use.cs:4->util` | same |
| p17 `Result` and `Result<T>` in two nodes | `Uses.cs:3->a`, `:4->b` | silence | same |
| p18 property in another partial part as receiver | silence | `OrderService.Get.cs:3->legacy` | same |
| p19 nested enum as receiver | silence | `Order.cs:4->codes` | same |
| p20 outer type parameter in nested type | silence | silence (PASS) | `Outer.cs:2->t` (fixed by 138) |
| p21 `ReferenceOutputAssembly="false"` | `ApiTests.cs:4->Api` | silence | same |
| p22 `Compile Remove` | `Api.cs:3->Core` | `Api.cs:3->Old` | silence |
| p23 ref return type | `Store.cs:4->models` | silence | same |
| p24 ref local type | `Store.cs:4->models` | silence | same |
| p25 query range variable type | `Q.cs:4->models` | silence | same |
| p26 lambda explicit return type | `F.cs:4->models` | PASS | PASS |
| p27 qualified type pattern | lines 3, 4, 5 | line 4 only | same |
| p28 array type in `is` | `Check.cs:4->models` | silence | same |
| p29 interface method vs extension | `Handler.cs:4->core` | `:4->core`, `:5->outbox` | same |
| p30 extension on an inherited property | `WebModule.cs:4->billing` among others | no line 4 edge | same |
| p31 nested type from sibling partial file | silence | `Importer.Run.cs:3->grid` | same |
| p32 nested type through derived type name | `Use.cs:3->core` | no line 3 edge | same |
| p33 delegate nested in class | `Use.cs:4->core` | silence | same |
| p34 function pointer type | `Native.cs:4->models` | silence | same |
| p35 using static in a namespace body vs global type | `Draw.cs:2->core`, `:4->core` | `:2->core`, `:4->legacy` | same |
| p36 implicit usings, Web SDK, props | `Startup.cs:4->Infra` | PASS | PASS |
| p37 implicit usings disabled in project | silence | PASS | PASS |
| p38 global alias vs nested type | `GlobalUsings.cs:1->lib` | `:1->lib`, `Handler.cs:4->lib` | `Handler.cs:4->lib` only |
| p39 `PrivateAssets="all"` transitive | `Api.cs:5->Lib` | silence | same |
| p40 alias target arity | `Api.cs:2->gen` | `Api.cs:2->core` | silence |
| p41 inherited instance method vs extension | `OrderRepo.cs:2->data` | `:2->data`, `:3->docs` | same |
| p42 `ControllerBase.User` vs domain `User` | silence | `OrdersController.cs:5->domain` | same |
| p43 `is` with a generic type | lines 4, 5 | line 4 only | silence |

## Findings

| Id | Finding | Severity | Since | Probes |
|---|---|---|---|---|
| csharp-1-nestencl | A bare name never reads the nested types of its enclosing types | high | pre-existing | p01, p02, p19, p31, p38 |
| csharp-1-inhermem | A member declared outside the file (inherited, or in another partial part) is read as a type | high | pre-existing | p04, p18, p30, p42 |
| csharp-1-basenest | Nested types of base classes are never found | medium | pre-existing | p03, p32 |
| csharp-1-arityign | Generic arity takes no part in the lookup | medium | pre-existing; the alias-target form (p40) is new in 1.1.0 | p05, p06, p17, p40 |
| csharp-1-delegate | Delegates are not declared as types | medium | pre-existing | p07, p08, p33 |
| csharp-1-attrread | The written attribute name wins over a nearer `…Attribute` reading, and a non-attribute class counts | medium | pre-existing | p09, p10 |
| csharp-1-extinstm | An extension call is bound even when the receiver has an instance method of that name | medium | pre-existing | p11, p29, p41 |
| csharp-1-patterns | A qualified name in a pattern and a non-plain type after `is` give no edge | medium | pre-existing (p43 line 4 improved in 1.1.0) | p14, p27, p28, p43 |
| csharp-1-usingsta | `using static` imports neither nested types nor extension methods for references | low | pre-existing | p12, p13, p35 |
| csharp-1-reftypes | `ref T` and `ref readonly T` give no edge | low | pre-existing | p15, p23, p24 |
| csharp-1-queryrng | `from T x in …` gives no edge for T | low | pre-existing | p15, p25 |
| csharp-1-fnptrtyp | A function pointer type gives no edge | low | pre-existing | p34 |
| csharp-1-filelocl | A file-local type loses to a same-named type of another file inside its own file | low | pre-existing | p16 |
| csharp-1-refnoout | The reference graph counts references the compiler does not see | low | 1.1.0 (no graph in 1.0.0) | p21, p39 |
| csharp-1-compremv | `Compile Remove` is not read, and the own-project preference now binds the removed file | low | regression | p22 |

Per severity: 2 high, 6 medium, 7 low. One finding is a regression (csharp-1-compremv); one more finding has a regressed form (p40 under csharp-1-arityign), where the alias-target edge added in 1.1.0 binds the wrong arity where 1.0.0 gave nothing. Every other finding gives the same edges on v1.0.0.

### csharp-1-nestencl (high)

The plain reference's candidates are the enclosing namespaces, an alias, the verbatim global reading and the usings (`csharp.mts:1756-1822`, the loop at 1801-1807). The type chain around the reference (`CsScope.chain`) is never read, although `declarations` publishes `App.Outer+Inner` (`csharp.mts:429-431`). So a bare `Command`, `Result` or `Status` inside the type that nests it binds any same-named type in an enclosing namespace, the global namespace, an import or a global alias of another node. C# reads the nested types of each enclosing type first (§7.6.1, §12.8.4). The vertical-slice layout nests `Command`, `Query`, `Handler` and `Result` in every feature class, and a shared `Result` or `Command` type is common, so the false edge lands on a usual layout and can point from every feature node to the shared one.

### csharp-1-inhermem (high)

`collectDeclaredNames` (`csharp.mts:853-875`) knows only the names of the file itself. A receiver whose leftmost name is not declared in the file is read as a type (`csharp.mts:1412`). An inherited property (`ControllerBase.User`, `Request`, `HttpContext`, a base class's `Settings` or `Mediator`) or a property of another partial part is then bound to a repository type of that name. C# reads the members of the enclosing type, inherited ones included, before any namespace member (§12.8.4). p42 is the ASP.NET controller with a domain `User`: every `User.FindFirst(…)` gives an edge to the domain node. The same rule makes `instanceLikeReceiver` (`csharp.mts:911-916`) treat an inherited property as a type, so its extension calls are lost (p30).

### csharp-1-basenest (medium)

No lookup reads the base list, so `Options` inside a class derived from a base that nests `Options` binds `App.Web.Options` of another node (p03), and `Derived.Options` finds nothing (p32). C# reads the nested types of base classes as members (§7.6.1).

### csharp-1-arityign (medium)

Keys carry no arity (`csharp.mts:429-431`), `generic_name` is pushed by its base name (`csharp.mts:1044-1053`), and alias targets strip type arguments (`csharp.mts:584`). A nearer `App.Result` therefore binds `Result<int>`, a nearer `App.Envelope<T>` binds a bare `Envelope`, and `Result` and `Result<T>` in two nodes of one namespace silence both (p17). C# matches the arity (§7.6.1). The usual pairs are `Result` and `Result<T>`, `Entity` and `Entity<TKey>`, `IRepository` and `IRepository<T>`.

### csharp-1-delegate (medium)

`TYPE_DECLARATION_TYPES` (`csharp.mts:120-127`) leaves out `delegate_declaration`, so `declarations` (`csharp.mts:422`) never publishes a delegate. A delegate type used by another node gives no edge (p07, p33), and a delegate of the enclosing namespace no longer hides an imported class of the same name (p08). A delegate is a type (§21).

### csharp-1-attrread (medium)

`pushAttribute` (`csharp.mts:1827-1841`) merges every reading of the written name before every reading of the suffixed name, and any class counts. C# resolves both names and takes the one that is an attribute class (§23.3). p09: an entity `Required` beside a `RequiredAttribute` gives the edge to the entity. p10: a nearer `App.Web.AuditAttribute` loses to a plain `Lib.Audit` from a using.

### csharp-1-extinstm (medium)

`extensionCall` (`csharp.mts:920-940`) drops a call only when the file itself declares a method of that name (`methodNames`, line 938) or it is an `object` member. An instance method of the receiver's type declared in another file, an interface method, or an inherited one is unseen, so an in-scope extension of the same name in another node gets the edge (p11, p29, p41). C# considers extension methods only when no instance method applies (§12.8.10.3). Common names collide here: `Validate`, `Publish`, `Save`.

### csharp-1-patterns (medium)

The `constant_pattern` handler (`csharp.mts:1317-1323`) reads an identifier or a `qualified_name`, but the grammar parses `o is App.Models.Order` and a switch arm `Models.Order => …` as a `member_access_expression` under `constant_pattern`, and `o is Note[]` and `o is Box<Item>` as an `is_expression` with a type, which no case reads (see `csharp-parse-shapes.mjs`). The edges are lost. A qualified type in a pattern is real but less common.

### csharp-1-usingsta (low)

`using static` records only its target (`csharp.mts:567-573`); `levelsAt` gives references no statics (`csharp.mts:1600`), and `pushExtension` does not model it (`csharp.mts:1862-1888`). The nested types and extension methods it imports are lost (p12, p13), and inside a namespace body a farther global type of the same name binds instead (p35, a false edge). §14.5.4.

### csharp-1-reftypes (low)

`emitTypeNode` (`csharp.mts:991-1072`) has no `ref_type` case, so `ref Order F()`, `ref readonly Item G()` and `ref Line l = …` give nothing.

### csharp-1-queryrng (low)

`from_clause` is read for its variable name only (`csharp.mts:829`); its type (`from Row r in xs`) is never emitted. §12.20.3.2.

### csharp-1-fnptrtyp (low)

`function_pointer_type` falls to the default of `emitTypeNode` (`csharp.mts:1068-1070`), so `delegate*<Order, void>` gives nothing.

### csharp-1-filelocl (low)

A file-local type is never published (`csharp.mts:426`), so inside its own file the name falls through to a public type of the same name in another node. The C# 11 file-local types specification lets a file-local type and a public type of one name coexist and has the file-local type win in its file. I read that rule from memory of the feature specification; the sceptic should check it against the published text before this counts.

### csharp-1-refnoout (low)

The reference graph reads `ProjectReference` without its metadata (`csharp-reach.mts:221-245`) and closes references transitively (`csharp-reach.mts:302-321`). A reference with `ReferenceOutputAssembly="false"` (a build-order reference) and one hidden from consumers by `PrivateAssets="all"` both count as visible. The extra reach only loses edges through a false ambiguity (p21: two `Program` classes; p39: a CS0104 set). The file's header says the `PrivateAssets` reading is deliberate; `ReferenceOutputAssembly` is not mentioned.

### csharp-1-compremv (low, regression)

The `Compile` reader (`csharp-reach.mts:261-272`) reads `Include` only. A file under `<Compile Remove="Old/**" />` still declares its types, and the own-project preference of the resolver (`resolver.mts:238-246`, applied at 305) now prefers it over the same type in a referenced project. v1.0.0 gave silence for p22 (an ambiguity); 5227538 gives a false edge to the removed file's node.
