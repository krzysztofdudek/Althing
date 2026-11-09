# 117 · Grain resolves an ambiguous symbol per directory and yg check per node, so references to a declaration split across two directories of one node get lost (grain measure: 0 dependencies; yg check: refusals)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-cjfu
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/relations.mjs, Grain/plugins/grain/engine/measure.mjs, Grain/plugins/grain/engine/arch.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/relations.mjs:327 (dirOwner: the owner is the file's directory), :363 (always `makeResolver({ ownerIndex: { ownerOf: dirOwner(fileSet) }, ... })`), :438 (the full pass) and arch.mjs:134 (the check path), without node owners; measure.mjs:67-69 (snapshotAt: learn() builds model.edges without the graph) and :73-78 (readNodeGraph only afterwards maps the already resolved file edges onto nodes). release/6.1.1 touches neither relations.mjs nor measure.mjs.
**Branch:** jarl/198-relation-type-condition
**Merged:** b21b8d1
**CI:** none

## What
Reproduction (fresh Grain v6.1.0 b70a4e9, yg 6.1.0 from npm, node 24.11.1, own fixtures):

1) C#, a hand-written graph with the nodes app (src/App/), core (src/Core/) and infra (src/Infra/), no relations; `partial class Shop.Core.Money` split across src/Core/Money.cs and src/Core/Parts/MoneyOps.cs. `yg check --full --no-approve` FAIL with relation-undeclared-dependency: src/App/OrderService.cs:7 → core, src/App/RefundService.cs:7 → core and, as a control, src/Infra/TaxStore.cs:7 → core. `grain measure --scope app`: '0 → 0 (of 0 → 0 node pairs with imports)' (JSON: importsOut 0, nodeDependencies 0); `grain export` has one edge (Infra→Tax), relStages seen 12, resolved 1; a measure of the whole repo gives 1 undeclared pair, while yg lists 2 nodes. Control with MoneyOps.cs moved to src/Core/: Grain finds app→core with 6 imports and undeclared [{app→core}], so the trigger is the split across directories.
2) Cause isolated: a copy in which `dirOwner` maps src/Core/** to 'src/Core' (the owner of the core node), with no other change, gives app→core with 6 imports and resolved 4 on this fixture.
3) Beyond the report, on the default path: on the same fixture without a graph, `grain propose` writes a node src/Core with the mapping src/Core/ (so it owns Parts/) and a node src/App with `relations: []` ('no law about dependencies could be mined, 12 references seen, 1 resolved'); the adoption preview says 'would accept' and 'Already broken: not measured'. After `yg adopt`, `yg check --full` FAIL: src/App/*Service.cs:7 → src/Core. The control in one directory proposes `uses src/Core` and passes. Grain's resolution granularity is finer than the granularity of the nodes it proposes itself.
4) Kotlin KMP (expect class in shared/src/commonMain, actual in shared/src/jvmMain, one hand-written node 'shared'): yg rejects app→shared twice, Grain resolves 0 of 2, measure gives 0 pairs. On the propose path Kotlin cuts commonMain/.../core into a separate node, so yg is silent too and check passes: consistent, but blind on both sides.
The same applies to a JVM FQN declared in two directories of one node and to a C# pair `Result`/`Result<T>` split across directories (from the finder's description).

CHANGELOG.md:62 (v6.1.0) documents the directory rule ('the same name in two directories stays unresolved'), and the comment at relations.mjs:321-326 gives the reason (a directory is the smallest component Grain knows), so without a graph this is intended. But the same paragraph and README.md:318-320 promise 'the same fixes Yggdrasil 6.1.0 makes' and 'the same relation code Yggdrasil runs', and the grain-measure/1 contract (docs/reference.md:916) gives undeclaredNodeDependencies as a node-level number with no caveats. Related: 054 (the same measure field, criterion 'count like yg check', but a different cause: declaredVia and coverage.excluded; its fix will not restore these edges) and 051 (the same class of symptom, a different cause).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-4/F2-owner-granularity/repro.log (script repro.sh); verification <the session scratchpad, since lost>/bughunt/grain/verify-53/repro.log (C#, the split versus the control in one directory) and repro-patched.log, repro-propose.log, repro-kotlin.log in the same directory (scripts mk.sh, repro.sh, repro-patched.sh, repro-propose.sh, repro-kotlin.sh).

## Why
When measure, advise or cochange read the graph, and when propose writes it, the node owners are known, yet the result disagrees with yg check: measure gives 0 undeclared dependencies where yg refuses, and an adopted proposal is red right away. Grain errs on the side of silence and never invents a false edge, the trigger is narrow, and yg check names the missing relation precisely, hence minor; the strongest argument for raising it is a red check right after propose → adopt.

## Acceptance
- When Grain measures against a graph (measure, advise, cochange --nodes), it resolves symbol ambiguity by that graph's node owners, as Yggdrasil does.
- propose resolves symbols at the granularity of the nodes it proposes, or discloses the difference where it gives numbers.
- The C# fixture from verify-53: `grain measure --scope app` gives the app→core dependency with 6 imports, and propose without a graph gives src/App with `uses src/Core`, after whose adoption `yg check --full` passes.

## Changelog
- Fixed: grain measure and grain propose now say how many references they left unresolved because the name they use is declared in more than one folder (a partial class split across folders, for example), instead of reporting a silent zero where yg check refuses the import.

## Evidence

commit 8f1e849 on jarl/198-relation-type-condition; tests/unresolved-references-reported.test.mjs red before (to.unresolvedReferences undefined; propose line without a count) → green 3/3: C# partial Money split over src/Core and src/Core/Parts, measure --scope app: nodeDependencies 0, unresolvedReferences 4 (yg check refuses OrderService.cs:7 and RefundService.cs:7 → core); control in one directory: 1 dependency, 0 unresolved; propose line '7 references left unresolved ...', export relStages.ambiguous 7. Needs: MODEL_V. Per ruling grain-scope no node-level re-resolution.

docs: docs/reference.md: grain-measure/1 add field unresolvedReferences; export relStages add ambiguous
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2288, pass 2286, fail 0, skipped 2 (the relation-ancestor-type parity test skips on the gate's yg 6.1.0), merge b21b8d1

