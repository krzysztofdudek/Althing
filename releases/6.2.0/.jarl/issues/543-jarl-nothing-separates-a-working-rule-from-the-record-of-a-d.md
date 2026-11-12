# 543 · Jarl: nothing separates a working rule from the record of a decision

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Key:** 20261111T0927-bpdy
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** decide
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
A ruling meant for agents reaches nobody unless it carries --applies-to, and nothing prompts for it. In a field report the brief printed none of the loop's own rules for fifteen days while the coordinator repeated them by hand; this release loop had the same gap until 2026-11-09.

## Why
Working rules get lost among the history.

## Acceptance
[read] decide asks whether a ruling is a rule for agents or a record, or warns when an imperative ruling has no scope, and a delivered rule carries no history lines

## Changelog
- decide says on stderr when a ruling with no --applies-to reads as an instruction, so a rule meant for agents is not left as a record that reaches nobody, and names the call that makes it a rule. A rule is handed to an agent as its instruction alone: the Made under: line and the owner's words stay in the record.

## Evidence

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

Assumed: an instruction is a ruling whose sentence holds a word that obliges or forbids (must, never, always, should, do not, ensure) or begins with a verb of work (run, use, keep, check, file, ask and the like); decide only notes it on stderr, with the call that makes it a rule, and writes it as given. A delivered rule drops its closing Made under line and the owner's words, which the head and the record keep. The full suite ran green on commit f78533c of jarl/540-jarl-6-3-1 (1855 tests, 1833 passed, 0 failed, 22 skipped on their platform); the one later commit changes only how one test names its worktree directory.

