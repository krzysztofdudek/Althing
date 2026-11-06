# 167 · Jarl: the diff parser reads only a plain +++ b/ header, so a path git quotes comes out null in the marker and file notes

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-074-opus-b
**Where:** skills/jarl/scripts/lib/rounds.mjs: the diff parser; it already affected the issue-number notes and now also the marker notes of 074

## What
For a path that git quotes because of special characters, the parser finds no file name, so a conflict marker or large file note carries a null path.

## Why
The notes of merged and scope should name the file in every case.

## Acceptance
A file whose name git quotes is named in the marker note and the large-file note, with a test

## Evidence

