# 021 · A node whose yg-node.yaml does not parse disappears from tree, context, impact, log add, owner and find as 'not in the graph' (together with its healthy children), and next: leads the agent into a dead-end loop or into creating a duplicate

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/tree.ts, Yggdrasil/source/cli/src/cli/build-context.ts, Yggdrasil/source/cli/src/cli/impact.ts, Yggdrasil/source/cli/src/core/log/log-add.ts, Yggdrasil/source/cli/src/cli/find.ts, Yggdrasil/source/cli/src/cli/owner.ts, Yggdrasil/source/cli/src/formatters/context-file.ts, Yggdrasil/source/cli/src/cli/output.ts, Yggdrasil/source/cli/src/core/graph-loader.ts, Yggdrasil/source/cli/src/core/validator.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** the commands look only at graph.nodes, never at graph.nodeParseErrors: cli/tree.ts:83-86 (--root), :121, :124 ('no nodes yet'); cli/build-context.ts:59-62 (collectRelevantNodePaths is empty for a node outside graph.nodes, so the yaml-invalid guard :100-121 and :680-694 does not work; :744-746 node-not-found); cli/impact.ts:119-120; core/log/log-add.ts:39-48; cli/find.ts:109; cli/owner.ts:544; formatters/context-file.ts:14; cli/output.ts:197-199 (nodeNotFound with no access to the graph); the loader core/graph-loader.ts:305-318 (does not descend into the children of a broken node); ready-made logic in core/validator.ts:313-329
**Branch:** jarl/021-navigation
**Worker:** ygg-021-navigation
**Worktree:** /home/node/wt/021-navigation
**Since:** 2026-10-05 13:00

## What
Reproduction (clone v6.1.0 e5441101, npm ci + tsup): .yggdrasil/model/payments/yg-node.yaml with one typo ('mappings:' instead of 'mapping:'). `yg check`: yaml-invalid correctly, with the line 'partial:'. The other commands do not mention the broken file: `yg tree`: 'no nodes yet … next: yg knowledge read onboarding (how to map existing code)'; `yg context --node payments`: `error[node-not-found]: node 'payments' is not in the graph — why: The --node path must name an existing node — a directory under .yggdrasil/model/` (the directory exists), next: yg find "payments"; `yg find payments`: 'No matches. next: run yg tree', which leads back to 'no nodes yet'; `yg impact --node payments` and `yg log add --node payments` ('the node must exist first') the same; `yg owner --file src/payments/pay.ts`: 'No node maps this file'; `yg tree --root payments`: node-not-found. The verifier's variant (a YAML syntax error instead of a schema one, a healthy neighbour, a healthy child payments/refunds): the child also disappears from tree, tree --json, context --node, find and impact (only check reports it as node-unreachable), and `yg context --file src/payments/pay.ts` advises 'to give this file a component of its own, add a yg-node.yaml mapping it', although one exists. The matching logic (exact path or ancestor prefix) against nodeParseErrors is in core/validator.ts:313-329, but it is unreachable from the CLI, because every call to validate() gets 'all', and `yg check --node` does not exist. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-18/logs/V18-broken-node-invisible.log (script repro.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-18/logs/V18-broken-node-variant.log (repro2.sh).

## Why
The trap appears in the middle of a session: the agent edits yg-node.yaml, makes a typo and checks the effect through context, tree or find. The next: lines in at least five commands are wrong, and two of them push the agent to onboarding or to creating a duplicate of a node that already exists. The code shows that the intent is to surface this (context already refuses on yaml-invalid and node-unreachable through CONTEXT_CHANGING_CODES); only the case where the node being asked about is the broken one is missing. Enforcement stays correct (check is red).

## Acceptance
- When a node path points at a directory whose yg-node.yaml (or an ancestor's yg-node.yaml) did not load, context --node, impact --node, log add --node and tree --root report yaml-invalid with the file name and the parse problem, and next: edit this file.
- `yg tree` marks the nodes that did not load instead of 'no nodes yet'; `yg owner` and `yg context --file` do not advise adding a yg-node.yaml when the mapping file exists but is broken; `yg find` points to the broken node.

## Changelog
- Fixed: a component whose yg-node.yaml does not load is named, not reported missing — yg context/impact/log add --node and yg tree --root answer yaml-invalid with the file and the parser's reason, yg tree lists it as [not loaded], yg find warns it cannot search it, and yg owner/context/impact --file make fixing that file the step instead of advising a mapping.

## Evidence


