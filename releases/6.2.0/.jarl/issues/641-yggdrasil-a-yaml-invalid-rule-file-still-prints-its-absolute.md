# 641 · Yggdrasil: a yaml-invalid rule file still prints its absolute path, and YAML tag warnings from graph files other than yg-config.yaml are not masked

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T1935-yyck
**Tags:** yggdrasil, security
**Files:** 
**Repo:** Yggdrasil
**After:** 620
**Found by:** jarl
**Where:** w-620-fable, the keys and processes package
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:38

## What


## Why
The same two leaks 620 and 621 closed for their files: a machine path in output, and a key-shaped YAML tag printed whole.

## Acceptance
[test] A yaml-invalid rule file is named by its repository-relative POSIX path, and a key-shaped YAML tag in any graph file's warning is masked, red before and green after · by: cd source/cli && npm test

## Evidence

### Proof

- **ran (line df3860af8cc6):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io/aspect-adapt-merge.test.ts tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/repo/e2e-prose-ratchet.test.ts · **saw:** 108 passed; P1-P12 (rule-file refusals name .yggdrasil/aspects/<rule>/yg-aspect.yaml, text and --json) and W1-W5 (key-shaped YAML tag masked in rule, node, flow, architecture files) failed 17 of 17 on the release build, pass on this branch

