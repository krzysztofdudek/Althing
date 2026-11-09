# 232 · Jarl: its README family section and its GitHub description follow the canon sentence on one worker per piece of work

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261109T0442-axlf
**Tags:** canon
**Files:** 
**Repo:** JarlSkill
**Found by:** jarl
**Where:**
**Branch:** jarl/232-bump
**Worker:** w-jarl-232-sonnet
**Model:** claude-sonnet-5-5
**Since:** 2026-11-09 09:54
**Merged:** 72438a894374efd475acb274328cb06c30f16ce0 in JarlSkill
**CI:** none

## What
Issue 193 covers the READMEs of Yggdrasil, Grain, Ratatoskr, Urd and Researcher; this covers Jarl README family section and its GitHub description. The owner runs: gh repo edit krzysztofdudek/JarlSkill --description "Your feature branch has more issues than one agent can hold in its head. Jarl makes your coding agent direct a crew: an issue per finding, a worker per piece of work in its own worktree, nothing closed without evidence and a fresh reviewer's word." (247 characters).

## Why
The canon sends each surface that quotes it to an issue, and gh repo edit is the owner word every time.

## Acceptance
- [read] Jarl README family section is the canon block on the release branch, and ws check canon-sync names no difference for Jarl
- [owner] Jarl GitHub description reads as the canon says · material: the gh repo edit command in What · check: run it

## Reviews
- **approve** · by rev-jarl-232-opus-prep (fresh) · 2026-11-09 · model claude-opus-5-5
  Line 1 read: "Jarl README family section is the canon block on the release branch, and ws check canon-sync names no difference for Jarl". I ran ws check canon-sync --source local --ref jarl=jarl/232-bump: it reads Jarl at that branch and lists five READMEs, none of them Jarl. Commit acbde8b changes one table row to the canon's words on one worker per piece of work. Line 2 stays the owner's tick. No findings.

## Evidence

### Proof

- **ran (line e5a05c1577ae):** node workspace/ws.mjs check canon-sync --source local --ref jarl=jarl/232-bump · **saw:** no Jarl line: only the other five READMEs differ (Jarl on it from 6.1.0); the Jarl README family section equals the canon block with the self-reference convention

