# 648 · Yggdrasil: warnings the YAML library raises while reading graph files other than yg-config.yaml (yg…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-hhwr
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620-opus
**Where:** the review of 615, 620, 621, 625, 627

## What
Yggdrasil: warnings the YAML library raises while reading graph files other than yg-config.yaml (yg-aspect.yaml and the node, flow and architecture parsers, which still call parse) quote the source line unmasked: a key written as a YAML tag in yg-aspect.yaml prints whole on check and aspects (YAMLWarning: Unresolved tag: !sk-ant-...), and a key on a line with another warning prints whole in the excerpt.

## Why


## Acceptance


## Evidence

