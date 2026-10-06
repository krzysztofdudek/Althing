# 105 · A deviation on a sibling surface prints the conforming count of the lead fact: '30/30 established methods conform' next to a method that does not conform

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/check.mjs, Grain/plugins/grain/engine/mine.mjs, Grain/plugins/grain/engine/grain.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/check.mjs:175 `const conformN = f.sraw - Math.round((1 - f.share) * f.sraw);` computed from the lead fact `f` inside the loop over `sf` in `[f, ...(f.siblings || [])]` (:143), printed as `${conformN}/${f.sraw}` in the deviation line (:240) and in the waiver's 'decided' line (:197); the shares at :169-173 already use `sf.srawCounts`. Siblings are joined at a Jaccard of the conforming sets >= 0.9 (mine.mjs:575-583), with their own srawCounts (mine.mjs:593-601). Unchanged on release/6.1.1.
**Branch:** jarl/104-check-change-attribution
**Merged:** 0b629c8
**CI:** none

## What
Reproduction (fresh clone v6.1.0-1-gae6152f, engine 6.1.0): `build-fixture.mjs`, one extra commit so that the planned dispute deviation becomes established, `grain refresh`, then `grain check src/handlers/dispute.handler.ts --all`:

'[grain] handle convention: methods here call `validate` (a sibling surface of: call `this.service.apply`)'
'30/30 established methods conform. Pre-existing: 1 method not touched by your change (`handle` (line 9)) does not call `validate`.'

The second sibling surface (the structure `expression_statement(call_expression(identifier,arguments))`) gets the same wrong 30/30. A hand-written src/handlers/lease.handler.ts without `validate(cmd)` in a second fresh fixture: '30/30 established methods conform. Your method `handle` (line 10) does not call `validate`.'

The truth: `git grep -l 'validate(cmd)' HEAD -- src/handlers` gives 29 of 30 files. In model.json the lead fact `auto.call:this.service.apply` has srawCounts {true:30}, and its sibling `auto.call:validate` {true:29,false:1}. A probe (a copy of the engine that only appends the sibling's own counts to the line) prints '30/30 ... [probe: sibling own srawCounts 29/30]' for both sibling surfaces; for a lead fact without siblings (`@Handler`) the printed count and the probe agree at 29/30, so the bug concerns only sibling surfaces. The `--all` output contradicts itself: all 30 established methods conform, and then one established method is listed as non-conforming. This happens every time an existing scope deviates only on a sibling surface, because such a scope necessarily conforms to the lead fact.

Related, not verified separately: engine/grain.mjs:349-355 uses the same conformN pattern from the lead fact in the 'don't copy that part' line of the `where` command; the clause 'local default of this group' (check.mjs:177) also takes the lead fact's `parentExp`. Issue 399 from release-6.1.0 does not cover this (sibling specificity, not counts).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-9/f1-sibling/repro.log and repro-newfile.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-42/repro.log, repro-newfile.log, probe.log.

## Why
This is a false, self-contradicting number on the agent's main surface (`check`, the post-edit hook, `review`), and it appears systematically. README.md:371 and docs/results.md:169 name this class ('deviant counts were taken over one population while the percentage beside them came from another') as the only false class from audit #2 and say it was fixed; the comment in check.mjs:169 says outright that it is 'the SAME population the message prints'. The deviation verdict, its direction and the preference-gap bits are correct, and the error is at most about 10% of N.

## Acceptance
- When `sf !== f`, n/N in the deviation line and in the waiver's 'decided' line come from `sf.srawCounts` (n = sf.srawCounts[sf.exp], N = the sum of sf.srawCounts).
- The repro fixture: `grain check src/handlers/dispute.handler.ts --all` prints '29/30 established methods conform' for the `validate` surface, and a check of lease.handler.ts without `validate(cmd)` also gives 29/30.
- The 'don't copy that part' line in `where` (grain.mjs:349-355) counts n/N from the population of the surface it names.

## Changelog
- Fixed: when code departs from a second rule that goes with a main one, `check` now prints how many places follow that rule, not the count of the main one (it said 30/30 next to the one place that did not).

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/sibling-surface-counts.test.mjs (plugins/grain) before the fix · **saw:** red: 0/3 pass; output printed '30/30 established methods conform' (4x) and '30/30 established do it the other way' (2x)
- **ran:** same, at bf654bb · **saw:** green: 3/3 pass, '29/30' for both sibling surfaces of handle, for a new lease.handler.ts without validate, and in the waiver's decided line

read-hook (grain.mjs ~349) verified, not edited: it iterates lead facts only, names the lead surface and prints the lead's own counts; on the fixture with dispute established it says '29/30 established do it the other way' for @Handler, matching srawCounts {true:29,false:1}.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2008, pass 2007, fail 0, skipped 1, merge 0b629c8

