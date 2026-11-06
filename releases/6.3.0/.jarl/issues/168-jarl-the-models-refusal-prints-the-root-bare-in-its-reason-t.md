# 168 · Jarl: the models refusal prints the root bare in its reason, the flaw issue 140 fixed in the no-loop refusal

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-128-opus-c2
**Where:** skills/jarl/scripts/lib/models.mjs:311

## What
The models refusal echoes the root without quoting, so a root holding a line break splits the reason and one holding a command substitution runs when the whole message is pasted into sh.

## Why
Every refusal that prints a caller-given root should quote it the way the no-loop refusal now does.

## Acceptance
The models refusal prints the root quoted with line breaks escaped, and a test pins a line-break root and a command-substitution root

## Evidence

