# 217 · Grain: in clustering the kinds (type/method) still mix, and 213 only takes the group away from the mixed ones; counting of renames outside the kept trail is doubled; the rename chain is cut after 20 steps without a warning

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261003T1053-bvwm
**Tags:** grain, 6.2
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-grain-213
**Where:**
**Branch:** jarl/182-file-lineage
**Worker:** w-182b-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 09:55

## What
The reviewer of package 213: on petclinic 43 types were in method groups (42 ambiguous), express had 38 case/method mixes; after 213 these scopes lose their group instead of landing in the group of their own kind. 215: rename commits outside the kept trail counted twice (support below the limit may be overstated). 216: the rename chain stops after 20 steps without a warning.

## Why



## Acceptance
Clustering per kind; no double counting of renames; a chain cut-off reported; tests red→green.

## Changelog
- Fixed: role groups are formed per kind of scope, so a group never mixes a type with methods and a type can only land in a group of types, where its kind forms one; and a file renamed more than 20 times keeps the history of every path it had.

## Evidence


ran: tests/roles-cluster-per-kind.test.mjs and tests/rename-chain-no-cap.test.mjs on release/6.2.0 then on jarl/182-file-lineage (0b5c226) · saw: red (the group medoids are method only, the 14 types have no group; a 25-step chain ends at dir20 and a scope edit is not found under dir25), green all pass; the cut-off cannot occur any more, so there is nothing to disclose; the rename-commit double count is closed by issue 182

docs: none needed (docs/reference.md names no 20-step limit)
- **ran (history):** grain refresh and export on read-only copies of the gate corpus clones, on the tip (97767f8) · **saw:** petclinic (500158f, shallow, no history): 9 groups, 0 mixed, all methods (68 members), no group of types in src/main/java (6 groups) or src/test (3 groups); its 25 eligible types per partition form no cluster, so they have no group. express: 103 groups, 0 mixed, 612 case and 43 method members, assigned as on the base. So the plan's check (petclinic's 43 types and express's 38 mixes land in groups of their own kind) does not hold on these corpora; the change only guarantees a cluster never mixes kinds, so a type is in a group of types where its kind forms one. Part 2 stands on issue 182. Note for the jarl: engine/evals.mjs:288 keeps its own 64-step rename walk, untouched.

2026-10-28 tidy-up: the worktree directory is gone; its work sits on branch jarl/182-file-lineage (6 commits beyond release/6.2.0, 97767f8), shared with 182; the lease ends and the issue returns to the queue
- **ran (line 8f4936ccfe53):** node --import ./tests/git-env.mjs --test tests/roles-cluster-per-kind.test.mjs, and tests/rename-chain-no-cap.test.mjs without its followRenames case (the module does not exist there), in plugins/grain of release/6.2.0 (b1ddc48, extracted with git archive) · **saw:** red: per kind: group medoids [method] where [method, type] is expected, the types get no group; chain: currentPathOf ends a 25-step chain at dir20/f.js (expected dir25/f.js), liveKey gives dir0/f.js#fn (expected dir25/f.js#fn)
- **ran (line 8f4936ccfe53):** the same four test files on jarl/182-file-lineage (9b43fb4) · **saw:** green: 15 of 15 pass; roles-cluster-per-kind 2 of 2, rename-chain-no-cap 3 of 3 (a cycle ends the chain); the rename double count outside the window is 182's rows (b.js~p.js 8 of 9, reviewer's case 12 of 14)

Assumed: the line's 'a chain cut-off reported' is met by removing the cut-off: a chain is followed to its end and only a cycle ends it, from which no live path is reachable, so there is nothing left to report (the reviewer of 2026-10-12 called it rightly moot).

