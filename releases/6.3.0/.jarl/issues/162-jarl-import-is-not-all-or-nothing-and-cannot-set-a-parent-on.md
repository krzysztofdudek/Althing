# 162 · Jarl: import is not all-or-nothing, and cannot set a parent on the issues it files

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-044b-opus
**Where:** Review of 044 (rev-jarl-044b-opus), Outside the issue

## What
(1) A refusal on a later finding leaves the earlier findings filed and exits 1 (the cmdImport loop in lib/import.mjs); it was so before issue 044. (2) import cannot set Parent on the issues it files: --field Parent=<id> is refused in a loop without a profile ('declares no fields'), so the changelog's 'file them under one parent task' takes one field <id> Parent <p> per issue afterwards.

## Why
A findings file is one act; a half-filed result is hard to repair, and a tree is the way external requirements are held (issue 078).

## Acceptance
import checks every finding against the filing rules before the first write and refuses the whole file with a form when one fails, and a --parent <id> option (one meaning, in the flag table) files every issue under that parent; tests for both

## Evidence

