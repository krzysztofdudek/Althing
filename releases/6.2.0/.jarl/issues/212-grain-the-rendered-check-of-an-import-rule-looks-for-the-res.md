# 212 · Grain: the rendered check of an import rule looks for the resolved specifier (e.g. ~/lib/base), which never appears in the source text

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, imports, 6.2
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-200
**Where:**
**Branch:** jarl/003-check-populations
**Worker:** grain-003
**Worktree:** /Users/me/.jarl-wt/Grain-003
**Since:** 2026-10-05 16:22

## What
Reported by the worker of package 200; reviewer rev-grain-200: not live in 6.1.1, because this import rule stays a draft and yg check does not run it. Older than this package.

## Why



## Acceptance
The import-rule check matches the specifier in the form in which it stands in the source (alias/path) before the rule can become enforced; test red→green.

## Changelog
- Fixed: an import rule written over a resolved path such as ~/lib/base now finds the relative import the source actually contains, so it refuses or requires that import where it stands.

## Evidence


- **ran:** node --import ./tests/git-env.mjs --test tests/import-rule-source-specifier.test.mjs (before the fix, from plugins/grain) · **saw:** not ok: a prohibition on ~/lib/base refuses a file that imports it by a relative path (expected line 1, got none); not ok: an obligation is met by the relative import; tests 5, pass 2, fail 3
- **ran:** node --import ./tests/git-env.mjs --test tests/import-rule-source-specifier.test.mjs (after the fix, commit HEAD) · **saw:** tests 5, pass 5, fail 0: the relative import '../base' in lib/a/x.ts is refused at line 1; the obligation is met; a literal ~/ spelling still matches
- **ran:** full-gate.sh on the worktree at fba84ee and 1ec8011 (timeout 1200) · **saw:** tests 2303, pass 2302, fail 0; exit 0

