# 136 · Jarl: four README sentences say more than the code does or sit under the wrong heading

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-134-opus
**Where:** Review of 134 (rev-jarl-134-opus), Minor findings 2 to 5

## What
(1) 'the merger merges into the branch' reads as the approved branch, merger.md says the feature branch. (2) The CLI ignores JARL_ROOT, only the MCP server reads it (jarl-mcp.mjs:165), and the README omits 'the server's'. (3) 'nothing is closed without … an approve' describes the built-in gate only: a profile with approve none and requires-merged closes on a landed merge, and the review split can print a fifth label, retracted. (4) The loop-discovery sentence sits under 'What it does not do'.

## Why
A README that claims more than the record gives is the fault the tests were written against.

## Acceptance
Each of the four sentences says exactly what the code does and sits under a fitting heading, and the tests that read the README still pass

## Evidence

