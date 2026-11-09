# 153 · Grain: the description of the MCP tool grain_propose mentions only the rejection of its own .yggdrasil/

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261002T1010-lois
**Tags:** grain, mcp
**Files:** Grain/plugins/grain/bin/grain-mcp.mjs
**Repo:** ../../../Grain
**After:** 037, 038
**Found by:** grain-037
**Where:**
**Branch:** jarl/059-small-cli-truths
**Merged:** f905da4
**CI:** none

## What
bin/grain-mcp.mjs:61 describes only the rejection of the repository's own .yggdrasil/; after 037 and 038 propose also rejects directories with files tracked by git and another repository's graph.

## Why
An agent reads the tool description to understand a refusal.

## Acceptance
The MCP tool description lists every refusal of an output directory.

## Changelog
- Fixed: the MCP help for grain_propose lists every output directory grain refuses, not only your own .yggdrasil/.

## Evidence

- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2092, pass 2091, fail 0, skipped 1, merge f905da4

