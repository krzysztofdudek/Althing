# 198 · Grain measure: the same type condition as Yggdrasil 065 (a relation to an ancestor permits an import only for an allowed target type)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** grain, measure
**Files:** Grain/plugins/grain/engine/measure.mjs
**Repo:** ../../../Grain
**After:** 054, 065
**Found by:** owner-a-001
**Where:**
**Branch:** jarl/198-relation-type-condition
**Merged:** b21b8d1
**CI:** none

## What
The owner chose the blocking variant for 065 (a-001). After 065 Yggdrasil accepts a relation to an ancestor only when the architecture allows the target type; undeclaredDependency in Grain (after 054) must apply the same condition, otherwise measure will understate the number of undeclared dependencies.

## Why
Grain and yg check are to count the same undeclared dependencies.

## Acceptance
On a scratch graph with a relation to an ancestor and a forbidden target type, measure counts the same as yg check after 065; a test with YG_BIN built from Yggdrasil's release/6.1.1.

## Changelog
- Fixed: grain measure, advise and the edit-time boundary check now treat a relation to a parent component as covering a nested component only when the architecture allows a dependency on that component's own type, the same way yg check reads it from this release on.

## Evidence

commits cd0e8b9 + 9431bda on jarl/198-relation-type-condition; tests/relation-ancestor-type.test.mjs red before (undeclaredDependency app→lib/secret false; measure undeclared [] vs yg 065 ['app>lib/secret']; declaredVia 'ancestor-relation'; boundary conflicts non-empty) → green 6/6 with YG_BIN = yg built from Yggdrasil c0d63eb4f (065); the parity test skips on a yg without 065 (probe of the ports-and-relations knowledge text). measure-undeclared-like-yg parity also green on yg 065. Propose declares relations only to the owner node, never via an ancestor: no change needed.

docs: docs/reference.md: advise kind: relation 'ancestor-relation' and grain-measure/1 undeclaredNodeDependencies — a relation to an ancestor counts only where the architecture lets the two nodes' own types relate structurally

orchestrator: Grain's final pass must run the gate with YG_BIN built from Yggdrasil release/6.1.1 (with 065), so that the relation-ancestor-type parity test really runs instead of being skipped.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2288, pass 2286, fail 0, skipped 2 (the relation-ancestor-type parity test skips on the gate's yg 6.1.0), merge b21b8d1

