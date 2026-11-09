# 079 · An empty 'relations:' key on a node type in yg-architecture.yaml gives a raw JS error 'Cannot convert undefined or null to object' without the type or key name, and the whole architecture fails to load

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-ckrl
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/architecture-parser.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/architecture-parser.ts:182 catches only undefined; :186 `if (typeof relationsRaw !== 'object' || Array.isArray(relationsRaw))` lets null through (typeof null is 'object'); :193 `Object.entries(relationsRaw)` throws a TypeError; core/graph-loader.ts:251-268 puts `(error as Error).message` in as the `what` of the architecture-invalid error
**Branch:** jarl/079-singletons
**Merged:** b446e32fab2fe73581bfda4eb599a5a9da921277
**CI:** none

## What
Reproduction (npm @chrisdudek/yg@6.1.0, a fresh clone for the source; the file is the same on v6.1.0 and main 2493aa16; a new repo from `yg init`, one node service mapping src): Case A, `relations:` with its only entry commented out: exit 1, `error[architecture-invalid] Cannot convert undefined or null to object` and 'partial: yg-architecture.yaml did not load, so no architecture rule was checked'; the fix says 'Correct what the message above names in yg-architecture.yaml', and the message names nothing. Case B, an explicit `relations: ~`: the same. Controls on the same project: empty `aspects:` and `parents:` → PASS (null treated as absent); `relations:` with an empty `uses:` → 'node_types.library.relations.uses must be an array'; `relations: 5` → 'node_types.library.relations must be an object'; `relations: {}` → PASS; empty `when:`, `log_required:` and `enforce:` give an error naming node_types.library.<key> (side note: for null, log_required says 'got object'). `yg schemas read architecture` describes relations as an optional mapping and says nothing about null. No hits in the 6.1.0 and 6.1.1 issues. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-48/logs/relations-null.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-48/repro.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/logs/F6-arch-relations-null.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/F6-arch-relations-null/repro.sh.

## Why
Commenting out the only entry under a key is an ordinary edit, and the tool does not say which of many node types caused it; the user has to bisect for an error that switched off the whole architecture. It fails closed (exit 1, nothing passes silently), so minor.

## Acceptance
An empty `relations:` and `relations: ~` are treated as absent (consistent with aspects and parents) or refused with the message 'node_types.<type>.relations must be a mapping (got null)'; no architecture error comes out as a raw TypeError (a parser test for null).

## Changelog
- Fixed: an empty relations: on a node type (only entry commented out, or relations: ~) reads as absent instead of failing the whole architecture with a raw 'Cannot convert undefined or null to object'; an empty log_required: is refused as 'got null'.

## Evidence

- **ran (history):** git commit (merge of jarl/079-singletons into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8117 pairs verified; coverage branches 90.2%; [repo-check] All checks passed; [release/6.1.1 b446e32fa] Merge jarl/079-singletons

