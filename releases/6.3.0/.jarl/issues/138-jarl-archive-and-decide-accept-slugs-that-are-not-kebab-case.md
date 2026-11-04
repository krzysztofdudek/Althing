# 138 · Jarl: archive and decide accept slugs that are not kebab-case, such as Bad Slug! and Bad_Slug

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096c-opus
**Where:** Review of 096 (rev-jarl-096c-opus), Outside the issue

## What
archive takes the slug Bad Slug! and decide takes Bad_Slug (lib/commands.mjs); both write a name into the record that other commands cannot address cleanly. The behaviour was there before 096.

## Why
Rulings are cited by slug; a slug with spaces or punctuation is hard to cite.

## Acceptance
archive and decide refuse a slug that is not lower-case kebab-case, with the allowed form in the usage, and a test holds it

## Evidence

