# 130 · propose --shape types says 'no law about dependencies could be mined' and relations: 0, though it writes the same type relations as the nodes shape

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/propose-report.mjs, Grain/plugins/grain/engine/propose-write.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/propose-report.mjs:52 `const edges = r.nodes.reduce((a, n) => a + n.relations.length, 0);` counts relations over nodes only; this count feeds the --json field `architecture.relations` (:102) and the text line (:141), which at zero falls back to 'no law about dependencies could be mined (…)'; in the types shape `typesNeedingNodes(active)` (propose-write.mjs:295) gives a node only to a type nested in another (on the fixture, to none), while the type relations still go to yg-architecture.yaml through buildRelations (:286) and `relations: relBlock` (:169). The same :52 and :141 on release/6.1.1.
**Branch:** jarl/045-types-shape
**Merged:** f1c29c3
**CI:** none

## What
Reproduction (fresh clone of github.com/krzysztofdudek/Grain v6.1.0, ae6152f; synthetic fixture from tests/fixtures/build-fixture.mjs; Yggdrasil 6.1.0 from PATH; script verify-68/repro.sh):
- Default shape: `grain propose ../prop-nodes` prints '8 nodes · 6 relations'.
- Types shape: `grain propose ../prop-types --shape types --json ../prop-types.json` prints '0 nodes · no law about dependencies could be mined (179 references seen, 179 resolved, 179 survived the module cut)'. The line contradicts itself: 179 references survived the cut, yet nothing could be mined. The `architecture` block in --json has `relations: 0` (in the nodes shape, 6).
- Written graphs: the `relations:` blocks in both yg-architecture.yaml files are identical and hold 6 `uses` targets on 5 types: src-dto→src-core, src-guards→src-core, src-handlers→src-core and src-services, src-services→src-core, test-handlers→src-handlers. proposal.json in both runs has 5 evidence rows of kind `relations`.

A side observation, a separate and probably more serious defect, not verified as a finding: a naive fix should not print '6 relations', because under Yggdrasil 6.1.0 the type relations from the types shape block nothing. After adopting both proposals, committing, and adding an import from src/dto into src/handlers (src-dto may use only src-core): in the nodes shape `yg check --no-approve --full` FAIL with `relation-undeclared-dependency` (exit 1), in the types shape PASS (exit 0, 0 nodes, 153 files covered by a type). side-deny.log shows why: Grain writes `uses: [...]` without `default: deny`, and according to Yggdrasil's docs/relations-flows-ports.md a missing default makes the type relation gate let everything through; a hand-added `default: deny` on src-dto fires `type-relation-forbidden`. The type description Grain writes ('`yg check` refuses a dependency on any other node until the architecture declares it', propose-write.mjs:160) is false in the types shape, and 'no law about dependencies' is true in effect, only for the wrong reason. Related but different: 045 (dead enforced aspects in the types shape).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-9/f9-types-relations/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-68/repro.log (and side-deny.log in the same directory).

## Why
docs/reference.md (the propose row) says that `--shape types` 'writes the same node types, `when`s, relations and rules as the default `--shape nodes`'. The report contradicts the documentation and the file it wrote itself, and tells the maintainer that no dependency law was mined. This affects only the report (text and --json), the written graph does not change, and the shape is opt-in, hence minor.

## Acceptance
- The text report and `architecture.relations` in the --json of the types shape count the type relations written to yg-architecture.yaml, and the line does not say 'no law about dependencies could be mined' when propose writes a `relations:` block.
- The types-shape report does not claim that type relations are enforced by `yg check` until the written relations carry `default: deny` (or a separate issue settles that matter).

## Changelog
- Fixed: with `--shape types`, the report counts the dependency relations written between types instead of saying none could be mined, and says plainly that they block nothing unless a type carries `default: deny`.

## Evidence

red->green: tests/propose.test.mjs '--shape types: the report counts the type relations written…' fails before (report said 'no law about dependencies could be mined', relations 0), passes after: architecture.relations = 1 = uses in yg-architecture.yaml, text says no type carries default: deny so yg check refuses nothing on their account; with YG_BIN, adopt + planted util->api import -> check --full exit 0, and the same with default: deny -> type-relation-forbidden. Build-fixture types shape now '6 relations (6 between types; no type carries default: deny …)', JSON relations 6 (was 0). javapoet: '4 relations (2 between types, 2 between nodes; …)'. Type descriptions without node and deny no longer say yg check refuses.

docs: docs/reference.md: grain propose --json architecture block — in --shape types 'relations' = type relations + node relations; new additive 'typeRelations' and 'typesWithDeny'; proposal.json counts gain typeRelations/typesWithDeny
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2082, pass 2081, fail 0, skipped 1, merge f1c29c3

