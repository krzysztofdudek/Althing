# 044 · 'held since' (and firstConforming in the export) gives the birth date of the oldest scope that conforms today, not the start of the convention, so it points to dates before the API or the language feature existed

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0737-mffw
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/mine.mjs, Grain/plugins/grain/engine/export.mjs, Grain/plugins/grain/engine/learn.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/mine.mjs:688-720 heldSummary: `since = min(H.lc.get(scopeKey).first)` and `last = max(L.last)` over f.conform; H.vev is read only for repairs and departures (:705-717) and only for the five families decoded by valOf; export.mjs:526-534 (firstConforming, lastConformingTouch, valueTracked); learn.mjs:439-447 (the same for templates and superposition)
**Branch:** jarl/044-held-since-and-shallow
**Merged:** dd66c06
**CI:** none

## What
Reproduction (Grain ae6152f). commander.js @ba6d13d: the report 'group «has+option+program»: named callbacks here call `assert.deepEqual` — 100% of 6 established · held since 2020-01', export firstConforming 2020-01-15, valueTracked false, trend null. Pickaxe: the oldest commit with assert.deepEqual in the repo is 3dd6086 (2026-01-12, 'Switch from Jest to Node.js built-in test runner'), `git grep` on 3dd6086^ finds nothing, and the conforming site tests/command.parseOptions.test.js:122 used `expect(result).toEqual(...)` from the file's creation (62234f6, 2020-01-15) until 3dd6086^. gin @43fe48e: '«Context+bind+body»: methods here take a parameter of type any — held since 2017-03' and '«bind»: … any — held since 2015-03', while `obj any` appears only in 2bde107 (2022-03-21, 'test support go1.18'; Go has had `any` since 1.18); 'methods here call require.NoError — held since 2017-10', while the first require.NoError in the repo is f7becac (2019-10-10), and for the first conforming site only 5f55c6a (2024-07-14). The same dates go into the `grain where bind body` card ('held since 2017-03, last reinforced 2025-05') and into the check note. Scale: on gin 67 of 67 conventions with a lifecycle have valueTracked false, on commander 23 of 25, so for almost every convention 'held since' in practice means 'the birth of the oldest conforming scope'. Display only: f.held and lifecycle feed no gate, accusation, status or propose decision. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-9/logs/v9-commander.log, v9-commander-site.log, v9-gin.log, v9-gin-site.log, v9-gin-agent-surface.log.

## Why
SKILL.md:96 tells agents that '(held since …, last reinforced …) says how old and how alive the rule is', README:222 advertises the same, and docs/validation.md counts the held since dates among its audited claims. An agent reads 'stable for six years' where there was a migration nine months ago.

## Acceptance
- 'held since' is the first time the scope had the expected value (the first vev event with a value equal to f.exp); for families without value tracking the clause is left out or named after what it measures.
- commander.js @ba6d13d and gin @43fe48e: no 'held since' date is earlier than the first commit in which the convention's identifier occurs in the repository (assert.deepEqual, `obj any`, require.NoError).

## Changelog
- Fixed: "held since" now gives the month a convention began to hold, not the birth of the oldest code that follows it today; where Grain cannot tell when code took up a convention, the note says how old the oldest conforming code is instead.

## Evidence

docs: plugins/grain/skills/grain/SKILL.md:96 and README:224: '(held since …)' is when the rule began to hold; for conventions Grain cannot date it reads 'the oldest of the conforming … dates from …'. docs/reference.md export lifecycle: firstConforming/firstDeviating = first time a scope took/left the expected value, null when valueTracked is false. Commit f807474; red→green: tests/held-since-from-first-conforming-value.test.mjs 3/3 red → green; deviation-cost (a),(e) updated to the renamed clause. commander @ba6d13d, gin @43fe48e: no held-since before the identifier's first commit (gin 0 held-since clauses).
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2164, pass 2163, fail 0, skipped 1, merge dd66c06

