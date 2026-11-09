# 294 · Grain: the name-shape rules count files in fixture folders that carry their own .yggdrasil, which yg treats as nested projects and skips, so announced counts exceed what yg check --full refuses

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2055-ngej
**Tags:** grain, minor
**Files:** Grain/plugins/grain/engine/propose-nodes.mjs, Grain/plugins/grain/engine/config.mjs
**Repo:** ../../../Grain
**Found by:** fresh-reviewer
**Where:**

## What
On Yggdrasil's own repository, the name-shape rule on tests/fixtures announces 72 declarations and yg check --full refuses 4: Grain counts the files of 52 fixture folders that carry their own .yggdrasil, and yg treats those as nested projects and does not check them. The advisory file-name rule shows the same gap (67 announced, 2 refused). Grain already leaves nested projects out of nodes (engine/propose-nodes.mjs:85-97) and issue 054 did the same for measure; the name-shape population does not.

## Why
The announced count is meant to agree with what yg check --full shows after adoption; 003 aligned the node types but its corpus run on Yggdrasil still differs for this population reason.

## Acceptance
- On Yggdrasil's own repository every rule's announced count equals the count yg check --full refuses (corpus run recorded as evidence).
- A test with a fixture folder that carries its own .yggdrasil: the name-shape rule counts it before the fix (red) and leaves it out after (green), for the method-name rule and the file-name rule.

## Changelog
- Fixed: name-shape rules no longer count files inside a nested project (a folder with its own .yggdrasil), which yg check does not read, so the number a rule announces agrees with what the check refuses.

## Evidence

