# 3 · Runes, Ruby: a plain require gives no use, so a file loaded through the load path has no edge

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1057-rziq
**Tags:** runes, ruby, api
**Files:** 
**Repo:** Runes
**Found by:** planner-1-2-0
**Where:** Runes/src/relations/extractors/ruby.mts:103

## What
At v1.1.0 the Ruby reader emits a use for require_relative only; a plain require 'app/models/user' gives no use at all, so a file of the repository loaded through the load path (the $LOAD_PATH entries, lib/ in a gem) has no edge from the file that requires it, and classifyUse has nothing to classify for a gem or a standard library require. Found by the planner of 1.2.0 while checking 753.

## Why
A require is how most Ruby gems load their own files, so the edges of a gem's lib/ tree are lost; a consumer reporting uses it could not follow sees nothing either.

## Acceptance
[test] In Ruby, require 'x/y' gives a use that binds lib/x/y.rb (or the file under another root the repository's gemspec require_paths names) when that file exists, and classifyUse answers outside for a require that binds no file of the repository, in a unit test and a catalogue case each, red at v1.1.0 (no use) and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

