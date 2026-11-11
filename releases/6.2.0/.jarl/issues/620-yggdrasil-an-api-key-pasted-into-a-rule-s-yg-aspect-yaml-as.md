# 620 · Yggdrasil: an API key pasted into a rule's yg-aspect.yaml as a mapping key is printed whole by aspe…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1625-icmm
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-220-fable
**Where:** the review of 220, 296, 297
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Yggdrasil: an API key pasted into a rule's yg-aspect.yaml as a mapping key is printed whole by aspect-unknown-key and aspect-reviewer-unknown-key (text and --json), and the excerpt of a yaml-invalid yg-aspect.yaml prints the reviewer.tier line whole; aspect-unknown-key also prints the absolute path of the file. Existed before this change.

## Why


## Acceptance


- [test] A yg-aspect.yaml whose mapping key is shaped like an API key makes aspect-unknown-key and aspect-reviewer-unknown-key print it redacted, in text and in --json, and the excerpt of a yaml-invalid yg-aspect.yaml prints its reviewer.tier line redacted, red before and green after · by: cd source/cli && npm test
- [test] aspect-unknown-key names the file by its project-relative path, not its absolute path, in text and in --json · by: cd source/cli && npm test

## Evidence

