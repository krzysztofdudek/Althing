# 200 · Jarl: a close that already carries a reason passes the acceptance-line rule without being asked, so with --line in use done never refuses in a loop where every close has a reason

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-016-opus-k1
**Where:** skills/jarl/scripts/lib/commands.mjs doneGateIn lines(); lib/evidence.mjs closedGateFlags

## What
The rule of issue 016 (each acceptance line needs a counted row that names it, else done closes only with a reason) treats the reason of the close itself as the reason for the unproved lines. Jarl's own line after an approve prints set <id> done <why>, and every close in this loop carries a reason, so done would never refuse: it would record the merge text as the reason for the unproved lines. Also closedGateFlags does not re-check the line rule after a close (a row naming a line, retracted after the close, shows in report but not in closedGate).

## Why
The owner chose option a so that done lists exactly the lines no proof row names and asks for a reason to close without one; a reason given for the close is not a reason for the missing proof.

## Acceptance
done asks for a reason for the unproved lines apart from the close text (a separate flag or form, for example a --without-rows reason), refuses a plain reasoned close while lines are unnamed, and records the reason under Evidence as before; the line printed after an approve and the refusals name that form; closedGateFlags re-checks the rule after a close; the 134 closed issues of the real loop and the loops that never use --line read as before; tests for each

## Changelog
- Fixed: A close that gives a reason for the move no longer stands for a reason for the acceptance lines no proof row names.

## Evidence

