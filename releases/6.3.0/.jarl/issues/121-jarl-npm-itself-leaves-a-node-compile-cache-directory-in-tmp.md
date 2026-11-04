# 121 · Jarl: npm itself leaves a node-compile-cache directory in TMPDIR on every run, so the outer TMPDIR of npm test is never empty

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-091b-opus
**Where:** Review of 091 (rev-jarl-091b-opus), Outside the issue

## What
The reviewer of 091 saw that running npm alone (npm --version) in an empty TMPDIR creates a node-compile-cache directory there with npm 11.6.2, outside the test runner's own private directory. The suite leaves nothing of its own, but a check that the outer TMPDIR is empty after npm test would fail.

## Why
A worker or CI step that asserts the scratch directory is empty after the suite reads the npm cache as a leak.

## Acceptance
The test command or the documented way to run the suite keeps npm's compile cache out of the scratch directory (for example NODE_COMPILE_CACHE set or disabled for the run), or the documentation says the directory is npm's and is expected, with a check that proves which

## Evidence

