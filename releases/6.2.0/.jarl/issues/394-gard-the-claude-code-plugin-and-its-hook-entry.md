# 394 · Gard: the Claude Code plugin and its hook entry

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, guards, hooks
**Files:** Gard/plugin, Gard/src/guards/entry.mjs, Gard/src/guards/protocol.mjs, Gard/test/hooks-entry.test.mjs
**Repo:** ../../../Gard
**After:** 378
**Found by:** owner
**Where:** Mimir at 10257cd: src/hooks (entry.mjs, handle.mjs, protocol.mjs, header.mjs) and the measured hook budget are the model

## What
A Claude Code plugin with Gard's hooks: one entry reads the event, asks where for the path, runs the guards that apply and answers in the tool's protocol (a refusal with its reason, or added context). At the start of a session it adds one line naming the container of the current root and the run prefix. A guard that throws or runs out of its time budget lets the call through with a warning. The light path loads only the modules it needs, and a test measures the p95 of a call against a budget fixed in the code.

## Why
The guards are what stops an agent from littering the host; they must never get in the way by themselves, and the owner's sessions run many of them.

## Acceptance
- Recorded Claude Code payloads for a tool call, a write and a session start give the expected answers; a throwing guard gives a pass with a warning
- A test lists the modules a call loads and keeps its p95 under the budget

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

