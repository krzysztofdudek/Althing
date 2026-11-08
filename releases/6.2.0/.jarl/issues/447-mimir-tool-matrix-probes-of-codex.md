# 447 · Mimir tool matrix: probes of Codex

**Status:** dropped
**Kind:** research
**Priority:** 3
**Tier:** strong
**Tags:** mimir, workplace, tools, needs-owner
**Files:** Mimir/src/tools/matrix/codex.json, Mimir/test/probes/codex.probe.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** owner
**Where:** the owner, 2026-10-24: Mimir works in Claude Code, GitHub Copilot, Codex and Cursor; its guarantees stand today on Claude Code's hooks only; the probes are paused on the owner's word

## What
For Codex: the events of its hooks and whether a hook can refuse, the format of its configuration, its instruction files, MCP, skills, the working directory a session gets, global instruction files, and MCP over HTTP from a container. The result is product data, src/tools/matrix/codex.json: every cell has the function, the value, its proof (a test, or a source with its address and date) and a state (verified or not verified); a cell that needs a model, an account or the network is marked not verified. Probes that need no model and no account (validating a configuration, starting the MCP server through the tool's command) run in a container and are skipped with a reason without the network or the program.

## Why
The target is four agent tools, and a user of each must know what Mimir can enforce there.

## Acceptance
- The data file follows the cell format, and a test checks that every cell has a test or a source or is marked not verified
- The model-free probes pass in a container or are skipped with a reason; no probe reads a token, a key or a model (a test scans them)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

