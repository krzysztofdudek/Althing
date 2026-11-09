# 259 · Compatibility: the family's 6.2.0 plugins install together and their MCP servers start (Claude Code, Codex, Cursor, Copilot)

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1855-tsbt
**Tags:** compatibility, plugins, workspace
**Files:** Althing/workspace/checks/plugins.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**
**After:** 312

## What
Every tool has plugin manifests and an MCP server; the version bump in 224 touches five manifests per repository. Nobody checks that the whole family installed together works. Amended under the ruling jarl-release-alone-with-every-jarl-issue and the architect's scope review of 2026-10-18 (section 1, Q8): Jarl ships alone, so its half runs first and directly, before Jarl's tag (313): Jarl 6.2.0's plugin, built from the release tip, installs and its MCP server answers in Claude Code, Codex, Cursor (the 6.1.1 manifest fix kept) and Copilot, beside the installed 6.1.x family, each run with an explicit timeout and recorded as a --ran/--saw row here. The issue stays open for the family release, where the whole family at 6.2.0 is installed together once 275 has built the environment; that later run waits on 275, which is why 275 is no longer on this issue's After line.

Ruling backlog-tidy-for-the-three-tools: Jarl 6.2.0 and 6.3.0 are published, so Jarl's half is settled, and the family run no longer waits on 275.

## Why



## Acceptance
[read] On a clean environment the Yggdrasil and Grain plugins at 6.2.0 install together with the current Jarl plugin, every MCP server starts and answers a help call, the versions in the manifests are consistent, and the result is recorded before the tags

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

