# 684 · Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0004-fbcl
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682

## What
Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source excerpt, an unknown key, an unresolved alias, and the checks that quote a node's type, aspects, relation target or mapping, a flow's nodes, and a rule's implies or references (same on release/6.2.0) Also: an aspect id holding a key in a node's, port's or flow's own aspects list (yg-node.yaml, yg-flow.yaml) prints whole in aspect-undefined (core/checks/aspects.ts), found by w-641-sonnet.

## Why


## Acceptance


## Evidence

