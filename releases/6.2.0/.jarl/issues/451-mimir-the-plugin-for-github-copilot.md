# 451 · Mimir: the plugin for GitHub Copilot

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, tools
**Files:** Mimir/src/install/tools/copilot.mjs, Mimir/plugin-templates/copilot, Mimir/test/install-copilot.test.mjs
**Repo:** ../../../Mimir
**After:** 446, 450
**Found by:** owner
**Where:** the matrix data of GitHub Copilot from its probe issue

## What
Generated from a template through the shared installer: the MCP configuration, the instruction file and hooks where the tool has them. Install restores itself after an update of the tool; init detects the tool; uninstall removes only Mimir's entries.

## Why
GitHub Copilot is one of the four agent tools of the target.

## Acceptance
Install in a fixture home writes the expected files and leaves others' entries alone; a second install changes nothing; uninstall removes only Mimir's entries; doctor shows the levels of guarantee for GitHub Copilot

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

