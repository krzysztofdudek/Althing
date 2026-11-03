# 094 · Jarl: import's misspelling check refuses some plausible keys by accident, treats CLAIM and claim differently, and its acceptance still says unknown key

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 077
**Found by:** rev-jarl-077b-opus
**Where:** Review of 077 round 1 (2026-11-03): lib/import.mjs

## What
A key within two edits of a mapped key is refused, so file (title), line (kind), find, kid, ids (id), effect and fixed are refused though they may be intended extras; CLAIM passes while claim is a mapped key (case matters); sources' refusal says nothing was filed; 077's acceptance line still says unknown key.

## Why
A rule that refuses a legitimate extra key by accident teaches people to stop using extra keys.

## Acceptance
The check compares case-insensitively, refuses only a distance-one miss of a mapped key of five or more letters or an adjacent transposition, lists the extras it let through when it files, and the acceptance and the references say the rule as it is, with a test per case

## Evidence

