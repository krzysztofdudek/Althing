# 684 · Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0004-fbcl
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source excerpt, an unknown key, an unresolved alias, and the checks that quote a node's type, aspects, relation target or mapping, a flow's nodes, and a rule's implies or references (same on release/6.2.0) Also: an aspect id holding a key in a node's, port's or flow's own aspects list (yg-node.yaml, yg-flow.yaml) prints whole in aspect-undefined (core/checks/aspects.ts), found by w-641-sonnet.

## Why


## Acceptance


[test] A key-shaped value in a node or flow file is masked in the YAML parse error's excerpt, an unknown key, an unresolved alias, and every check that quotes a node's type, aspects, relation target or mapping, a flow's nodes, a rule's implies or references, and an aspect id in a node's, port's or flow's aspects list, in text and --json, red before and green after · by: cd source/cli && npm test

## Evidence

