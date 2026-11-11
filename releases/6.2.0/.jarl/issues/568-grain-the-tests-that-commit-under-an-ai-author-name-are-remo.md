# 568 · Grain: the tests that commit under an AI author name are removed, and the exemplar-ranking tests keep running with a person's name

**Status:** in-progress
**Kind:** test
**Priority:** 2
**Tier:** light
**Key:** 20261111T1234-nzuc
**Tags:** grain, tests
**Files:** Grain/plugins/grain/tests/canonical-exemplar.test.mjs
**Repo:** Grain
**Found by:** jarl
**Where:**
**Branch:** jarl/569-no-hooks
**Worker:** w-569-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 12:49

## What
tests/canonical-exemplar.test.mjs builds its fixture repositories with commits by 'Claude <claude@anthropic.com>' to prove Grain never reads who wrote the code; this machine's git rules refuse those commits, so all 7 tests of the file fail before they check anything. On the owner's word (ruling grain-agent-author-tests-removed) the agent-author tests (b) go, and the fixtures of the other tests are committed under a person's name so the exemplar ranking (a, c, d, e) keeps its proof.

## Why
A test that can never run on the machine the family is built on proves nothing there.

## Acceptance
[test] tests/canonical-exemplar.test.mjs runs to its end on this machine with every remaining test passing, and no fixture commits under an AI author name · by: cd plugins/grain && npm test

## Evidence

### Proof

- **ran (line 7a5832f8bee0):** cd plugins/grain && YG_BIN set via full-gate.sh, node --import ./tests/git-env.mjs --test tests/canonical-exemplar.test.mjs (before: all 7 failed on the Claude <claude@anthropic.com> commit; after) · **saw:** 5 tests, 5 pass, 0 fail
- **ran (line 7a5832f8bee0):** cd plugins/grain && full-gate.sh npm test (MemoryMax=12G) · **saw:** 2354 tests, 2346 pass, 0 fail, 8 skipped

### Notes

Assumed: the first line of the test file's header ('Issue 369: who wrote the code is never read') described only the removed agent-author tests, so it is cut with the Fixture (b) paragraph; docs/reference.md, docs/mathematics.md and CHANGELOG describe Grain's behaviour, not these tests, and stay.

