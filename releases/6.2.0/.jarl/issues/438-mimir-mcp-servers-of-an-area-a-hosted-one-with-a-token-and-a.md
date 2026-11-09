# 438 · Mimir: MCP servers of an area, a hosted one with a token and a local one

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261029T1430-qwhq
**Tags:** mimir, workplace, mcp, security
**Files:** Mimir/src/mcp, Mimir/test/area-mcp-examples.test.mjs, Mimir/test/fixtures/areas
**Repo:** ../../../Mimir
**After:** 426
**Found by:** owner
**Where:** the owner, 2026-10-24: MCP per company, configured centrally and prefixed by the area; a company's hosted tracker and a local speech application are the first real users

## What
Two fixture areas prove the area MCP mechanism end to end against fake servers and no real account: a hosted MCP whose token comes from an environment variable reference, and a local HTTP MCP at an address from the computer's config with no token. The generated configuration of the agent tool carries the area's prefix. Whether such a server runs on the host or in a container is Gard's question (its tools container); this issue records what the fake shows for both.

## Why
An agent must reach a company's tools from any directory without hand configuration and without a secret in any file.

## Acceptance
- The hosted fixture generates a prefixed configuration; the test variable's value appears in no generated file or log (a scan)
- A literal token in the manifest is refused by the shared secret check; the local fixture passes mcp test against the fake server

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

