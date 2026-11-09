# 054 · grain measure counts 'undeclared dependencies between nodes' by different rules than yg check: a reverse relation, an ancestor relation and an event relation count as declaring an import, and imports to paths in coverage.excluded count as undeclared

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-vuvs
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/measure.mjs, Grain/plugins/grain/engine/grain-advise.mjs, Grain/plugins/grain/engine/yggdrasil-graph.mjs, Grain/docs/reference.md
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/measure.mjs:79 (snapshotAt, `!declaredVia(g, a, b)`) and :145 (the scopeMetrics fallback) call declaredVia from grain-advise.mjs:114-124 (symmetric on :116, any relation type, a relation between any ancestors of both ends on :121); readNodeGraph grain-advise.mjs:72-97 (:80) builds ownerOf through expandMapping (yggdrasil-graph.mjs:385), which ignores coverage.excluded and the boundaries of nested projects
**Branch:** jarl/054-measure-advise-like-yg
**Merged:** 944e8fd
**CI:** none

## What
Reproduction (Grain tag v6.1.0 b70a4e9, yg 6.1.0, node 24.11.1). Fixture 1: the children of the app group (billing, shipping, orders and okay) import util; util declares `calls` billing (in the reverse direction), the parent app declares `uses` util, orders declares `emits` util, and util `listens` orders; okay declares `uses` util (control). `yg check --full` FAIL with relation-undeclared-dependency for app/billing, app/orders and app/shipping (for orders: 'The declared emits relation to it does not count'), not for okay. `grain measure --from from --to to` → 'dependencies between nodes the graph does not declare: 0 → 0 (of 0 → 4 node pairs with imports)', JSON undeclaredNodeDependencies 0, graphAtCommit true; across the three nodes 0 of 3, where it should be 3. Fixture 2: coverage.excluded contains src/lib/vendored/, app imports src/lib/vendored/pad.ts; `yg check --full` PASS ('1 excluded'), while measure gives undeclaredNodeDependencies 1, undeclared [{from: app, to: lib}]. Fixture 3: a nested Yggdrasil project in src/lib/sub/ with its own .yggdrasil/, app imports a file from it; yg check PASS, Grain counts 1 undeclared app→lib. The broad, symmetric 'declared' (relation, ancestor-relation, containment) is documented and intended only for undirected co-change pairs in `advise` (reference.md:812-813, grain-advise.mjs:100-113); the measure contract (reference.md:897), the CLI help and the 6.1.0 CHANGELOG speak of directed {from, to}. Grain's own oracle.mjs:574 filters coverage.excluded. The tests (tests/architect-commands.test.mjs:249, 304-308) cover only a plain own relation. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-21/repro.log, repro-nested.log (scripts repro.sh, mk1.sh, mk2.sh, repro-nested.sh).

## Why
The field is part of the published grain-measure/1 contract, and the Horde report reads it for clients. It is wrong in both directions: it hides imports yg check rejects (when an end is red, in progressive mode, with --from before the declaration), and it invents undeclared dependencies to excluded or nested paths in an entirely green repository.

## Acceptance
- undeclaredNodeDependencies counts the way yg check does: direction, only structural types (calls, uses, extends, implements), only relations of the source node itself, to the target or its ancestor, hierarchy exempt, and file ownership skips coverage.excluded and nested projects; declaredVia for co-changes in advise stays unchanged.
- Fixtures 1-3 from the reproduction: measure gives 3, 0 and 0 undeclared dependencies respectively, in agreement with yg check --full.

## Changelog
- Fixed: `grain measure` counts the dependencies between places the graph does not declare the way `yg check` does: only the importing place's own relations count, and an event relation or a relation in the other direction does not; `grain measure`, `grain advise` and `grain cochange --level node` no longer count a file the graph excludes, or one inside a nested project, as any place's.

## Evidence

