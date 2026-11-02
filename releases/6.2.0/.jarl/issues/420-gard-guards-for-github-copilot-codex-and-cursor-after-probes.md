# 420 · Gard: guards for GitHub Copilot, Codex and Cursor, after probes on real accounts

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Tags:** gard, workplace, guards, hooks, needs-owner
**Files:** Gard/plugin, Gard/src/guards/protocol.mjs
**Repo:** ../../../Gard
**After:** 366, 394
**Found by:** owner
**Where:** the owner, 2026-10-24: Mac, Linux and Windows, and Claude Code, GitHub Copilot, Codex and Cursor; the probes of those tools are paused on the owner's word

## What
For each of the three tools: what its hooks can see and refuse, how a plugin installs, and the degraded mode where it has no hooks (the guards then become instructions and a check after the fact). Built on the hook protocol and installer that issue 366 places, and only after the owner allows probes on real accounts.

## Why
The target names four agent tools; Gard 1.0.0 serves Claude Code, and a user of another tool must know what Gard can and cannot enforce there.

## Acceptance
The owner's word on probes is recorded; then, per tool, recorded payloads give the same decisions as Claude Code's for host-run, script-ban and temp, and the README's table states the level of each guard per tool

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

