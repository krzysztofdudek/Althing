# 452 · Mimir: the plugin for Codex

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, tools
**Files:** Mimir/src/install/tools/codex.mjs, Mimir/plugin-templates/codex, Mimir/test/install-codex.test.mjs
**Repo:** ../../../Mimir
**After:** 447, 450
**Found by:** owner
**Where:** the matrix data of Codex from its probe issue

## What
Generated from a template through the shared installer: config.toml with MCP (written without damaging the user's configuration), AGENTS.md as the core's instructions, and hooks if the tool has them. Install restores itself after an update of the tool; init detects the tool; uninstall removes only Mimir's entries.

## Why
Codex is one of the four agent tools of the target.

## Acceptance
Install in a fixture home writes the expected files and leaves others' entries alone; a second install changes nothing; uninstall removes only Mimir's entries; doctor shows the levels of guarantee for Codex

## Evidence

