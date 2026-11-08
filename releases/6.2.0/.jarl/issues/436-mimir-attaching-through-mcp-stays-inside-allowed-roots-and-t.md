# 436 · Mimir: attaching through MCP stays inside allowed roots, and the skills index forgets missing folders

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, mcp, security, needs-owner
**Files:** Mimir/src/mcp, Mimir/src/skills
**Repo:** ../../../Mimir
**After:** 426
**Found by:** jarl
**Where:** a reviewer's note on Mimir's first build: area-attach and repo-attach through MCP have no path limit, and attached roots widen where area-create may write

## What
After a repo-attach of a git repository, area-create inside it passes; a repository in the home directory would open the whole home. The owner decides whether attaching through MCP is limited to directories under the configured clone roots, to a list of roots in the config, or needs a human's confirmation; the decision is recorded and then enforced. Also: the index of skill links forgets entries of a folder that no longer exists, after an explicit sync of that folder or doctor --fix; a custom MIMIR_HOME is honoured by the command's shim; large numbers in Claude Code's settings keep their digits when written as JSON.

## Why
An agent with an MCP rule could widen, without asking, the area in which Mimir writes files.

## Acceptance
- The owner's decision is a ruling; then an attach through MCP outside the allowed roots is refused with the command a human runs
- Entries of a removed folder leave the skills index after sync or doctor --fix

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

