# 129 · review --json loses the `missing:` lines from the recipe and from the stem half of kin that the text report prints

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-check.mjs, Grain/plugins/grain/engine/completeness.mjs, Grain/docs/reference.md
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-check.mjs:627-631 builds `missing` through missingLines (sources: cochange, recipe, kin, shape), but those strings go only to the text branch (:692 `lines.push(...missing)`); the --json branch (:659-666) rebuilds `missing` from scratch, only from the value half of `kin` (valueKinGaps), and co-changes go separately as `cochangePartners`; in completeness.mjs the recipe (:232, through recipeLines :152), the stem half of kin (:278 onwards) and shape (:343) give only rendered strings, with no function returning data. Lines 659-666 are byte for byte the same on release/6.1.1.
**Branch:** jarl/116-review-output-truth
**Merged:** b45af68
**CI:** none

## What
Reproduction (fresh clone from GitHub, v6.1.0-1-gae6152f, node 24.11.1; fresh fixture with an added untracked src/handlers/lamp.handler.ts, a copy of order.handler.ts made with sed):
- Text: `grain review` prints a 'missing from your change:' block with 12 `recipe:` lines (no same-stem *.dto.ts companion, no registration in *.test.ts), exit 0.
- JSON: `grain review --json` and a bare `grain check --json` (schema grain-check/1) give files=[lamp.handler.ts], findings=[], cochangePartners=[] and missing={"kin":[]}; 'recipe', 'same-stem' and 'registered by' occur 0 times.
- --staged: the same gap, 12 recipe lines in the text and missing={"kin":[]} in the JSON.
A script reading the JSON will take this change as clean, while the text lists 12 items.

Narrowings relative to the report:
1. Shape is left out deliberately: plugins/grain/tests/missing-shape.test.mjs:144-155 ('(d) --json carries no `shape` field (only `kin`) — the text line has no JSON counterpart, by scope decision') checks that Object.keys(j.missing) is ['kin'], and plan J4.2 records the same choice. Only the test and the plan say so, not docs/reference.md. The recipe and the stem half of kin have no such decision: their tickets (J0.2, J3.2) did not mention JSON, and J3.2 asked only for the value half (`missing.kin[]`), so they were left out because nobody asked for them.
2. The CI path from the documented recipe (`check --range BASE..HEAD`, lamp.handler.ts committed) does not show the recipe gap, because there the text itself says 'clean — nothing to report' and text and JSON agree. knownFiles probably comes from the HEAD model, so a file added in the range counts as known; this may be a separate bug (the recipe never fires with --range).
3. Lines 1-2 and 9-10 of the recipe block are identical: recipeLines deduplicates by the marker key, not by the rendered text, so two keys with the same companion pattern print the same sentence twice (completeness.mjs:249-268).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-9/f8-review-json/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-67/repro.log (worktree review versus review --json and a bare check --json), <the session scratchpad, since lost>/bughunt/grain/verify-67/repro-staged.log (--staged), <the session scratchpad, since lost>/bughunt/grain/verify-67/repro-range.log (--range, the documented CI path).

## Why
docs/reference.md:412-414 presents the grain-check/1 payload, including `missing` at the top level, as 'suitable for a script to consume without re-deriving it from text', and docs/reference.md:22-23 lists the recipe, kin and the change shape as sources of `missing:` in review; nowhere does it say that `missing` carries only the value half of kin. The gap affects the default worktree review, --staged and every MCP client or agent using json:true. The JSON only loses information and nothing fails, hence minor.

## Acceptance
- `missing` in --json carries the same recipe and kin stem-half items as the text, from functions that return data, not from prose.
- Leaving shape out of the JSON is either reversed (together with a change to test (d) in missing-shape.test.mjs) or described in docs/reference.md.
- Fixture with lamp.handler.ts: `grain review --json` has as many recipe items in `missing` as there are distinct `recipe:` lines in the text, and the text does not repeat identical lines.

## Changelog
- Fixed: `grain review --json` now lists the companion files, registrations and name-paired counterparts a new file is missing, the same items the text report prints; the text no longer repeats an identical line.

## Evidence

docs: docs/reference.md, 'Recipe for a CI PR comment' (grain-check/1): missing holds kin[] (value half), kinStem[] {file, counterpart, group, n, of} and recipe[] {carrier, need: companion|registration, pattern|registeredIn|registeredBy, share (companion), n, of (registration), files}; the 'change shape:' line has no JSON counterpart (by decision, missing-shape.test.mjs (d)).

red→green: review-json-missing-recipe.test.mjs + kin-completeness (c) + missing-shape (d) — old engine 13 pass / 6 fail (missing = {kin: []} while text printed 12 recipe lines, 2 duplicated); new engine all pass. Fixture lamp.handler.ts: 10 distinct recipe lines = 10 missing.recipe items. Commit 7b5d773. Found: with --range the new file counts as known (knownFiles from HEAD model), so recipe never fires in CI path — not fixed.

Ruling 116-no-all-use: The acceptance line of 116 about printing the all ↔ use pair on express is dropped: the data show that these methods change together as named functions in only 3 commits, below the threshold of 8, so the requirement rested on a false premise. The contract of 116 remains: pairs with an anonymous side do not use up the budget and are not printed, and named pairs that meet the threshold are printed under their own heading. Same-named pairs keyed by position stay in 042. The JSON key names recipe and kinStem (129) are accepted.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2202, pass 2201, fail 0, skipped 1, merge b45af68

