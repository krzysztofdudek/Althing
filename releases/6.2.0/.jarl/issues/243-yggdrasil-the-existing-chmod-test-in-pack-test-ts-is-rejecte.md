# 243 · Yggdrasil: the existing chmod test in pack.test.ts is rejected by the test-deterministic rule on re-evaluation

**Status:** open
**Kind:** test
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, tests
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-028
**Where:**

## What
The worker of package 028: on re-evaluation of pack.test.ts the reviewer rejects the existing chmod-based test under the test-deterministic rule, so every package touching this file will get stuck.

## Why



## Acceptance
The test in pack.test.ts checks the same behaviour without depending on chmod (or deterministically on all platforms), and the test-deterministic rule accepts it on re-evaluation.

## Evidence


