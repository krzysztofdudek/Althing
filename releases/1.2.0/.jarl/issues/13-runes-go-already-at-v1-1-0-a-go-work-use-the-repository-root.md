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

## Changelog
- in Go, a `go.work` that writes the repository root with a trailing slash (`use ./`, or `./tools/` for a member) names the same module as `use .`, so an import of the root module from a member nested below it resolves to its package files, where 1.1.0 answered it `unfollowed` with no edge. A consumer can see new edges, and new refusals, between such a member and the root module.

## Evidence

### Proof

- **ran (line 40671d4c3e51):** npm run build; node --test test/relations/extractors/go-resolve.test.mjs test/relations/extractors/go-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at 2ad13f8, the tests before the fix) · **saw:** red: go-work-use-root-trailing-slash-edge 'expected edge tools/gen/gen.go:3->lib not emitted (got none)'; the unit test 'a use ./ member, in every spelling of the repository root' expected undefined to be lib/l.go
- **ran (line 40671d4c3e51):** npm run build; node --test test/relations/extractors/go-resolve.test.mjs test/relations/extractors/go-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/resolve-path.test.mjs (at 83d11ce) · **saw:** green: tests 109, pass 109, fail 0; use ., ./, .//, "./", ././, tools/../ and ./tools/.. all resolve example.com/root/lib from tools/gen to lib/l.go

