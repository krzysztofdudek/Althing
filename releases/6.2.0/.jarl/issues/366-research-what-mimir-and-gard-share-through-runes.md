# 366 · Research: what Mimir and Gard share through Runes

**Status:** deferred
**Kind:** research
**Priority:** 1
**Tier:** strong
**Tags:** runes, gard, mimir, workplace
**Files:** Althing/research/mimir-and-gard-through-runes
**Repo:** ../..
**Found by:** jarl
**Where:** Mimir already uses @chrisdudek/runes for its command table; its platform layer, its hook protocol and its installer of agent-tool plugins live in Mimir alone, and Gard needs each of them

## What
A design pass decides, part by part, whether Gard copies a part from Mimir or both take it from Runes: the platform layer (paths and homes on three systems, running a program without a POSIX shell, atomic writes with retries on Windows), the hook protocol (events of each agent tool normalised to one model, refusals, injected context, fail-open with a time budget), the installer of plugins for Claude Code, Copilot, Codex and Cursor, and the JSON envelope with its registry of error codes. For each part it gives the cost of a copy (two places to fix) against the cost of a Runes release (a new export, a pin in both tools), and files the resulting issues in Runes, Gard and Mimir.

## Why
Runes is the family's shared code and adds no edge; two copies of the same platform and hook code in two new tools would drift from the first day.

## Acceptance
- A research folder states, for each of the four parts, copy or Runes, with the reason and the cost
- The issues it files name their After edges so that Gard's foundation issues wait on the parts that go to Runes

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

