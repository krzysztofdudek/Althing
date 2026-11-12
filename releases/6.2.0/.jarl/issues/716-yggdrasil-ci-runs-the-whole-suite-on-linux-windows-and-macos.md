# 716 · Yggdrasil: CI runs the whole suite on Linux, Windows and macOS in parallel, as Jarl's ci.yml does (ruling ci-everywhere-like-jarl)

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0406-ywtr
**Tags:** ci, windows, macos
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12
**Branch:** jarl/716-ci-everywhere
**Worker:** w-716-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:06

## What


## Why
Paths, links, signals and git behave differently on Windows and macOS; a suite run on Linux alone lets those faults through to users.

## Acceptance
- [read] .github/workflows/ci.yml runs the repository's whole test suite on ubuntu-latest, windows-latest (sharded where the suite is long) and macos-latest, Node 22 and 24, fail-fast off, as Jarl's does, and every step that ran on Linux alone now runs on all three or says in the workflow why it cannot
- [read] Every test that cannot run on a platform is skipped there with a stated reason, and the suite was run once locally on Linux with the platform guards in place; the first CI run on GitHub on all three platforms is green, recorded after the push

## Evidence

### Notes

Assumed: Windows test shards are 4 per Node version (the suite has 739 files and is long); macOS runs the whole gate unsharded like Linux; Windows tests keep Git for Windows' system git config (core.autocrlf on) and the run's own global config sets core.symlinks on; the lock-history audit runs on all three platforms; every job gets a 120-minute timeout; no CHANGELOG entry because nothing an adopter sees changes.

