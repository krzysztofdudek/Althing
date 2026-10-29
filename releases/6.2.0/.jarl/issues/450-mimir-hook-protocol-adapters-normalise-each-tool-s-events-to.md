# 450 · Mimir: hook protocol adapters normalise each tool's events to one model

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Tags:** mimir, workplace, tools, hooks
**Files:** Mimir/src/hooks/adapters, Mimir/src/install/adapters.mjs, Mimir/test/hooks-adapters.test.mjs
**Repo:** ../../../Mimir
**After:** 446, 447, 448, 366
**Found by:** jarl
**Where:** Mimir at 10257cd: src/hooks/protocol.mjs speaks Claude Code's protocol only; issue 366 decides whether this part goes to Runes for Mimir and Gard

## What
A protocol module per tool turns its events and tool names into one model, and gives back its form of a refusal and of added context; the rules of Mimir's hooks do not change. A shared installer module (generate from a template, install without touching others' entries, restore after an update, detect the tool, report the level of guarantee) is the one API the three plugin issues use.

## Why
The same rules of work should hold in every tool that has hooks.

## Acceptance
- Recorded payloads of each tool give the same decisions as Claude Code's for the .temp block, a write into another area and the session start; an unknown event passes with a warning
- The installer has one API (generate, install, uninstall, detect) with a contract test against a fake tool, and Claude Code's install goes through it unchanged

## Evidence

