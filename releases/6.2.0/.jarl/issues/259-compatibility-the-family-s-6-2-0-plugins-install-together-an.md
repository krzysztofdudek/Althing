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

## Why



## Acceptance
- Jarl's half, before 313's tag: on each of the four hosts, Jarl 6.2.0's plugin installs beside the installed 6.1.x family and its MCP server starts and answers jarl_help, recorded as a --ran/--saw row per host
- On a clean environment: the Yggdrasil, Grain, Jarl and Horde plugins at version 6.2.0 installed together; every MCP server starts and answers a help call; the versions in the manifests consistent; the result recorded before the family's tags; the issue closes only after this

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

