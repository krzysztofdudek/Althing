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

