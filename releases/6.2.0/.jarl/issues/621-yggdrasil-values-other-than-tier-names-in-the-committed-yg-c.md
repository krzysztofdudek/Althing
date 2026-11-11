# 621 · Yggdrasil: values other than tier names in the committed yg-config.yaml are printed whole when they…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1625-whnk
**Tags:** 
**Files:** Yggdrasil/source/cli/src/core/checks/credentials.ts
**Repo:** Yggdrasil
**Found by:** rev-220-fable
**Where:** the review of 220, 296, 297
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Yggdrasil: values other than tier names in the committed yg-config.yaml are printed whole when they are shaped like an API key: config.endpoint by the reviewer-endpoint-committed warning (source/cli/src/core/checks/credentials.ts), progressive.reference by the note 'could not be measured against', and a YAML tag by the YAMLWarning Node prints with the source line on every command; yg aspect-test --tier echoes an unknown tier typed on the command line whole. Existed before this change.

## Why


## Acceptance


- [test] An API-key-shaped config.endpoint in the committed yg-config.yaml makes the reviewer-endpoint-committed warning, and an API-key-shaped progressive.reference the 'could not be measured against' note, print the value redacted, red before and green after · by: cd source/cli && npm test
- [test] An API-key-shaped YAML tag in yg-config.yaml is not printed whole by the YAMLWarning line a command emits, and yg aspect-test --tier given an API-key-shaped unknown tier does not echo it whole, red before and green after · by: cd source/cli && npm test

## Evidence

