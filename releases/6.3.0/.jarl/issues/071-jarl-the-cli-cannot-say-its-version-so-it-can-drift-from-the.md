# 071 · Jarl: the CLI cannot say its version, so it can drift from the server unseen

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-68fda082
**Where:** JarlSkill/skills/jarl/scripts/jarl-mcp.mjs:51 at a1132a8
**Branch:** jarl/071-cli-version
**Worker:** w-jarl-071-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-071
**Since:** 2026-11-03 17:02

## What
Claim: The CLI and the MCP tools could disagree on flags without an agent noticing. Corrected by the sceptic: The claim narrows to drift between installs; the fix is a version on the CLI, and a note when the server's and the script's versions differ.

The server reports the plugin's version; the CLI has no version command. Map row fr-39.

## Why


## Acceptance
- jarl.mjs --version prints the same version the MCP server reports
- resume notes when the server and the script it would run report different versions; tested with two versions

## Changelog
- Added: Jarl's command line prints its version with --version. The number matches the one the Jarl tools in your session report.

## Evidence

- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 600 node --test tests/version-report.test.mjs · **saw:** tests 3, pass 0, fail 3; each fails with: unknown flag --version before the command, exit 1 (red, before the change)
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 600 node --test tests/version-report.test.mjs · **saw:** tests 3, pass 3, fail 0 (green, after the change)

