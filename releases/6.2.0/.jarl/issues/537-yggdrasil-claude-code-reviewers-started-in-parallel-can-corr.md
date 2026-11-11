# 537 · Yggdrasil: claude-code reviewers started in parallel can corrupt the user's ~/.claude.json, and the failure is called permanent

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261111T0927-mdle
**Tags:** yggdrasil, reviewer
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/llm/claude-code.ts:47
**Branch:** jarl/537-reviewer-config
**Worker:** w-537-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 14:22

## What
With four paid fills at once, one reviewer call failed with a JSON parse error of ~/.claude.json, and Claude Code left a .corrupted copy in its backups; the file parsed again afterwards. The likely cause is several claude processes writing the same file: the isolation arguments cover settings and MCP, not this file. Yggdrasil said a re-run would not help, and a re-run did.

## Why
A check should not damage a user file, even for a moment, and a transient failure should be called transient.

## Acceptance
- [read] Each reviewer process runs with a private configuration directory, or reviewers started across runs are limited, with the choice and its reason in the issue
- [test] The parse failure of the user's configuration is classified as transient, so the message invites a re-run · by: cd source/cli && npm test

## Evidence

### Proof

- **ran (line cede22230f05):** cd source/cli && npx vitest run tests/unit/llm/claude-code-config.test.ts tests/unit/core/fill-report.test.ts tests/unit/core/fill-llm.test.ts tests/unit/core/aspect-verifier.test.ts (before the fix, at the commit of the tests) · **saw:** 4 files failed, 9 tests red: a reviewer started while another was mid-write got 'claude' exited with code 1: Claude configuration file at <scratch home>/.claude.json is corrupted: JSON Parse error; the summary said 're-running will not help until the connection/config is fixed' and the pair said 'Fix the cause named above'

