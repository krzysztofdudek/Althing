# 220 · Yggdrasil: an API key pasted as a reviewer tier name in yg-config.yaml is printed in full in the unknown-tier message

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, config, 6.2
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-020
**Where:**
**Branch:** jarl/220-tier-secret
**Worker:** ygg-220-haiku
**Since:** 2026-10-12 00:24

## What
The reviewer of package 020 (064): after all leak paths from yg-secrets.yaml are closed, there remains the case of a key pasted as a tier name in yg-config.yaml — a file that is committed anyway, so the key is already exposed; the message repeats it.

## Why



## Acceptance
The unknown-tier message does not repeat a name that looks like a secret (or shortens it); test red→green.

## Changelog
- Security: An API key written as a reviewer tier name or as reviewer.default is no longer printed in full. The error about it names only the first four characters of the value, so a key committed in yg-config.yaml does not reappear in terminal output, reports or --json.
- Before you upgrade: yg check refuses an API key written as a reviewer tier name in yg-config.yaml. A tier or reviewer.default named like a provider key (a sk-, sk-ant-, sk-proj-, AIza, ghp_, gho_, ghu_, ghs_ or github_pat_ prefix followed by at least twenty key characters) used to load, and the key then appeared in full in later messages. Now the config fails with config-tier-name-invalid, showing only the first four characters. To clear it, rename the tier to a plain name, move the key to yg-secrets.yaml, and rotate the key, since the committed file has already exposed it.

## Evidence


- **ran:** npx vitest run tests/unit/utils/redact.test.ts tests/unit/io/config-parser.test.ts tests/e2e/cli-config-tier-validation.test.ts (before the fix, source unchanged) · **saw:** the new assertions fail: 15 failed in the three files (looksLikeSecret not a function; the key printed whole in the e2e output and the unit messages)
- **ran:** npx vitest run tests/unit/utils/redact.test.ts tests/unit/io/config-parser.test.ts tests/e2e/cli-config-tier-validation.test.ts (after the fix, dist rebuilt) · **saw:** Test Files 3 passed (3); Tests 193 passed (193)

