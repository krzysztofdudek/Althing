# 104 · check and the PostToolUse hook blame an untouched declaration's pre-existing deviation as 'in your change' when the edit is up to 3 lines above it

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-check.mjs, Grain/plugins/grain/engine/grain-context.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-check.mjs:55: `touched = (from, to) => ranges.some(([a, b]) => to >= a && from - 3 <= b)`; every changed line up to 3 lines above the start of a scope pulls the scope into the change, whatever the line contains; the same predicate drives steerIn/waiveIn/archIn (:72-77). Removing a decorator does not need the window: changedRanges (grain-context.mjs:362-366) maps a pure deletion `+a,0` to [a, a+1]. Unchanged on main/v6.1.0 and release/6.1.1.
**Branch:** jarl/104-check-change-attribution
**Merged:** 0b629c8
**CI:** none

## What
Reproduction (fresh clone of Grain ae6152f, engine 6.1.0, node 24.11.1; fixture from tests/fixtures/build-fixture.mjs, each scenario in a new directory):

A. In dispute.handler.ts line 4 is `export interface CreateDisputeCommand ...`, and line 6 is `export class CreateDisputeHandler` (without @Handler, a pre-existing deviation). A change to line 4 only (`readonly reason: string;` added), `git diff -U0` shows `@@ -4 +4 @@`. `grain check src/handlers/dispute.handler.ts` goes from '0 deviation(s) in your change, 3 pre-existing' to '1 deviation(s) in your change, 2 pre-existing' and 'Your type `CreateDisputeHandler` (line 6) is not annotated with `@Handler`'; `--json` shows this hit with inChange=True. The exact PostToolUse command from hooks/hooks.json (check-hook) injects the same accusation into additionalContext.
B. Control: a change to line 2 (an import, 4 lines above the class) leaves '0 in your change, 3 pre-existing'. The boundary is exactly the 3-line window.
C. Turning the empty line 3 into a comment also blames the untouched class.
D. A change to the `@Handler()` line itself gives no deviation (correct); a pure removal of the decorator is attributed through the deletion point in changedRanges, not through the window.
E. A comment inserted at line 1 of src/core/service.ts: `Injectable` and `BaseService` become 'new to the index' (before the edit, check said they were not indexed and are 'not in your change'), and `Injectable`, `info` and `warn` get 'Your methods … does not declare a return type of `boolean`'. The hook injects all of it.
G. Beyond the issue: a change to the constructor line itself (7) gives '3 deviation(s) in your change, 0 pre-existing', including 'Your method `handle` (line 9) does not call `validate`' for the untouched handle() method two lines below; the hook injects all three. The @Handler hit on the class is debatable here (line 7 lies within the class's range), but the two handle() hits come from the window alone.

In ordinary code: editing the last statements of one method blames the next one, because methods are usually separated by a single empty line, and editing the last import blames the first declaration below it. The window appears only in a comment in the code. Different from 042 (scope identity by ordinal) and 055 (JSON quotes).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-9/f2-window/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-41/logs/repro-1.log (scenarios A-F, script repro.sh) and <the session scratchpad, since lost>/bughunt/grain/verify-41/logs/repro-2-constructor.log (scenario G, script repro2.sh).

## Why
README.md:263-264 and docs/reference.md:141-142 promise that the PostToolUse hook 'speaks ONLY when it has findings on the touched lines', and check files pre-existing deviations as 'not in your change, not yours to fix' ('existing code is never blamed'). Attribution to the change is exactly what the hook promises on every edit. The bug fires on frequent one-line edits and can push the agent to change code it did not touch. The deviations themselves are real; only the 'in your change' label is wrong.

## Acceptance
- A line above the start of a scope counts towards it only when every line between the changed line and `from` belongs to that scope's own stack of decorators, annotations or attributes; otherwise only the scope's range and the deletion point count.
- Fixture, scenario A (a change to line 4 of dispute.handler.ts only): `grain check` gives '0 deviation(s) in your change, 3 pre-existing', and check-hook stays silent.
- Scenarios C, E and G: a comment instead of an empty line, a comment at line 1 of service.ts and a change to the constructor line do not pull untouched declarations below them into the change; a change to or removal of `@Handler()` itself is still attributed to the class.

## Changelog
- Fixed: after an edit, `check` and the hook no longer blame an untouched declaration's old deviation on you because your edit landed a few lines above it; only its own decorators count as part of it.

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/check-change-attribution.test.mjs (plugins/grain, at 6dca1c9's parent with the test file added) · **saw:** red: A, C, E, G and the stack test fail (pass 2, fail 5); D and D2 pass
- **ran:** same, at 6dca1c9 · **saw:** green: 7/7 pass
- **ran:** round 2: node --import ./tests/git-env.mjs --test tests/check-change-attribution.test.mjs at 5b1b256's engine · **saw:** red: 7/10; commenting out, blanking, and deleting @Handler() from above a comment were filed as pre-existing
- **ran:** same, at 28c822e · **saw:** green: 10/10
- **ran:** flask copy (reviewer's index): '# @pytest.fixture' on tests/conftest.py:37, grain check tests/conftest.py at 28c822e · **saw:** '1 deviation(s) in your change, 1 pre-existing' — 'Your method app_ctx (line 38) is not annotated with @pytest.fixture'
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2008, pass 2007, fail 0, skipped 1, merge 0b629c8

