# 159 · Jarl: a findings file that starts with a byte order mark is refused as not JSON

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-044-opus
**Where:** Review of 044 (rev-jarl-044-opus), Outside the issue
**Branch:** jarl/094-import-and-files
**Worker:** w-jarl-094-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/094-import-and-files
**Since:** 2026-11-06 19:43

## What
import refuses a findings file that starts with a BOM, saying it is not JSON; readText in lib/files.mjs does not strip it. Windows editors write a BOM. The behaviour is the same at release/6.2.1.

## Why
Jarl works on Windows, where a findings file saved by an editor often starts with a BOM.

## Acceptance
readText strips a leading BOM for every file Jarl reads as text (findings, profile, goal), with a test per reader and a CRLF plus BOM case

## Changelog
- Fixed: A findings file, a profile or a goal saved by an editor that puts a byte order mark at the start, as Windows editors do, is now read like any other. Before, a findings file saved that way was refused as not JSON.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/byte-order-mark.test.mjs (red: readText without the change, tests added) · **saw:** tests 9 · pass 0 · fail 9: a findings file, a profile file and a loop's profile that start with a byte order mark are refused as not JSON, and readText returns the mark (also with CRLF)
- **ran:** cd skills/jarl/scripts && node --test tests/byte-order-mark.test.mjs (green, branch jarl/094-import-and-files) · **saw:** tests 9 · pass 9 · fail 0: import and sources, init --profile and profile, a loop's profile and a goal read the same with a mark and with a mark and CRLF
- **ran:** import <findings with a leading mark and CRLF> --dry-run --source scn on a copy of the 6.3.0 loop, release tip and then this branch · **saw:** release tip: scen/bom.json is not JSON: Unexpected token; this branch: scn: 1 finding(s) · would file 1 · already filed 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip, after all four commits and the quoting fix) · **saw:** tests 1414 · pass 1392 · fail 0 · skipped 22

