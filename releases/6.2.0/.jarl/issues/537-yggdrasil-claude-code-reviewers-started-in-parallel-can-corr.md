# 537 · Yggdrasil: claude-code reviewers started in parallel can corrupt the user's ~/.claude.json, and the failure is called permanent

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261111T0927-mdle
**Tags:** yggdrasil, reviewer
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/llm/claude-code.ts:47

## What
With four paid fills at once, one reviewer call failed with a JSON parse error of ~/.claude.json, and Claude Code left a .corrupted copy in its backups; the file parsed again afterwards. The likely cause is several claude processes writing the same file: the isolation arguments cover settings and MCP, not this file. Yggdrasil said a re-run would not help, and a re-run did.

## Why
A check should not damage a user file, even for a moment, and a transient failure should be called transient.

## Acceptance
- [read] Each reviewer process runs with a private configuration directory, or reviewers started across runs are limited, with the choice and its reason in the issue
- [test] The parse failure of the user's configuration is classified as transient, so the message invites a re-run · by: cd source/cli && npm test

## Evidence

