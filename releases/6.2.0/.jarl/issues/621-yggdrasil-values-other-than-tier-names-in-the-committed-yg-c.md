# 621 · Yggdrasil: values other than tier names in the committed yg-config.yaml are printed whole when they…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1625-whnk
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-220-fable
**Where:** the review of 220, 296, 297

## What
Yggdrasil: values other than tier names in the committed yg-config.yaml are printed whole when they are shaped like an API key: config.endpoint by the reviewer-endpoint-committed warning (source/cli/src/core/checks/credentials.ts), progressive.reference by the note 'could not be measured against', and a YAML tag by the YAMLWarning Node prints with the source line on every command; yg aspect-test --tier echoes an unknown tier typed on the command line whole. Existed before this change.

## Why


## Acceptance


## Evidence

