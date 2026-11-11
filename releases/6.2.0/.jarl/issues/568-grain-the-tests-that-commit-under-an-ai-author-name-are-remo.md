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

## Reviews
- **changes** · by rev-568-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1434-fnag
  Important (569 line 3, docs/validation.md:44): the Trial 3 paragraph still says, in the present tense, that both faults 'are fixed in the released build' and that the notes 'now arrive before it, on the PreToolUse hook'. That sentence describes a hook as something Grain does today, and after this change it is false. It needs the past tense of a dated record (what the 0.3.0 build did), or to go. The other dated trial lines in docs/results.md (180, 258) and docs/validation.md (33, 37) only report what was measured then; keeping them is right, removing them would falsify the record. | Minor (plugins/grain/tests/portable-manifest.test.mjs:32): the new guard reads the six plugin manifests but not the four marketplace files at the repository root, where a plugin entry can also carry hooks; tried by reading: a 'hooks' key added to one of them would pass the test. Today none has one. | Minor, known limitation (docs/reference.md:244, plugins/grain/engine/grain-session.mjs:28): GRAIN_HOOK_TTL_MS keeps a name that mentions hooks; it is still read by check and review for the pending deviations, and renaming it would silently drop an adopter's setting, so keeping it is the right call. | Checked and found sound: no manifest, hook file, engine branch, store file, skill, README, CLAUDE.md or reference sentence registers, starts or documents a hook; the diff adds no sentence that tells an agent to call Grain (every prose change is a removal or a narrowing; the skill's 'start every task by calling grain_how yourself' is gone too); the seven hook commands answer 'unknown command'; check and explain still refuse a file of a nested repository with the same sentence (otherRepoOf and otherRepoRefusal moved to grain-context.mjs unchanged); the converted tests (check-change-attribution, data-grammar scoping, placement, placement-graph-paths, pathsall-widening, how-places-weighting, cochange-follows-renames, indexed-unclassified-scopes, check-sibling-own-data) keep the assertions of the hook tests they replace on grain check or grain how, and what was dropped asserted only hook envelopes, repeat suppression or the session text; store-lock.mjs lost only the hand-over branch and the longer wait, both reachable only from a hook-started refresh. 568: the two agent-author tests are gone, the five remaining exemplar tests pass, fixtures commit as Dev. Full suite at 49d509e0: 2184 tests, 2178 pass, 0 fail, 6 skipped. Two commits, one per issue, each naming its issue; the changelog entry is on the issue.
  outside the issue, filed as 596: Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (engine/grain.mjs, the default of the dispatcher runs after ensureFresh). A host that still calls a removed hook command, from a registration of its own or a stale copy, now pays a full build on each call and gets exit 1. The refusal belongs before the index is touched.

## Evidence

### Proof

- **ran (line 7a5832f8bee0):** cd plugins/grain && YG_BIN set via full-gate.sh, node --import ./tests/git-env.mjs --test tests/canonical-exemplar.test.mjs (before: all 7 failed on the Claude <claude@anthropic.com> commit; after) · **saw:** 5 tests, 5 pass, 0 fail
- **ran (line 7a5832f8bee0):** cd plugins/grain && full-gate.sh npm test (MemoryMax=12G) · **saw:** 2354 tests, 2346 pass, 0 fail, 8 skipped
- **ran (line 7a5832f8bee0):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test (YG_BIN set; at 49d509e0) · **saw:** 2184 tests, 2178 pass, 0 fail, 6 skipped; the 5 tests of tests/canonical-exemplar.test.mjs (a, c, d, e) pass; no fixture in tests/ commits under an AI author name (grep for the old author and address finds nothing)

### Notes

Assumed: the first line of the test file's header ('Issue 369: who wrote the code is never read') described only the removed agent-author tests, so it is cut with the Fixture (b) paragraph; docs/reference.md, docs/mathematics.md and CHANGELOG describe Grain's behaviour, not these tests, and stay.

