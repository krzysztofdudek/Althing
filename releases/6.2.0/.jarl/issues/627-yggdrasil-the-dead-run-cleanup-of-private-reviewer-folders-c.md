# 627 · Yggdrasil: the dead-run cleanup of private reviewer folders can remove a live run's folder across containers that share a temporary folder and a hostname, and the fallback's transient wording depends on timing

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1755-jnex
**Tags:** yggdrasil, reviewers
**Files:** 
**Repo:** Yggdrasil
**After:** 537
**Found by:** jarl
**Where:** rev-537b-opus, 537 round 2 (claude-code.ts:139-158 and :162; :224-233)
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What


## Why
A sidecar, a pod's shared temp volume or a host-network container shares hostname and temp folder but not the process list, so a live review's folder is taken for dead and its key removed (fails closed as Not logged in); and in the fallback for older Claude Code the 'passes by itself' wording is chosen by re-reading a file other reviewers may be mid-writing.

## Acceptance
[test] A folder of a live run whose process is not in this run's process list (another container, same hostname, shared temp folder) is never removed, decided by something other than the process list, and in the fallback a parse failure under contention is classified the same on every run, each red before and green after · by: cd source/cli && npm test

## Evidence

