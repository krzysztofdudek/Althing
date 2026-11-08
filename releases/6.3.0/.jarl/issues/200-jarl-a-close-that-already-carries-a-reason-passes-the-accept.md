# 200 · Jarl: a close that already carries a reason passes the acceptance-line rule without being asked, so with --line in use done never refuses in a loop where every close has a reason

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-016-opus-k1
**Where:** skills/jarl/scripts/lib/commands.mjs doneGateIn lines(); lib/evidence.mjs closedGateFlags
**Branch:** jarl/200-reason-for-unproved-lines
**Worker:** w-jarl-200-opus
**Worktree:** /home/me/Worktrees/JarlSkill/200-reason-for-unproved-lines
**Since:** 2026-11-08 12:23

## What
The rule of issue 016 (each acceptance line needs a counted row that names it, else done closes only with a reason) treats the reason of the close itself as the reason for the unproved lines. Jarl's own line after an approve prints set <id> done <why>, and every close in this loop carries a reason, so done would never refuse: it would record the merge text as the reason for the unproved lines. Also closedGateFlags does not re-check the line rule after a close (a row naming a line, retracted after the close, shows in report but not in closedGate).

## Why
The owner chose option a so that done lists exactly the lines no proof row names and asks for a reason to close without one; a reason given for the close is not a reason for the missing proof.

## Acceptance
done asks for a reason for the unproved lines apart from the close text (a separate flag or form, for example a --without-rows reason), refuses a plain reasoned close while lines are unnamed, and records the reason under Evidence as before; the line printed after an approve and the refusals name that form; closedGateFlags re-checks the rule after a close; the 134 closed issues of the real loop and the loops that never use --line read as before; tests for each

## Changelog
- Added (part of the entry on proof that names the checkable lines of a task): the task closes past lines no proof names only with a reason for those lines given on its own (set done --without-rows), not taken from the reason for closing, and a line whose proof is taken back after the task closed is flagged until a new proof names it.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/proof-lines.test.mjs, the new and changed tests on the branch at afee327 (before the change), TMPDIR from mktemp -d · **saw:** tests 15, pass 8, fail 7: a close giving only the move's reason closed past acceptance lines no row names (expected the refusal), set refused --without-rows as an unknown flag, the record library's setStatus closed without throwing, the note after an approve named set done "<why>" alone, and a row naming a line retracted after the close left closedGate empty
- **ran:** cd skills/jarl/scripts && node --test tests/proof-lines.test.mjs (at e4527fa, after the change) · **saw:** tests 15, pass 15, fail 0: a plain close and one with the move's reason alone are refused with the lines listed, ending with jarl.mjs set "<ids>" "<status>" "<why>" --without-rows "<why-no-row-names-the-lines>", nothing written; --without-rows closes and writes Done without a row naming acceptance line 2, 3: <its reason> under Evidence (the move's reason stays on the log line only); the form and the note's close, filled and pasted into sh, close; the flag is refused on a move that does not close, in a loop that names no line, where every line is named and with no words; setStatus throws and closes with opts without-rows; the owner's close of an issue with a ticked owner line and a waiver close work with it; a row retracted after the close is flagged by status and report until a row names the line again, and a loop without --line and an issue closed before the first --line row read as before
- **ran:** cd skills/jarl/scripts && node --test on surface, mcp, mcp-runes, docs-true, help-workflow, printed-texts, printed-writes, skill-shape, tense, vocabulary, record-contract, closed-gate, retract, owner-sign-off, review-waiver, library-parity, gate-window, refusals, words, modules, input-forms, list-fields, proof-lines, sub-issues, report-slips, resume, then the six refusals-walk files (at e4527fa) · **saw:** tests 330, pass 327, fail 0, skipped 3; the walks: tests 8, pass 8, fail 0. The flag table of surface has --without-rows with its one meaning, commands.md lists it among the flag fields of set, and the record contract holds every export unchanged (setStatus takes the new optional opts key without-rows)
- **ran:** status, resume, report (also --metrics), list --all, next --all, next --as jarl and owner, verify, decisions --live, models, branches, goal, profile, each with --json, show and show --json of every issue, brief, brief --json and brief --role reviewer of the last 12, on a copy of the 6.3.0 loop with JarlSkill and Yggdrasil linked beside it: the scripts of release/6.2.1 against those of e4527fa · **saw:** 469 views, 0 differ once ages are taken out (two differ in ageMs alone); closedGate lists only 028 on both; the copy stays at record format 1 and its files are unchanged by the views
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 553a77c, the tip of jarl/200-reason-for-unproved-lines, TMPDIR from mktemp -d) · **saw:** tests 1604, pass 1582, fail 0, cancelled 0, skipped 22, exit 0; the branch merges with no conflict into the release branch as it now stands (1e6d579, git merge-tree); the log line of a close is unchanged, so no line shape is new and no format is raised beyond the 3 the first --line row raises, which the pinned 6.1.0 driver and 6.2.0 already refuse

