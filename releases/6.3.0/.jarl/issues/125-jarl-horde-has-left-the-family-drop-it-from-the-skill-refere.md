# 125 · Jarl: Horde has left the family; drop it from the skill, references, comments and tests, and settle the constraints it put on this release

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** strong
**Tags:** family, horde
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl-analysis
**Where:** release/6.2.1: skills/jarl/SKILL.md, references (composers.md, profile.md, jarl.md, repositories.md, glossary.md), jarl-lib.mjs comments, tests that name Horde; briefs/worker-jarl.md
**Branch:** jarl/125-horde-out
**Worker:** w-jarl-125-opus
**Worktree:** /Users/me/Worktrees/JarlSkill/125-horde-out
**Since:** 2026-11-05 07:14

## What
On 2026-11-04 the owner took Horde out of the family (ruling horde-leaves-the-family) and its repository became private. Jarl's main carries the new family section in README and CLAUDE.md. The skill, its references, two comments in jarl-lib.mjs and several tests still name Horde as the composer that runs on Jarl's loop, and this release still holds constraints that existed only for Horde: record.mjs exports kept unchanged because Horde vendors them (briefs/worker-jarl.md), Horde re-vendoring Jarl at the tag, and the Horde half of ruling one-format-raise-horde-later (a composer's loop is never raised).

## Why
A skill that sends its reader to a private repository is wrong on the day 6.3.0 ships, and a constraint kept for a consumer that no longer exists costs the release work for nothing.

## Acceptance
- No file on release/6.2.1 outside CHANGELOG.md names Horde as a tool that exists today; a composer, where the skill keeps the idea, is described without naming one
- The owner's word or a recorded ruling says whether the jarl-record/1 freeze, the composer-loop protections and the Horde half of one-format-raise-horde-later stay, change or go, and the brief and the code follow it
- Jarl's suite is green on the branch

## Evidence

Ruling horde-constraints-fall-away: Under autonomy-quality, on the owner's decision as relayed by the Jarl Evolution session on 2026-11-04 (the relay's words, not his own): Jarl is to be simply fixed, with no further questions, because Horde has left the family (ruling horde-leaves-the-family) and the constraints kept only for it fall away. (1) The freeze of record.mjs exports that briefs/worker-jarl.md names, and Horde re-vendoring Jarl's code at the tag, are gone. (2) The Horde half of ruling one-format-raise-horde-later is gone: Horde is no longer a later topic. A line shape that the pinned 6.1.0 driver or Jarl 6.2.0 would misread still rides the one format raise (needFormat in lib/profile.mjs), and a composer profile that keeps its loop's format stays a mechanism of the tool until an issue removes it; no code is deleted on this ruling alone. (3) The jarl-record/1 contract test (RECORD_API in tests/record-contract.test.mjs) stays: it guards Jarl's own surface. (4) Horde is removed from the skill, the references, the comments and the tests on the release branch (issue 125). Settles issue 125 acceptance line 2.

Ruling ask-013 (ratify): yes. Krzysztof chose 'I confirm all three' (an option label, not his wording) on 2026-11-05: the freeze of record.mjs exports, Horde re-vendoring Jarl at the tag and the Horde half of one-format-raise-horde-later fall away; the jarl-record/1 contract test (RECORD_API) stays.

