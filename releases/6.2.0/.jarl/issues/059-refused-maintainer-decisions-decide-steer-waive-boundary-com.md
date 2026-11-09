# 059 · Refused maintainer decisions (decide steer, waive, boundary) come back with isError: false and exit 0, although nothing was recorded, contrary to the documented contract

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0737-qkho
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-seed.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-seed.mjs (v6.1.0 ae6152f): scopeSurfaces returns {error} on :52 ('no partition covers'), :54 ('no scopes indexed for', also for a nonexistent file), :56-62 ('no scope named', 'pick one scope of'); :138 `if (r.error) return [r.error, stamp()]`; :151-157 (steer without --surfaces); :176-180 (duplicate seed); :227, :228-232 and :239-243 (waive); :272-273 (duplicate boundary); only :119, :158-162 and :165-169 throw (exit 1)
**Branch:** jarl/059-small-cli-truths
**Merged:** f905da4
**CI:** none

## What
Reproduction (fresh clone of Grain v6.1.0, own JS fixture with 9 commits: src/core/service.js and src/handlers/h1..h8.handler.js). MCP: grain_decide_steer {target:'src/handlers/h1.handler.js#NoSuchThing', surfaces:'auto.nameshape', note:'x'} and grain_decide_waive with the same unknown scope and on:'auto.nameshape' → 'no scope named NoSuchThing in src/handlers/h1.handler.js', isError: false; grain_decide_boundary {from:'src/handlers', never-imports:'src/core'} a second time → 'boundary 35b4c32d already exists', isError: false; steer on a nonexistent file → isError: false; for comparison, steer with an unknown surface and rm with an unknown id → isError: true. `cat .grain/seeds.jsonl` → only the first boundary and the first waiver. CLI: `decide steer h1#NoSuchThing`, `decide waive h1#NoSuchThing`, `decide steer h1.handler.js` (without #name, 'pick one scope'), `decide steer src/handlers/nope.js#X`, `decide steer README.md#X`, a second `decide boundary` and `decide steer` without --surfaces: all exit 0 and record nothing, while `--surfaces auto.bogus`, `decide rm deadbeef`, `grain check src/handlers/nope.js` and `grain cochange --files src/nope` end with exit 1. The duplicate case is debatable (an idempotent re-add), but the new note is lost anyway. Alongside: `grain explain src/nope.js` exit 0 with '(no scopes extracted for src/nope.js)'. The tests (tests/decide-waive.test.mjs:136, tests/grain.test.mjs:192, tests/mcp-server.test.mjs) do not check the exit code of these paths. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-26/mcp-repro.log, cli-repro.log, other-refusals.log.

## Why
docs/reference.md:258-259 (MCP server, Errors) gives 'a refused decision' and 'a file that does not exist' as examples of a run with a nonzero exit and isError: true, and SKILL.md:19 tells agents 'A refusal or a failed check comes back with isError: true'. Scripts like `grain decide … && git commit` and agents that branch on isError carry on as if the decision had been recorded. The refusal text is explicit, so a careful reader will notice it.

## Acceptance
- Every decide path that records nothing (unknown or ambiguous scope, nonexistent file, no partition, steer without --surfaces, duplicate) ends with exit 1, and over MCP with isError: true, like the unknown-surface path.
- A CLI and MCP test for 'no scope named' and 'already exists' checks the exit code and isError.

## Changelog
- Fixed: a decision grain refuses to record (an unknown or ambiguous scope, a file with no scopes, a steer without surfaces, a decision that already exists) now exits 1, and over MCP comes back as an error, instead of looking like success.

## Evidence

docs: none needed — docs/reference.md (MCP server, Errors) and SKILL.md already promise exit 1 / isError: true for a refused decision; the code now matches.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2092, pass 2091, fail 0, skipped 1, merge f905da4

