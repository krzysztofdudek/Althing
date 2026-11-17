# 13 · Runes Go, already at v1.1.0: a go.work use ./ (the repository root written with a trailing slash) k…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-edwx
**Tags:** go, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761
**Branch:** jarl/13-python-go-roots-2
**Worker:** w-13-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes Go, already at v1.1.0: a go.work use ./ (the repository root written with a trailing slash) keys the root module as ./ beside the empty directory the ancestor walk holds, so an import of the root module from a member nested below it is answered absent unfollowed with no edge, where use . resolves it.

## Why


A lost true edge, or a false one, misleads every consumer that checks dependencies with the readers.

## Acceptance


[test] A go.work use ./ (and ./ written in any equivalent spelling) keys the root module as use . does, so an import of the root module from a member nested below it resolves as with use .; a case and a unit test, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

