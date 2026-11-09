# 065 · A relation declared to an ancestor of the imported node bypasses the architecture's allow-list: an import the architecture forbids (api → db) passes yg check

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0754-bwoa
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/relations/verifier.ts, Yggdrasil/source/cli/src/relations/pass.ts, Yggdrasil/source/cli/src/templates/knowledge/ports-and-relations.ts, Yggdrasil/docs/relations-flows-ports.md, Yggdrasil/source/cli/tests/unit/relations/verifier.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/relations/verifier.ts:17 `if (g.parentChain(m).some((anc) => declared.has(anc))) continue;` (a sanction through an ancestor without checking the type of the node the imported file belongs to); RelationGraphView from pass.ts:750-773 (makeGraphView) has no types or architecture; pass.ts:833 (addTypedEdges) deliberately excludes node → node edges from the type gate; core/checks/architecture.ts:490/504 (relation-target-forbidden) checks only the target type of a declared relation
**Branch:** jarl/065-relations
**Merged:** 265c4c6bad023e410ee20c6a60dec39de17e7a91
**CI:** none

## What
Architecture: type api with relations {default: deny, uses: [facade]}, type facade (src/data/*.ts), type db (src/data/db/**). Nodes: api (src/api/), data (type facade, src/data/index.ts), data/db (type db, child of data, src/data/db/). src/api/orders.ts imports '../data/db/conn'. Results (fresh clone of v6.1.0 built locally, each case in a new directory, no reviewer): (1) no relation: relation-undeclared-dependency 'no relation type is allowed from api to db ... none can be declared', exit 1; (2) relation `{target: data/db, type: uses}`: relation-target-forbidden, exit 1; (3) relation `{target: data, type: uses}` (ancestor, allowed type), import unchanged: `yg check: PASS  3 nodes · 3/3 files covered`, exit 0, `--json` 0 errors, and `yg owner` confirms that src/data/db/conn.ts belongs to data/db (coverage.type_level true, the init default); (4) the same import after the data/db node is removed (the file covered by its type): type-relation-forbidden, exit 1, and fix #2 of that refusal ('Graduate the target: create an explicit node for the imported code with a curated relation') leads straight to the bypass. A stronger case on the flagship example from the README, examples/layered-architecture (architecture comment: handler 'cannot reach persistence by any means'): moving only the data node's yg-node.yaml under model/domain/data and repointing the domain relation to domain/data, without changing the web relation and without changing yg-architecture.yaml; adding the import the README forbids, `import { findRide } from '../data/rideRepository.js'`, to src/web/rideHandler.ts gives `yg check: PASS`, exit 0 (the existing, allowed relation `calls domain` sanctions the import of a repository-type node); the control without rearranging the graph fails with relation-undeclared-dependency, as in the README. `yg knowledge read ports-and-relations` teaches this move: 'The relation may target the depended-on node OR any of its ancestors'. The test tests/unit/relations/verifier.test.ts ('a relation to an ancestor of the target sanctions the dep') has no types. This is not 325, 414, 365 or 419 of 6.1.0, nor anything from 001-033 here; verifier.ts and pass.ts are unchanged from v6.1.0 to main 2493aa16. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-33/verify-33-ancestor-relation-bypass.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-33/repro-ancestor.sh); issue as filed <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/find-9-ancestor-relation-bypass.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/repro/ancestor-relation-bypass.sh.

## Why
This is a silent false PASS of the free, keyless and always-blocking architecture boundary, and on the first rule in the README ('The API layer must never import the database module. Enforce it.'), which is one node move away from being bypassed. docs/relations-flows-ports.md:67 requires a structural type the architecture allows 'between the two node types', :111 promises that the type gate checks every import between classified ends, and the why of the type-relation-forbidden refusal says the allow-list 'governs every dependency between classified files'. Nesting a node of a forbidden type under a node of an allowed type is legal and natural (src/data/db under src/data).

## Acceptance
- A dependency on a file that belongs to node M is sanctioned by a relation to an ancestor of M only when the architecture allows a structural relation type from the importer's type to M's type; otherwise yg check blocks (relation-undeclared-dependency with no relation to declare, or type-relation-forbidden), exit 1, in case 3 of the repro and in the rearranged examples/layered-architecture.
- A unit test of the verifier with types: a sanction through an ancestor passes when the descendant's type is allowed, and refuses when it is not; templates/knowledge/ports-and-relations.ts:100 and docs/relations-flows-ports.md:67 describe this condition.

## Changelog
- Before you upgrade: a relation to a parent component no longer sanctions an import of a nested component whose type the architecture forbids the importer; such an import now fails yg check with relation-undeclared-dependency (remove it or change the architecture).

## Evidence

Ruling ask-001 (stop): the owner chose the option 'Blocking right away (Recommended)' (translated from Polish; the option's label, not his words): fixes that close false greens (065 and the new edges of the Runes extractors) go into 6.1.1 as blocking, with a 'Before you upgrade' section in the CHANGELOG; Grain 054 gets the same type condition as 065.
- **ran (history):** git commit (merge of jarl/065-relations into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8076 pairs verified; [repo-check] All checks passed; [release/6.1.1 265c4c6ba] Merge jarl/065-relations

