# 3 · Runes, Ruby: a plain require gives no use, so a file loaded through the load path has no edge

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1057-rziq
**Tags:** runes, ruby, api
**Files:** 
**Repo:** Runes
**Found by:** planner-1-2-0
**Where:** Runes/src/relations/extractors/ruby.mts:103
**Branch:** jarl/753-classify-reasons
**Worker:** w-753-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:19

## What
At v1.1.0 the Ruby reader emits a use for require_relative only; a plain require 'app/models/user' gives no use at all, so a file of the repository loaded through the load path (the $LOAD_PATH entries, lib/ in a gem) has no edge from the file that requires it, and classifyUse has nothing to classify for a gem or a standard library require. Found by the planner of 1.2.0 while checking 753.

## Why
A require is how most Ruby gems load their own files, so the edges of a gem's lib/ tree are lost; a consumer reporting uses it could not follow sees nothing either.

## Acceptance
[test] In Ruby, require 'x/y' gives a use that binds lib/x/y.rb (or the file under another root the repository's gemspec require_paths names) when that file exists, and classifyUse answers outside for a require that binds no file of the repository, in a unit test and a catalogue case each, red at v1.1.0 (no use) and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- in Ruby, a plain `require 'x/y'` gives a use of the file it names on the repository's load path, `lib/x/y.rb` or the same name under a `require_paths` entry of a gemspec of the repository, where 1.1.0 gave none; `classifyUse` answers `outside` for a require no load-path root of the repository holds (`require 'json'`, a gem), and `ambiguous` with both files where two roots hold it. This can show new findings: a file that loads a file of its own gem, or of another gem of the repository, with `require` now depends on it (on the corpus, one new edge in rack). Hints stored by 1.1.0 are stale by the Ruby extractor's `rev`.

## Evidence

### Proof

- **ran (line d3e3ee675580):** node --test test/relations/resolver.test.mjs test/relations/extractors/ruby.test.mjs test/relations/extractors/ruby-resolve.test.mjs test/relations/extractors/ruby-name-resolution-matrix.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs (new tests over the dist of f7686db, before the change) · **saw:** pass 163, fail 6: the extractor test of a plain require (no use), the classifyUse require test, ruby-resolve.test.mjs (no load-path resolver), the cases ruby-plain-require-load-path-edge (no edge, no answer) and ruby-plain-require-silence (no answer on lines 1 and 2), the rev seed
- **ran (line d3e3ee675580):** npm run build; node --test test/relations/resolver.test.mjs test/relations/resolve-path.test.mjs test/relations/extractors/ruby.test.mjs test/relations/extractors/ruby-resolve.test.mjs test/relations/extractors/ruby-name-resolution-matrix.test.mjs test/relations/extractors/include-resolve.test.mjs test/relations/extractors/php-resolve.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/exports.test.mjs (at ef21efe) · **saw:** pass 305, fail 0
- **ran (line d3e3ee675580):** npm run check (clean tree at ef21efe, release/1.2.0 merged: already up to date at 3e125cb) · **saw:** tests 2838, pass 2835, fail 0, skipped 3 (the Rust build tests, no toolchain here); dist/ is fresh

