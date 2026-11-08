# 201 · Jarl: split does not renumber rows that name acceptance lines nor print the note field prints, and three smaller points of the line rule

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-016-opus-k1
**Where:** lib/commands.mjs cmdSplit; the placeholder <line> in two forms; verify and resume's tip lines
**Branch:** jarl/200-reason-for-unproved-lines
**Worker:** w-jarl-200-opus
**Worktree:** /home/me/Worktrees/JarlSkill/200-reason-for-unproved-lines
**Since:** 2026-11-08 12:23

## What
(1) split moves a parent's acceptance lines to sub-issues without renumbering the rows that name lines and without the note field prints, so show and brief print stale numbers (a display gap: a parent's window opens after its last sub-issue closes). (2) <line> means a line's text in field <id> Acceptance <line> and a number in --line <line>. (3) resume's log tail prints marked and unmarked tip lines the same way, and verify does not flag a mark on a line that is not a tip line. (4) With the rule switched on loop-wide by the first --line row, no ruling records that reading.

## Why
A display should not print stale numbers, a placeholder should mean one thing, and the reading of a rule should be recorded.

## Acceptance
split renumbers or notes the rows that name lines; the two placeholders differ; verify flags a stray mark; the loop-wide switch is recorded in a ruling the owner can ratify; tests where the code changes

## Changelog
- Added (part of the entries on proof that names checkable lines and on the mark of the code a result was made on): editing or splitting a task says so when its proof names a line by a number that may have moved, and the record check names that mark on any line that is not such a note.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern "split that moves or renumbers|placeholder of its own|tip mark on a line that is no tip line" tests/proof-lines.test.mjs tests/gate-window.test.mjs, the new tests on the branch at e4527fa (before the change) · **saw:** tests 3, pass 0, fail 3: split printed nothing where a row of the parent names a line it renumbered, the registry holds no <line-number>, and verify printed clean (exit 0, expected 2) for a row line and a note line carrying the tip mark
- **ran:** cd skills/jarl/scripts && node --test on proof-lines, gate-window, owner-sign-off, sub-issues, surface, mcp, mcp-runes, docs-true, help-workflow, printed-texts, printed-writes, skill-shape, tense, vocabulary, record-contract, closed-gate, retract, review-waiver, library-parity, refusals, words, modules, log-reader, brief, scope-after-lease, raise-keeps-paths, format-marker, then the six refusals-walk files and no-loop (at aefa521) · **saw:** tests 399, pass 397, fail 0, skipped 2; the walks and no-loop: tests 38, pass 38, fail 0. split notes the parent's row that names line 3 after line 2 moved away, and says nothing where the named lines keep their numbers; evidence --line, tick, the brief and the closed gate's repair print <line-number>, field Acceptance prints <line>, and the unfilled form is refused as a placeholder; verify names both lines that carry a stray tip mark (exit 2) and the row is still read as the row it is

