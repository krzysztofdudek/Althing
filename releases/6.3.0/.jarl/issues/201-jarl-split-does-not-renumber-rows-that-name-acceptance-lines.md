# 201 · Jarl: split does not renumber rows that name acceptance lines nor print the note field prints, and three smaller points of the line rule

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261108T1222-njce
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-016-opus-k1
**Where:** lib/commands.mjs cmdSplit; the placeholder <line> in two forms; verify and resume's tip lines
**Branch:** jarl/200-reason-for-unproved-lines
**Merged:** b7be90910d83050af1777c8ac0cc0db36004526b in ../../../JarlSkill
**CI:** none

## What
(1) split moves a parent's acceptance lines to sub-issues without renumbering the rows that name lines and without the note field prints, so show and brief print stale numbers (a display gap: a parent's window opens after its last sub-issue closes). (2) <line> means a line's text in field <id> Acceptance <line> and a number in --line <line>. (3) resume's log tail prints marked and unmarked tip lines the same way, and verify does not flag a mark on a line that is not a tip line. (4) With the rule switched on loop-wide by the first --line row, no ruling records that reading.

## Why
A display should not print stale numbers, a placeholder should mean one thing, and the reading of a rule should be recorded.

## Acceptance
split renumbers or notes the rows that name lines; the two placeholders differ; verify flags a stray mark; the loop-wide switch is recorded in a ruling the owner can ratify; tests where the code changes

## Changelog
- Added (part of the entries on proof that names checkable lines and on the mark of the code a result was made on): editing or splitting a task says so when its proof names a line by a number that may have moved, and the record check names that mark on any line that is not such a note.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test --test-name-pattern "split that moves or renumbers|placeholder of its own|tip mark on a line that is no tip line" tests/proof-lines.test.mjs tests/gate-window.test.mjs, the new tests on the branch at e4527fa (before the change) · **saw:** tests 3, pass 0, fail 3: split printed nothing where a row of the parent names a line it renumbered, the registry holds no <line-number>, and verify printed clean (exit 0, expected 2) for a row line and a note line carrying the tip mark
- **ran (history):** cd skills/jarl/scripts && node --test on proof-lines, gate-window, owner-sign-off, sub-issues, surface, mcp, mcp-runes, docs-true, help-workflow, printed-texts, printed-writes, skill-shape, tense, vocabulary, record-contract, closed-gate, retract, review-waiver, library-parity, refusals, words, modules, log-reader, brief, scope-after-lease, raise-keeps-paths, format-marker, then the six refusals-walk files and no-loop (at aefa521) · **saw:** tests 399, pass 397, fail 0, skipped 2; the walks and no-loop: tests 38, pass 38, fail 0. split notes the parent's row that names line 3 after line 2 moved away, and says nothing where the named lines keep their numbers; evidence --line, tick, the brief and the closed gate's repair print <line-number>, field Acceptance prints <line>, and the unfilled form is refused as a placeholder; verify names both lines that carry a stray tip mark (exit 2) and the row is still read as the row it is
- **ran (history):** status, resume, report (also --metrics), list --all, next --all, next --as jarl and owner, verify, decisions --live, models, branches, goal, profile, each with --json, show and show --json of every issue, brief, brief --json and brief --role reviewer of the last 12, on a copy of the 6.3.0 loop with JarlSkill and Yggdrasil linked beside it: the scripts of release/6.2.1 against those of aefa521, the branch tip of both issues · **saw:** 469 views, 0 differ once ages are taken out; closedGate lists only 028 on both; verify places every line as before; the copy stays at record format 1 and its files are unchanged by the views
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 553a77c, the tip of jarl/200-reason-for-unproved-lines, TMPDIR from mktemp -d) · **saw:** tests 1604, pass 1582, fail 0, cancelled 0, skipped 22, exit 0; the branch merges with no conflict into the release branch as it now stands (1e6d579, git merge-tree); the log line of a close is unchanged, so no line shape is new and no format is raised beyond the 3 the first --line row raises, which the pinned 6.1.0 driver and 6.2.0 already refuse
- **ran (history):** cd skills/jarl/scripts && node --test over every test file except the heavy ones with --test-concurrency=3, then the heavy ones (retract, refusals, refusals-walk) one at a time, on the merged tip of the release branch, TMPDIR from mktemp -d; the heavy files peak near 200000 files each and are run apart because another suite beside them fails with out-of-space errors (issue 202) · **saw:** tests 1585 + 58 = 1643, fail 0, skipped 22, merge b7be909

