# 369 · Gard: one command table, JSON answers and a registry of error codes

**Status:** deferred
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, foundation
**Files:** Gard/src/cli, Gard/src/errors, Gard/bin/gard.mjs, Gard/test/cli.test.mjs, Gard/test/errors.test.mjs
**Repo:** ../../../Gard
**After:** 367
**Found by:** owner
**Where:** Mimir at 10257cd: src/cli, src/errors.mjs and the use of @chrisdudek/runes for its command table are the model

## What
The CLI is built from one command table on Runes, so that a library call, the command line and any later adapter run the same code. Every command answers with the envelope ok, data, next, warnings and errors, as JSON with --json and as plain text otherwise. Every error and warning has a code, a message and a fix; every code used in the source is declared in one registry with its level, meaning and fix template, and a test fails on an undeclared code or on a fix with an unfilled placeholder. Exit codes are fixed: 0 success, 1 a refusal or an error, 2 usage.

## Why
Determinism is a principle of the design: every action is a command an agent or a person can run again and read the same way.

## Acceptance
- A test runs every command of the table with --help and with --json against a fixture and checks the envelope's shape
- A source file that raises an undeclared code makes the registry test fail; a fix template with an open placeholder is refused

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

