# 728 · Grain: grain propose writes the 7.0.0 shape of .yggdrasil (types, rules, bundles, dependencies between types) and stops writing components, family candidates and anything the 7.0.0 rulings removed

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0648-boyr
**Tags:** 
**Files:** 
**Found by:** jarl
**Where:** plugins/grain/engine/propose-*.mjs and grain-export.mjs; rulings yggdrasil-without-components, yggdrasil-attention-layer-removed, yggdrasil-portal-pack-adopt-removed, rule-status-on-the-rule-only
**Repo:** Grain
**After:** 725

## What


## Why


grain propose generates a whole .yggdrasil (a nodes or a types shape, drills, rule statuses, and the family-candidates file for yg advise and yg adopt); after the 7.0.0 rulings (no components, no attention layer, no adopt, two statuses, narrowing only by types) much of what it writes targets things that no longer exist.

## Acceptance


[test] grain propose on a sample repository writes a .yggdrasil that Yggdrasil 7.0.0 accepts with yg check, with types, rules and dependencies only and no component, family-candidates or removed key

## Evidence

