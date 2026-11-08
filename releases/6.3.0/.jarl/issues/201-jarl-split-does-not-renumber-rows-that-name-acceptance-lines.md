# 201 · Jarl: split does not renumber rows that name acceptance lines nor print the note field prints, and three smaller points of the line rule

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-016-opus-k1
**Where:** lib/commands.mjs cmdSplit; the placeholder <line> in two forms; verify and resume's tip lines

## What
(1) split moves a parent's acceptance lines to sub-issues without renumbering the rows that name lines and without the note field prints, so show and brief print stale numbers (a display gap: a parent's window opens after its last sub-issue closes). (2) <line> means a line's text in field <id> Acceptance <line> and a number in --line <line>. (3) resume's log tail prints marked and unmarked tip lines the same way, and verify does not flag a mark on a line that is not a tip line. (4) With the rule switched on loop-wide by the first --line row, no ruling records that reading.

## Why
A display should not print stale numbers, a placeholder should mean one thing, and the reading of a rule should be recorded.

## Acceptance
split renumbers or notes the rows that name lines; the two placeholders differ; verify flags a stray mark; the loop-wide switch is recorded in a ruling the owner can ratify; tests where the code changes

## Evidence

