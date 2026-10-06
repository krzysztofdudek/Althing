# 047 · check, review and the after-edit hook judge a file from a directory with no partition of its own by the alphabetically first package (express: test/support/ and .github/ judged by the conventions of examples/)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/partition.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/partition.mjs:147-157 partitionFor (`|| model.partitions[0]`); groupPartitions :322-339 (cuts below 100 scopes drop out, `_repo` only from 30 scopes of the remainder, sorting :330); unreachable `no-partition` path in grain-check.mjs:267
**Branch:** jarl/047-right-norms-per-file
**Merged:** f5f5161
**CI:** none

## What
Reproduction (Grain main ae6152f = 6.1.0, fresh clone of express @7ef9844): `grain check --all test/support/utils.js` → 'check test/support/utils.js — package examples' with an existing deviation 'files here start with the directive use strict' and exemplar examples/auth/index.js; `check --json` → "partition":"examples". The model has cuts [.github, examples, lib, test, test/acceptance, test/support], but partitions only [examples, lib, test, test/acceptance]; test/support has 14 scopes, .github 6, _root 3, together 23 < 30, so there is no `_repo` and the chain falls to partitions[0]. A new test/support/make-agent.js ('use strict', one exported function) → '1 known deviation in your change: package examples convention: files here are named a single lowercase word (index.js, db.js) — Your file make-agent.js is kebab-case'; the byte-identical file as test/make-agent.js → 'package test', 0 deviations. `review --range HEAD~20..HEAD` has one finding: .github/workflows/npm-publish.yml (workflow YAML) judged by the JS file-naming norm of examples, exemplar examples/auth/index.js. The PostToolUse check-hook puts the same wrong hint into the agent's additionalContext. On express this affects 12 tracked files (test/support/*, .github/*, index.js at the root, package.json, .eslintrc.yml). The `partitions[0]` fallback came in with 20e254c (2026-08-25), when partitions were cut from package roots; later MDL cuts (model.cuts) made nested cuts possible that skip their own parent, and the comment :147-148 ('a test suite too small to have norms of its own gets no partition (null), never the production norms') describes the old design. The `_all:file` filenameshape fact is not limited to a grammar, hence YAML judged by a JS norm. Probe: walking up the ancestors gives test/support → test. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-14/ (01-09, among them 05-new-helper-support-vs-test.log, 06-review-range.log, 08-check-hook-support.log, 09-partitionFor-probe.log).

## Why
All three judging surfaces (check, review, the after-edit hook) give a confident, wrong hint: the wrong set of norms and an exemplar from an unrelated directory, after every edit of such a file; here it would push the agent to rename a test helper. docs/mathematics.md:286 ('a partition below 30 scopes says nothing') and README.md:219/310 say otherwise, and the check and review contract has a `no-partition` disclosure for exactly this case, which never fires (tests/read-hook.test.mjs:54-56 admits it).

## Acceptance
- partitionFor for a nested cut without a partition returns the partition of the nearest ancestor that has one (test/support → test), and for a cut with no such ancestor (.github, _root) returns null, so check and review give the no-partition disclosure; never partitions[0].
- express @7ef9844: `grain check --json test/support/utils.js` → partition "test"; `grain check .github/workflows/npm-publish.yml` does not judge it by the norms of examples.

## Changelog
- Fixed: a file in a folder too small to have conventions of its own (test helpers, CI workflows, root files) was judged by an unrelated folder's conventions in check, review and the after-edit hint; it is now judged by the folder that contains it, or check and review say no conventions cover it.

## Evidence

docs: docs/reference.md (check): a file in a directory too small for norms of its own is judged by the nearest enclosing directory that has them; with none, check and review give the no-partition disclosure
- **ran:** node --import ./tests/git-env.mjs --test tests/partition-for-uncovered-files.test.mjs (before / after 4e474ca) · **saw:** before: tests 7, pass 2, fail 5 (test/support/utils.js -> 'examples' expected 'test'; check --json tools/gen9.py -> partition 'app', no noPartition); after: tests 7, pass 7, fail 0
- **ran:** express @7ef9844 (fresh clone, engine at 4e474ca): grain status; grain check --json test/support/utils.js; grain check .github/workflows/npm-publish.yml; grain review --range HEAD~20..HEAD · **saw:** partitions examples·lib·test·test/acceptance; utils.js partition "test" (label package test); npm-publish.yml and index.js: 'no partition covers this file — grain has no norm to hold this file against'; review: 0 findings (was the workflow judged by examples' JS naming norm)
- **ran:** nice -n 15 npm test in plugins/grain at 8fb1959 (no YG_BIN) · **saw:** tests 2038, pass 2008, fail 0, skipped 30, exit 0

jarl: test/support judged by the test partition (as the acceptance says), even if the '~/' import norm is a questionable hint for a helper file — accepted; a file in a small top-level directory, when the repo root is the _root partition, gets no partition (silence) — accepted
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2067, pass 2066, fail 0, skipped 1, merge f5f5161

