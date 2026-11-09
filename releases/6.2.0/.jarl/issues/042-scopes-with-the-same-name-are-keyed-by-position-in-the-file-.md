# 042 · Scopes with the same name are keyed by position in the file, so adding a sibling splices together the histories of different functions: false drift ('fading', after which check stops flagging) and a false 'tried N×, reverted N×' with steer advice (click)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-lrlr
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/scopes.mjs, Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/engine/facts.mjs, Grain/plugins/grain/engine/weights.mjs, Grain/plugins/grain/engine/mine.mjs, Grain/plugins/grain/engine/check.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/report-facts.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/scopes.mjs:825-831 (s.ord = position among scopes of the same kind and name); history.mjs:578-614 (replay keyed k#n#o, state.lc and state.vev); facts.mjs:11 skeyR (rel#kind#name#ord); consumers: weights.mjs:61 changePointFor → settleChangePoints :119/:148/:150, weights.mjs:164 rejectedValues, mine.mjs:689 heldSummary, check.mjs:157-158 (backing off on a trend), report-facts.mjs:223-230 (steer advice), learn.mjs:253 and check.mjs:80-84 (sticky roles)
**Branch:** jarl/180-scopes-and-history
**Merged:** 77473cb
**CI:** none

## What
Reproduction (Grain v6.1.0, pallets/click @06b2a67). The report's drift section: '↓ group «click.command+click.option+cli»: methods here are annotated with `@click.option` — 100>0% · a newer pattern is emerging: false'; in the export, trend {since 2018-09-13, shares 1 (n18) > 0 (n5), fading:true, nucleating:'false'}. Meanwhile the convention today has 23 conforming and 0 deviants, each with @click.option right above def, including members added in 2020-08, 2021-04, 2021-09, 2025-08 and 2026-07, and git shows they were born with @click.option. Attributing the 57 H.vev events of the 23 members to the function that actually held the given ordinal in the given commit (Python ast, identity = test name) matches the recorded value in 57/57; 39 of the 57 events belong to another function, and none of the 10 click.option=false events concerns the member itself. The same data keyed by identity give, in changePointFor and settleChangePoints, one segment {share 1, n 23}, fading false. Effect: trend.fading=true and suppressedValue='false', so check.mjs:157 and :158 go quiet; removing @click.option from cli in test_hidden_option gives no remark at all, while a copy of the engine with these lines disabled says '23/23 established methods conform. Your method `cli` (line 785) is not annotated with `@click.option`'. The health section: 'group «t.overload+command+group» — is not annotated with `@t.overload` tried 5×, reverted 5× — a rejection … → grain decide steer src/click/decorators.py#command --surfaces auto.deco:@t.overload', while in every commit of decorators.py the stubs have @t.overload and the implementation never does; only the number of stubs before the implementation changed (I → S S I → S S S S I → S S S I → S S S S I), and lifecycle gives firstConforming 2014-04-26, although @t.overload appears in 2021-12/2022-02. 'tried 28×' (test_options) and 'tried 9×' (test_basic, 32 functions `def cli(`) arise the same way. Beyond the report: inserting one test with `@click.group() def cli()` above test_option_reusing_help_flag gives, in `check --all`, 5 false accusations against the new function and 4 against untouched ones (e.g. 'not annotated with @click.command' for cli in test_basic_group) and marks an old function as 'new to the index'; on the unchanged file there are only the 3 existing `@cli.command` deviations. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-7/logs/v7-ordinal-splice.log (script v7-ordinal-splice.sh, helpers <the session scratchpad, since lost>/bughunt/grain/verify-7/tools/), <the session scratchpad, since lost>/bughunt/grain/verify-7/logs/v7-options-28x.log.

## Why
Every file with repeated scope names (nested `def cli` in pytest, overload stubs, method overloads in Java, C# and TS, if those grammars key the same way) gets a spliced history: real conventions stop being enforced, the report invents rejections with advice to record a decision ('value already rejected 5×'), and check, after an ordinary insertion of a function, accuses untouched code. docs/mathematics.md ('Drift and nucleation') assumes the birth order of scopes, and history.mjs:553-556 deliberately keeps a scope's timeline across a file rename.

## Acceptance
- A function's value history belongs to that function: adding or removing a same-named sibling does not register as a birth, departure, repair or rejection (scope identity independent of the ordinal).
- click @06b2a67: «click.command+click.option+cli» is not reported as fading, `check` flags the removal of @click.option from cli in test_hidden_option, and the health report has no 'tried 5×' for @t.overload; a synthetic test with an inserted same-named sibling.

## Changelog
- Fixed: functions that share a name in one file (overloads, nested test functions) no longer produce false drift, a silenced check, or a 'tried N×, reverted N×' rejection with advice to record a decision.

## Evidence

docs: docs/validation.md:196 (Spot checks): drop the claim that click's 'fading' @click.option in tests/test_basic.py is a correct detection — it came from same-named 'def cli' scopes keyed by position, and 6.1.1 no longer draws trends from such scopes; the click spot check is now 0 change points from that group. Same correction in docs/results.md N8 row ('click 1 ... fading, correctly').

commit f95547e: tests/same-name-scopes-no-trend.test.mjs red before (4 of 5 fail on the old weights.mjs), green after; change-point, rejected-values, one-word-name-shapes tests still pass. Full re-keying left for 6.2 per grain-scope.

correction to the docs note above: the click effect was NOT re-measured (no click clone in the scratchpad; the bughunt verify-7 logs are gone). The final pass should re-run the click spot check before writing the replacement sentence; expected from the unit test: the cli group's births are all position-keyed, so no trend is read for it.

Ruling 042-file-quarantine: The 042 quarantine stays at file level (all functions with the same name in the file), not only siblings under one parent: on click, 'def cli' sits in different test functions and narrowing brings back the false 'fading', and the history alone cannot tell these cases apart. Cost: ~5% of scopes without trend conclusions — better no conclusion than a false one. The proper solution (re-keying scopes) in 6.2.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2279, pass 2278, fail 0, skipped 1, merge 77473cb

Ruling ask-007 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

