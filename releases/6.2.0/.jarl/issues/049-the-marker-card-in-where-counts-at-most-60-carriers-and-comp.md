# 049 · The marker card in `where` counts at most 60 carriers and computes the 'lives in' percentages and the observations from that truncated sample

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/cards.mjs, Grain/plugins/grain/engine/where.mjs, Grain/plugins/grain/engine/export.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/learn.mjs:427-434 (sorting of the carriers and `.slice(0, 60)` in the model itself, also on release/6.1.1); consumers: cards.mjs:145-150 (dirs, topDirs) and :184 (`n: keys.length`), where.mjs:376 and :394, learn.mjs:481-513 (markerObs with the 2/3 threshold on :491, markerImplied), export.mjs:435 (carriers)
**Branch:** jarl/049-where-cards
**Merged:** d46e9f3
**CI:** none

## What
Reproduction (Grain ae6152f = 6.1.0). A synthetic repo with 100 functions with @app.route, 60 in pkg/handlers/ and 40 in pkg/views/: `grain where 'app route'` → 'marker @app.route — 60 carriers … lives in: pkg/handlers/ (100%) … +57 more'; `--json` size 60, directories [{pkg/handlers, 60}]; pkg/views/ is not on the marker card. A variant with the 40 view functions named camelCase: 'its carriers share (observed, not certified): named snake_case (60/60)', while on the full population it is 60/100, below its own 2/3 threshold, so the truncation creates a false observation. Control (an engine copy without `.slice(0, 60)`): '100 carriers … lives in: pkg/handlers/ (60%) · pkg/views/ (40%) … +97 more', and the snake_case observation disappears. pallets/flask @d73fa1c: `grain where route` → 'marker @app.route — 60 carriers (package tests)', while an AST counter finds 208 functions with @app.route directly in tests/ (the control without the limit prints exactly '208 carriers'); `grain export` for the tests partition has only 60 carriers and lacks tests/test_basic.py (91), test_blueprints.py (17), test_templating.py (16), test_helpers.py (9), because the sort puts the files with the fewest scopes first; the observation is 49/60 with the limit, 143/208 without. The limit of 60 is not documented (README, docs/reference.md, the constants table in docs/mathematics.md), and the README describes export as 'the whole model as data'; the limit has been there since the first commit 16fa901. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-16/v16-marker-carriers-capped.log (syn-a/make.sh, syn-b/make.sh, tools/count_app_route.py, grain-nocap/).

## Why
`where` is the agent's main answer to the question 'where do things like this live'. For every marker with more than 60 carriers it silently gives the wrong count and wrong directory shares, and sometimes an observation the full population does not confirm; the export carries the same truncation.

## Acceptance
- The carrier count, the directory histogram, markerObs and markerImplied are computed on the full population; only the list of carriers to copy (exemplars) is cut.
- The synthetic repo from the reproduction: `grain where 'app route'` → '100 carriers' and 'pkg/handlers/ (60%) · pkg/views/ (40%)'; flask @d73fa1c: `grain where route` → '208 carriers'.

## Changelog
- Fixed: `where` on a decorator, base type or return type with more than 60 users counted only 60 of them, so the count, the directory shares and the shared traits it reported were wrong; the export now lists every one too.

## Evidence

2f2f7e0 (branch jarl/049-where-cards): learn.mjs keeps every carrier (the sort stays, the slice(0,60) goes); readers already cut the exemplar list (text 3, --json 12). tests/marker-full-population.test.mjs red before (60 carriers, pkg/handlers/ (100%), 'named snake_case (60/60)', export 60) → green after (3/3). flask @d73fa1c: 'marker @app.route — 208 carriers (package tests)', observation 143/208. Needs: MODEL_V (cached models hold the cut lists).
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2157, pass 2156, fail 0, skipped 1, merge d46e9f3 (second full run; the first failed only the timing-sensitive MCP SIGINT test, which passed alone)

