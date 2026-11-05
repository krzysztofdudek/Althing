# 159 · Jarl: a findings file that starts with a byte order mark is refused as not JSON

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-044-opus
**Where:** Review of 044 (rev-jarl-044-opus), Outside the issue

## What
import refuses a findings file that starts with a BOM, saying it is not JSON; readText in lib/files.mjs does not strip it. Windows editors write a BOM. The behaviour is the same at release/6.2.1.

## Why
Jarl works on Windows, where a findings file saved by an editor often starts with a BOM.

## Acceptance
readText strips a leading BOM for every file Jarl reads as text (findings, profile, goal), with a test per reader and a CRLF plus BOM case

## Evidence

