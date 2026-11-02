# 456 · Mimir: a threat model with every protection pointing at its test

**Status:** deferred
**Kind:** docs
**Priority:** 2
**Tier:** strong
**Tags:** mimir, workplace, security
**Files:** Althing/research/mimir-threat-model
**Repo:** ../..
**After:** 426
**Found by:** owner
**Where:** issue M135 of Mimir's first loop; Mimir keeps no documents in its repository besides the README and the licence

## What
A research folder on Mimir's threats: what it holds (knowledge in areas and the Desk, archived sessions that may contain tokens, git credentials on the computer, the registry and config in its home), who could do harm (the author of a cloned area or a taken-over colleague's account, a package in a project's container, text the agent reads, another user of the computer, the agent's own mistake), a table of protections each with the test file in Mimir that holds it (at least the allow list of git calls, the guard of MCP paths, and the write with its hash check and atomicity), and the plain statements: code from cloned areas (hooks, jobs, extensions, skill scripts) runs without approval, so whoever attaches someone else's area trusts its authors like their own code; MCP over HTTP is deferred and nothing listens; hooks are rails, not guarantees. Known gaps are listed without tests.

## Why
An open tool that runs code from repositories and writes to teams' repositories must say honestly what it protects against.

## Acceptance
Every row of the table names a test file that exists in Mimir and holds at least one test (the reviewer checks and records it); the three statements are present; protections not yet built stand only among the gaps

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

