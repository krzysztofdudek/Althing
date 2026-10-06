# 176 · Grain: the MCP server without a repo parameter still runs git synchronously to find the root — a hung git freezes the server

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, mcp
**Files:** Grain/plugins/grain/bin/grain-mcp.mjs
**Repo:** ../../../Grain
**After:** 123
**Found by:** grain-061
**Where:**
**Branch:** jarl/145-cli-followups
**Merged:** f1f919b
**CI:** none

## What
After 123 and 122 the MCP server finds the root through .git without git, but when a call gives no repo it still calls git synchronously to name the root in the response.

## Why
The same kind of blocking as 122: a hung git (e.g. waiting on a lock or the network) stops the whole server, and ping stops answering.

## Acceptance
No git call on the request-handling path is synchronous; a test with a fake git that does not answer, and a ping answered at once.

## Changelog
- Fixed: a hung git no longer freezes the grain MCP server when a call names no repository; other requests, ping included, are still answered.

## Evidence

red: new test in tests/mcp-docker-never-blocks.test.mjs (stand-in git that never answers, grain_status with no repo) failed: 'ping answered while git hangs' (no answer in 3 s). green after the commit: that file plus mcp-server, mcp-partition-root, mcp-runes 57/57
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2128, pass 2127, fail 0, skipped 1, merge f1f919b

