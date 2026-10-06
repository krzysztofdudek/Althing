# 259 · Compatibility: the family's 6.2.0 plugins install together and their MCP servers start (Claude Code, Codex, Cursor, Copilot)

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** compatibility, plugins, workspace
**Files:** Althing/workspace/checks/plugins.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**
**After:** 275

## What
Every tool has plugin manifests and an MCP server; the version bump in 224 touches five manifests per repository. Nobody checks that the whole family installed together works.

## Why



## Acceptance
On a clean environment: the Yggdrasil, Grain, Jarl and Horde plugins at version 6.2.0 installed together; every MCP server starts and answers a help call; the versions in the manifests consistent; the result recorded before the tags.

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

