# 761 · Runes, Go: a sibling module that is wired only with replace in go.mod is answered outside although the repository holds it

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-ihba
**Tags:** api, go, runes
**Files:** Runes/src/relations/resolve-path.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-go-replace
**Where:** Runes/src/relations/resolve-path.mts:1258

## What
Claim: At v1.1.0 an import path resolves against the module of the nearest go.mod and the use members of the nearest go.work; the replace directive is not read. With ui/go.mod replacing example.com/data with ../data and data/go.mod declaring that module, the import of example.com/data in ui is answered outside; with a go.work that lists both folders it resolves.

repros.sh go_replace: import "example.com/data" in ui/a.go printed {"kind":"absent","reason":"outside"}; go_work, the same tree with a go.work listing ./ui and ./data, printed resolved to data/d.go

Moved from issue 761 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A repository with several Go modules wired by replace and no go.work is not checked at all for the imports between them: they are answered outside, as if the module were downloaded. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In Go, an import of a module that another go.mod of the repository declares, reached by a replace directive with a relative directory and no go.work, gives resolved to that module's package file in classifyUse, in a unit test and a catalogue case, red at v1.1.0 (outside) and green after; a replace to a module outside the repository stays outside, and every existing answer and edge stays as it is · by: npm run check

## Evidence

