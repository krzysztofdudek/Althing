# 410 · Gard: secrets only from the environment and native stores

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, identities, security
**Files:** Gard/src/tools/secrets.mjs, Gard/test/secrets.test.mjs
**Repo:** ../../../Gard
**After:** 407
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, Principles: native mechanisms, no secrets of Gard's own

## What
A manifest refers to a secret only as an environment variable name; a literal value under a key that looks like a key, token, secret, password or auth is refused with the fix. Gard passes named variables into a container and never writes their values into a file, a log, an answer or a generated definition. gard doctor names a missing variable and never shows a value.

## Why
A rig is shared; a key that lands in it, or in a generated file beside it, leaks to everyone who clones it.

## Acceptance
- A test sets a variable with a known value, runs build, run, up and doctor, and scans every file Gard wrote and every answer for that value: none holds it
- A literal token in gard.yaml is refused with its fix

## Evidence

