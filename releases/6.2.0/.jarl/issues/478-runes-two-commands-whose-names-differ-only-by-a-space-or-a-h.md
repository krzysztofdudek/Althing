# 478 · Runes: two commands whose names differ only by a space or a hyphen (a a and a-a) get one MCP tool name, silently; the property test finds it on some seeds and turned CI red

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** runes, mcp, 1.1.0
**Files:** Runes/src/mcp/tools.mts, Runes/src/cli/table.mts, Runes/test/properties.test.mjs
**Repo:** ../../../Runes
**Found by:** jarl
**Where:** CI run 41549295867 on release/1.1.0 (test-windows, Node 22): properties.test.mjs:145 'every generated tool lists exactly the fields argvFor accepts' failed with RUNES_PROPERTY_SEED=1328475926; it fails the same way on Linux with that seed. toolName (src/mcp/tools.mts:47) maps both a space and a hyphen to an underscore, and test/helpers/prng.mjs name() can produce a hyphen
**Branch:** jarl/478-mcp-tool-name-collisions
**Worker:** w-runes-478-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/Runes-478
**Since:** 2026-11-03 00:37

## What
toolName turns both spaces and hyphens into underscores, so a table with the commands a a and a-a gives two tools named prop_a_a. Nothing refuses such a table, and a call to that name reaches whichever command is found first. The property test's generator can draw such a pair, so CI fails on some seeds.

## Why
A consumer whose command names collide this way gets a tool that runs the wrong command, with no error; and a red CI on a random seed blocks the release.

## Acceptance
- A table whose commands map to one tool name is refused where the tools are built (or where the table is defined), naming both commands, with a test
- The property test draws tables without such collisions, or asserts the refusal for them, and passes with seed 1328475926 and with 200 fresh seeds in one run
- docs/api.md says what happens to colliding command names

## Evidence

