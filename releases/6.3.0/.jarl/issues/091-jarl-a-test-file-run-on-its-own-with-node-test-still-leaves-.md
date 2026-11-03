# 091 · Jarl: a test file run on its own with node --test still leaves its temporary directories, and directories made without mkdtempSync are never tracked

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 075
**Found by:** rev-jarl-075-opus
**Where:** Review of 075 (2026-11-03): the cleanup is preloaded only by npm test's script

## What
Workers run single test files with a bare node --test, which skips the preload, so each run still leaks; directories made with mkdirSync, by a child process a test starts, or by git, are never removed; on a signal the cleanup exits with 128 instead of 128 plus the signal, replacing the runner's own handling.

## Why
Single-file runs are what workers do most, so the leak that filled the machine continues at a smaller rate.

## Acceptance
- A single test file run with a bare node --test leaves nothing in TMPDIR (the preload reached through a setup each test file imports, or the files' own after hooks), with a test
- A test fails when the suite leaves any entry in an empty TMPDIR, run as part of npm test
- On a signal the process exits with 128 plus the signal number

## Evidence

