# 344 · Yggdrasil: files other family tools keep in a covered folder (a folder's own .gitignore, a committed Jarl loop's dot files) are not reported unmapped

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261028T0923-bgsj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:**
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:54

## What
A field report from a workspace graph: a node maps only markdown under a required coverage root, and a topic that carries its own .gitignore, or a committed Jarl loop (.jarl/.gitignore, .jarl/.gitattributes), turns yg check red with unmapped files that nobody can usefully map.

## Why
The family's tools write these files into the folders Yggdrasil covers; a family whose tools trip each other's gates is not coherent.

## Acceptance
- The dot files the family's own tools write (Jarl's loop files, a folder's .gitignore and .gitattributes) are either outside coverage by default or covered by a documented exclusion, and yg check is green on a covered folder that holds a committed Jarl loop
- A test with a covered folder holding a committed Jarl loop

## Evidence