- **ran (history):** YG_BIN=<frozen 6.1.0> node --test tests/measure-undeclared-like-yg.test.mjs, release/6.1.1+101 (35a70b8) vs cb7bb0c · **saw:** before: 6 of 6 fail (fixture 1 measure 0 undeclared where yg check --full --json refuses app/billing>app/util, app/orders>app/util, app/shipping>app/util; fixture 2 and 3 files owned by lib; a nested .git not a boundary; undeclaredDependency missing); after: 6 of 6 pass, measure gives 3, 0, 0 and the pairs equal yg check's relation-undeclared-dependency edges on all three fixtures (<the session scratchpad, since lost>/patch-611/grain-054/054-red.log, 054-green.log)
- **ran (history):** on a clone of Yggdrasil 2493aa16: readNodeGraph(.) ownerOf vs yg owner --files <all 3379 tracked files> (<the session scratchpad, since lost>/patch-611/grain-054/owner-vs-yg.mjs) · **saw:** release/6.1.1: 745 files differ (nested example projects owned by node examples); cb7bb0c: 3379 of 3379 agree (<the session scratchpad, since lost>/patch-611/grain-054/054-owner-vs-yg-yggdrasil.log)

docs: docs/reference.md, grain-measure/1 field paragraph (:916): undeclaredNodeDependencies counts the pairs yg check would refuse as undeclared — the importing node itself declares no calls/uses/extends/implements relation to the imported node or an ancestor of it, and neither node is an ancestor of the other (event relations, a relation in the other direction and a relation on an ancestor of the importing node do not count); a file under coverage.excluded or inside a nested project (own .yggdrasil/ or .git) belongs to no node.

Yggdrasil 065 (open): Grain mirrors 6.1.0's rule, where a relation to an ancestor of the imported node sanctions the import whatever the imported node's type. If 065's fix lands (the ancestor leg holds only when the architecture allows a structural relation from the importer's type to the imported node's type), measure's count would undercount by exactly the imports that 065 turns red: the ancestor leg in undeclaredDependency would need the same type check against yg-architecture.yaml (the node types are on readNodeGraph's nodes already; raw.arch is read by readGraph).
- **ran (history):** YG_BIN=…/grain-611/ci/yggdrasil (6.1.0) HORDE_DIR=… GRAIN_CORPUS_CLONES=… npm test at 591a6a3 (branch jarl/054-measure-advise-like-yg) · **saw:** 1985 tests, 1984 pass, 0 fail, 1 skipped (the Windows-only GNU tar test), exit 0

jarl: depends on the answer to a-001 — if 065 lands as blocking, undeclaredDependency in Grain gets the same type condition (a relation to an ancestor sanctions an import only for an allowed target type); otherwise measure will undercount by exactly those imports

jarl: the boundary promotion stays as in 6.1.0 — when counting files without an owner, the boundary skips files in coverage.excluded and nested projects (which yg check does not look at anyway), so 054 does not change what the user sees in advise, decide list and the flag at edit time; file ownership in measure, advise and cochange --level node, consistent with yg owner, stays
- **ran (history):** round 2: node --test tests/measure-undeclared-like-yg.test.mjs at 591a6a3 (+ the two new tests) vs d3338d6 with YG_BIN · **saw:** before: 2 new tests fail (ui/db repro: boundaries.promoted 0, a 'belong to no node' draft; cochange --nodes gen: 'nothing tracked matches `gen`'); after: 8 of 8 pass — promoted 1, no boundary draft, grain check on src/ui/extra.ts flags no boundary-decision, yg check exits 1 refusing ui → db; cochange says '`gen` owns no file the graph covers: the 1 file its mapping selects is under coverage.excluded or inside a nested project' (<the session scratchpad, since lost>/patch-611/grain-054/054r2-red.log, 054r2-green.log)
- **ran (history):** YG_BIN=… HORDE_DIR=… GRAIN_CORPUS_CLONES=… npm test at d3338d6 · **saw:** 1987 tests, 1986 pass, 0 fail, 1 skipped (Windows-only), exit 0 (<the session scratchpad, since lost>/patch-611/grain-054/full-gate-r2.log)
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2041, pass 2040, fail 0, skipped 1, merge 944e8fd

