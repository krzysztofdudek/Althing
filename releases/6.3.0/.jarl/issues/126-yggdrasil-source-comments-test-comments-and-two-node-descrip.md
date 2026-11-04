# 126 · Yggdrasil: source comments, test comments and two node descriptions still name Horde as a live consumer

**Status:** open
**Kind:** cleanup
**Priority:** 3
**Tier:** standard
**Tags:** family, horde
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** reviewer-horde-removal
**Where:** source/cli/src/formatters/aspects-health-json.ts:11, drill-json.ts:5, suppressions-json.ts:4, cli/log.ts:497, cli/owner.ts:174 and 281; tests/e2e/cli-other-worktree.test.ts:8 and 29, cli-suppressions-json.test.ts:4, cli-port-fields-removed.test.ts:6, cli-architecture-relation-defaults.test.ts:270; .yggdrasil/model/cli/core/fill/yg-node.yaml:109, .yggdrasil/model/cli/tests/e2e/other-worktree/yg-node.yaml:24

## What
Horde left the family on 2026-11-04 (ruling horde-leaves-the-family). Yggdrasil's main carries the new README, AGENTS.md and contracts page, but these comments and two node descriptions still say, in the present tense, that Horde reads a document or rests on a guarantee. The family-guard name list and the synthetic fixtures of family-contracts-invariant are test data and stay.

## Why
A public repository that describes a consumer that no longer exists misleads its next reader, and a node description is the graph's own account of the code (ruling architecture-descriptions-kept-true).

## Acceptance
- Each listed comment says what the document or guarantee is for without naming Horde, or is a dated note of history
- The two node descriptions say what holds today; yg check is green after the reviews they reopen
- Yggdrasil's suite is green

## Evidence

