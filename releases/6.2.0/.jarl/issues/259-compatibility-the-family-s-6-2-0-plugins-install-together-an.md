# 259 · Compatibility: the family's 6.2.0 plugins install together and their MCP servers start (Claude Code, Codex, Cursor, Copilot)

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** compatibility, plugins
**Files:** Althing/workspace/checks/plugins.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**

## What
Every tool has plugin manifests and an MCP server; the version bump in 224 touches five manifests per repository. Nobody checks that the whole family installed together works.

## Why



## Acceptance
On a clean environment: the Yggdrasil, Grain, Jarl and Horde plugins at version 6.2.0 installed together; every MCP server starts and answers a help call; the versions in the manifests consistent; the result recorded before the tags.

## Evidence


