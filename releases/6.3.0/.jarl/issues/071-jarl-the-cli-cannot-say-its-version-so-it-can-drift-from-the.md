# 071 · Jarl: the CLI cannot say its version, so it can drift from the server unseen

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-68fda082
**Where:** JarlSkill/skills/jarl/scripts/jarl-mcp.mjs:51 at a1132a8

## What
Claim: The CLI and the MCP tools could disagree on flags without an agent noticing. Corrected by the sceptic: The claim narrows to drift between installs; the fix is a version on the CLI, and a note when the server's and the script's versions differ.

The server reports the plugin's version; the CLI has no version command. Map row fr-39.

## Why


## Acceptance
- jarl.mjs --version prints the same version the MCP server reports
- resume notes when the server and the script it would run report different versions; tested with two versions

## Evidence

