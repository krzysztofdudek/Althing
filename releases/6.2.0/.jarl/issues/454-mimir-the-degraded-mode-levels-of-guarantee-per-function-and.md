# 454 · Mimir: the degraded mode, levels of guarantee per function and tool

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, tools, docs
**Files:** Mimir/src/guarantees/levels.json, Mimir/src/doctor/checks/guarantees.mjs, Mimir/scripts/gen-guarantees.mjs, Mimir/test/guarantees.test.mjs
**Repo:** ../../../Mimir
**After:** 449
**Found by:** jarl
**Where:** tools without hooks do not give the same guarantees, and the user must know it

## What
The level of every function per tool (enforced, recommended, none) is product data under src. doctor reads it, and a saved script builds the README's part from it. Detection after the fact: check and the header show uncommitted changes in areas other than the current one, for tools without hooks. The core's instructions reach such tools through the MCP server's instructions or the tool's global files. The table of tools is read from the matrix data, never generated twice.

## Why
A guarantee nobody can rely on must say so.

## Acceptance
For a tool without hooks doctor prints the levels, and a change in another area appears in check; a test compares the levels with the matrix data and the README's part with the generator's output

## Evidence

