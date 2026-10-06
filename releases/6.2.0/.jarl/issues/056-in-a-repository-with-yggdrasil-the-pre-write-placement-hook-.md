# 056 · In a repository with Yggdrasil, the pre-write placement hook steers a new graph node (yg-node.yaml) to the test fixtures (6.1.0 regression)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/placement.mjs, Grain/plugins/grain/engine/config.mjs, Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/cards.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/config.mjs:180 HARD_EXCL with `|^\.yggdrasil(\/|$)` (commit 301cccd, tag v6.1.0; v6.0.0 :152 without it); arch.mjs:315 `model.pathsAll = tree.allPaths.filter(p => !HARD_EXCL.test(p))`; placement.mjs:163-165 placementHit reads model.pathsAll, fallback ~:219-233 (threshold 0.8); grain.mjs:148 (check-hook --pre) and cmdCheck call placementHit without a HARD_EXCL test on the path itself (reviewFileList grain-check.mjs:512 and repoDirty grain-context.mjs:343 do filter)
**Branch:** jarl/049-where-cards
**Merged:** d46e9f3
**CI:** none

## What
Reproduction (Grain ae6152f = 6.1.0, fresh clone of krzysztofdudek/Yggdrasil @2493aa16): `grain refresh` (211 s); the exact PreToolUse/Write command from plugins/grain/hooks/hooks.json with a Claude Code payload, file_path `.yggdrasil/model/cli/commands/export/yg-node.yaml` (the directory does not exist yet; the clone tracks 498 yg-node.yaml under .yggdrasil/model/) → additionalContext '[grain] placement: 331 of 371 `*.yaml` files live under `source/cli/tests/fixtures/`; this one is outside it (`.yggdrasil/model/cli/commands/export/`). Deliberate is fine — if you guessed, look there first.' The same for `.yggdrasil/aspects/new-aspect/yg-aspect.yaml`. The SessionStart hook in the same clone: 'This repository runs Yggdrasil; read `yg prime` before changing code, and ask grain where a change belongs'. Numbers: 964 tracked *.yaml, 593 under .yggdrasil/, 371 outside, 331 of them under source/cli/tests/fixtures/ (0.89, above the 0.8 threshold); pathsAll has 2175 entries and none under .yggdrasil/. A placementHit probe: on the built model, the fixtures note for yg-node.yaml, yg-aspect.yaml, flows/*/yg-flow.yaml, `.yggdrasil-proposal/…/yg-node.yaml` and even `.grain/decisions/new.yaml`; with the graph restored to pathsAll (as in 6.0.0), silence. Further effects: after the node is written where yg prime says, placement-outcomes.json has {"followed":0,"deviated":1}, and `grain status` says 'placement notes followed: 0 of 1 (0%)'; the CLI `grain check` on the new node gives the same note plus 'in: .yggdrasil/model/ does not exist yet — nearest existing: the repo root' (cards.mjs ~419-420). That 6.0.0 was silent was shown by simulating pathsAll, without rebuilding a 6.0.0 index. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-23/logs/03-pre-write-new-node.log and 01, 02 and 04-08 in that directory.

## Why
The note fires on the family's core path: an agent adds graph nodes in a repository that uses both Grain and Yggdrasil. It actively steers to the test fixtures, and the placement statistic Grain reports about itself counts a correct write as a deviation. Excluding the graph in 6.1.0 was only meant to stop drill corpora from being mined as code (the commit message, the config.mjs comment).

## Acceptance
- placementHit (and placement in check) is silent for a path matching HARD_EXCL (.yggdrasil/, .yggdrasil-proposal/, .grain/), and the check locator does not say 'does not exist yet' about an existing graph directory.
- The Yggdrasil clone from the reproduction: the PreToolUse Write hook for `.yggdrasil/model/cli/commands/export/yg-node.yaml` and `.yggdrasil/aspects/new-aspect/yg-aspect.yaml` returns no placement note; a test in tests/ for a path under .yggdrasil/.

## Changelog
- Fixed: in a repository that also uses Yggdrasil, writing a new graph file such as a node or aspect no longer gets a note pointing it at the test fixtures, and `check` no longer says the graph folder does not exist yet.

## Evidence

5d9f995: placementHit and locationForFile return null for a HARD_EXCL path. tests/placement-graph-paths.test.mjs red (pre-write note '12 of 12 *.yaml under tests/fixtures/' on yg-node.yaml) → green 3/3, control config/new-settings.yaml still noted. Yggdrasil clone @2493aa16 refreshed with the branch: PreToolUse Write for .yggdrasil/model/cli/commands/export/yg-node.yaml and .yggdrasil/aspects/new-aspect/yg-aspect.yaml → no output; config/new.yaml → the 331-of-371 note (control).
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2157, pass 2156, fail 0, skipped 1, merge d46e9f3 (second full run; the first failed only the timing-sensitive MCP SIGINT test, which passed alone)

