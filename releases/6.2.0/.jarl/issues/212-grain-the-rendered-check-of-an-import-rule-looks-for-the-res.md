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
- Fixed: an import rule written over a resolved path such as ~/lib/base now finds the import the source actually contains, a relative import statement or a module-level CommonJS require('../base'), so it refuses or requires that import where it stands; a bare dot (PHP concatenation, Python from . import x) is no longer read as the file's own folder.

## Evidence


- **ran:** node --import ./tests/git-env.mjs --test tests/import-rule-source-specifier.test.mjs (before the fix, from plugins/grain) · **saw:** not ok: a prohibition on ~/lib/base refuses a file that imports it by a relative path (expected line 1, got none); not ok: an obligation is met by the relative import; tests 5, pass 2, fail 3
- **ran:** node --import ./tests/git-env.mjs --test tests/import-rule-source-specifier.test.mjs (after the fix, commit HEAD) · **saw:** tests 5, pass 5, fail 0: the relative import '../base' in lib/a/x.ts is refused at line 1; the obligation is met; a literal ~/ spelling still matches
- **ran:** full-gate.sh on the worktree at fba84ee and 1ec8011 (timeout 1200) · **saw:** tests 2303, pass 2302, fail 0; exit 0

round 3 (96907db). ran: node --import ./tests/git-env.mjs --test tests/import-rule-source-specifier.test.mjs with propose-checks.mjs at the previous commit (from plugins/grain) · saw: tests 11, pass 6, fail 5 (module-level require('../base') in .js, .cjs and .ts not refused, the obligation case not met, bare-dot case refused); with the fix: tests 11, pass 11. Chosen: the check reads the CommonJS half, not a narrowed changelog: in JS and TS files a call_expression require with one string literal argument outside any function, the way extraction reads it, counts as an import, for the prohibition, the obligation and the literal ~/ spelling; a require in a function or arrow, with a template or computed argument, or of another path is not read. The check now resolves the string-literal nodes of the statement, not words of its text, so a bare dot no longer resolves to the file's own folder (Python from . import base under ~/lib/a; PHP require_once __DIR__ . '/../base.php', whose recorded import is the literal /../base.php). Full gate at 8e454d3: tests 2323, pass 2322, skipped 1, fail 0, exit 0. Not done, for the jarl to file if wanted: loader calls of other languages (Ruby require_relative, Lua require) are still not read by the rendered check, and an index import (../base/index) is not matched to ~/lib/base, the same as extraction. docs: docs/reference.md: one sentence that an import rule over a ~/ path matches a relative import statement and a module-level CommonJS require, and that an index import is not matched to its folder.

