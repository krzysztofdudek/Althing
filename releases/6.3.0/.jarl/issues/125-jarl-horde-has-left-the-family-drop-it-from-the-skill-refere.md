# 125 · Jarl: Horde has left the family; drop it from the skill, references, comments and tests, and settle the constraints it put on this release

**Status:** open
**Kind:** cleanup
**Priority:** 2
**Tier:** strong
**Tags:** family, horde
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl-analysis
**Where:** release/6.2.1: skills/jarl/SKILL.md, references (composers.md, profile.md, jarl.md, repositories.md, glossary.md), jarl-lib.mjs comments, tests that name Horde; briefs/worker-jarl.md

## What
On 2026-11-04 the owner took Horde out of the family (ruling horde-leaves-the-family) and its repository became private. Jarl's main carries the new family section in README and CLAUDE.md. The skill, its references, two comments in jarl-lib.mjs and several tests still name Horde as the composer that runs on Jarl's loop, and this release still holds constraints that existed only for Horde: record.mjs exports kept unchanged because Horde vendors them (briefs/worker-jarl.md), Horde re-vendoring Jarl at the tag, and the Horde half of ruling one-format-raise-horde-later (a composer's loop is never raised).

## Why
A skill that sends its reader to a private repository is wrong on the day 6.3.0 ships, and a constraint kept for a consumer that no longer exists costs the release work for nothing.

## Acceptance
- No file on release/6.2.1 outside CHANGELOG.md names Horde as a tool that exists today; a composer, where the skill keeps the idea, is described without naming one
- The owner's word or a recorded ruling says whether the jarl-record/1 freeze, the composer-loop protections and the Horde half of one-format-raise-horde-later stay, change or go, and the brief and the code follow it
- Jarl's suite is green on the branch

## Evidence

