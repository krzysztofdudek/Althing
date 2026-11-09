# 229 · Grain: rules from propose --shape types work in yg check (enforcement, the second half of 045/130)

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-cada
**Tags:** grain, propose, partial
**Files:** 
**Repo:** ../../../Grain
**Found by:** jarl
**Source:** decisions#grain-scope
**Where:**
**After:** 231

## What
In 6.1.1 (045/130) the --shape types report tells the truth about what it writes; enforcement deferred to 6.2: the host-type directory becomes a module node, so enforced rules apply to zero nodes.

## Why
The types shape promises laws that yg check does not run.

## Acceptance
A --shape types proposal after yg adopt has enforced rules that work on the nodes they describe (yg check does not say 'effective on zero nodes'); the 'N break it today' numbers match yg check --full on a fixture and on one repo from the corpus; tests.

## Evidence


