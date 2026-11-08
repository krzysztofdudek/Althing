# 167 · Jarl: the diff parser reads only a plain +++ b/ header, so a path git quotes comes out null in the marker and file notes

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-074-opus-b
**Where:** skills/jarl/scripts/lib/rounds.mjs: the diff parser; it already affected the issue-number notes and now also the marker notes of 074
**Branch:** jarl/163-base-and-reopen
**Worker:** w-jarl-163-opus
**Worktree:** /home/me/Worktrees/JarlSkill/163-base-and-reopen
**Since:** 2026-11-08 09:34

## What
For a path that git quotes because of special characters, the parser finds no file name, so a conflict marker or large file note carries a null path.

## Why
The notes of merged and scope should name the file in every case.

## Acceptance
A file whose name git quotes is named in the marker note and the large-file note, with a test

## Changelog
- Fixed: The notes about a conflict marker or a mention of a task in a branch or a merge now name the file when its name holds a space, a letter beyond plain English or a quote. Before, such a note named no file.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='path git quotes' tests/added-content-notes.test.mjs (before the fix) · **saw:** fail 2: the marker notes named null for 'ünï notes.txt' and for a name with a tab, quotes and a backslash, and 'plain space.txt' with a trailing tab; the large-file note already named 'big ü.dump'
- **ran:** cd skills/jarl/scripts && node --test tests/added-content-notes.test.mjs (after the fix) · **saw:** pass 7, fail 0: scope and merged name 'ünï notes.txt', 'plain space.txt' and the quoted name in the marker notes and 'big ü.dump' in the large-file note; the name with a tab is skipped on Windows, where it cannot exist
- **ran:** cd skills/jarl/scripts && npm test (the whole suite on the branch tip 58824ff) · **saw:** tests 1548, pass 1526, fail 0, skipped 22; the suite left nothing in its temporary directory

