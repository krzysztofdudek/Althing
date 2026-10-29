# 407 · Gard: a tools container per company keeps company logins off the host

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, identities, port
**Files:** Gard/src/tools, Gard/test/tools.test.mjs
**Repo:** ../../../Gard
**After:** 387
**Found by:** owner
**Where:** Mimir at 10257cd: the tools container of a company and the identity of a repository by address (issue M82 of Mimir's first loop)

## What
The manifest's tools declares named tools containers (an image or features, the command-line tools in them such as gh and az, a volume for their logins). gard tools run <name> -- <command> runs a command in one; the user signs in inside it once and the login stays in its volume. Removing the container keeps the volume unless told.

## Why
The owner, 2026-10-24: company CLI logins must not land on a private host; agents reach the company's tools without starting a project's container.

## Acceptance
A fixture declares a tools container; tools run starts it and runs a command; a second run reuses it; the login volume survives a removal of the container

## Evidence

