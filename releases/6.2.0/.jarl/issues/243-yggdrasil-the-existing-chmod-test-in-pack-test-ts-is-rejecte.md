# 243 · Yggdrasil: the existing chmod test in pack.test.ts is rejected by the test-deterministic rule on re-evaluation

**Status:** in-progress
**Kind:** test
**Priority:** 3
**Tier:** standard
**Key:** 20261005T1622-uari
**Tags:** yggdrasil, tests
**Files:** 
**Repo:** Yggdrasil
**Found by:** ygg-028
**Where:**
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:54

## What
The worker of package 028: on re-evaluation of pack.test.ts the reviewer rejects the existing chmod-based test under the test-deterministic rule, so every package touching this file will get stuck.

## Why



## Acceptance
[test] The chmod test in pack.test.ts passes the test-deterministic rule on re-evaluation (no dependence on the machine's umask or the runner's user), without a suppress, red before and green after · by: cd source/cli && npm test

## Evidence


