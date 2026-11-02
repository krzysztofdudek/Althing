# 453 · Mimir: the plugin for Cursor

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, tools
**Files:** Mimir/src/install/tools/cursor.mjs, Mimir/plugin-templates/cursor, Mimir/test/install-cursor.test.mjs
**Repo:** ../../../Mimir
**After:** 448, 450
**Found by:** owner
**Where:** the matrix data of Cursor from its probe issue

## What
Generated from a template through the shared installer: .cursor/mcp.json, rules in .mdc files as instructions, hooks if any, and a header computed at the first call with an explicit --at, because MCP runs with the workspace as its working directory. Install restores itself after an update of the tool; init detects the tool; uninstall removes only Mimir's entries.

## Why
Cursor is one of the four agent tools of the target.

## Acceptance
Install in a fixture home writes the expected files and leaves others' entries alone; a second install changes nothing; uninstall removes only Mimir's entries; doctor shows the levels of guarantee for Cursor

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

