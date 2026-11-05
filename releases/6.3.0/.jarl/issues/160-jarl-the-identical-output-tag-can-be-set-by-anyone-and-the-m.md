# 160 · Jarl: the identical-output tag can be set by anyone and the models view counts a light approve of a tagged change as clearing on a lower-ranked model

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-098-opus
**Where:** Review of 098 and 049 (rev-jarl-098-opus), Minor finding of 049 and Outside the issue

## What
(1) The tag identical-output, which lets a light approve clear an issue, is set by anyone, the issue's own worker included, and nothing checks that a comparison proof row exists; it silences the rank note. (2) The models view (lib/models.mjs) still counts a light approve of a tagged change as a clearing approve on a lower-ranked model. Done still needs a fresh approve either way, so the gate is not weakened.

## Why
A tag that relaxes a rule should be set by the party the rule protects against only with its evidence.

## Acceptance
The rank note is silenced only for an issue that carries the tag AND a proof row naming the comparison, and the models view treats such an approve as the rule says; tests for both; who may set the tag is said in references/reviewer.md

## Evidence

