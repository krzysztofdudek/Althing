# 084 · yg adopt with the argument `.` or `.yggdrasil` proposes the adoption of the repository's own graph over itself (the documentation says it never can), and a real --replace fails with error[internal]

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-rxrb
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/adopt-transaction.ts, Yggdrasil/source/cli/src/cli/adopt.ts, Yggdrasil/source/cli/tests/unit/cli/adopt.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/adopt-transaction.ts:105-112 (resolveProposal accepts any directory with a `.yggdrasil/`; l.109 matches the repo root itself, the fallback l.110 accepts `.yggdrasil` by name); adopt.ts:202 (the target `path.join(repoRoot, GRAPH_DIR)`) with no comparison against proposal.graphDir; the dry-run branch adopt.ts:264; installGraph adopt-transaction.ts:391 (moving the target aside) and :395 (a copy from the path it has just moved aside, hence ENOENT), :402 rethrow after a successful restorePrevious; adopt.ts:288 and :420 (abortOnUnexpectedError) → error[internal]
**Branch:** jarl/002-adopt
**Merged:** aa73c10ef2b19f5fe1634c9bd1f5a74841433109
**CI:** none

## What
Reproduction (a fresh clone at tag v6.1.0, npm ci, npm run build, `node dist/bin.js --version` 6.1.0; a git repo with a one-node graph, `yg check` PASS; a custom standalone script): `yg adopt . --dry-run`, `yg adopt .yggdrasil --dry-run` and `yg adopt $PWD --dry-run` print 'yg adopt: would accept <arg> → .yggdrasil/' and 'Existing graph moved aside under .yggdrasil.replaced-<timestamp>/', exit 0. `yg adopt . --replace` and `yg adopt .yggdrasil --replace`: "error[internal]: Unexpected error while accepting a proposed graph: ENOENT: no such file or directory, lstat '<repo>/.yggdrasil' ... next: This is a bug — please file an issue", exit 1. After each failure .yggdrasil is back in place, there is no .yggdrasil.replaced-*, `git status --porcelain` is clean, so nothing is lost. Control: a real staging directory (../stage with a copy of the graph) with `--replace` is accepted normally, and the previous graph goes to .yggdrasil.replaced-<ts>/. A plain `yg adopt .` refuses ('This repository already has a graph') and advises 'Re-run with --replace' and 'To compare first, run: yg adopt . --dry-run', so it sends you to a preview that wrongly says 'would accept', and to a real run that crashes. The only test of this guarantee (tests/unit/cli/adopt.test.ts:79-85) covers searching upward from a subdirectory, not passing the root or `.yggdrasil`. This is not 002 nor 034 here. adopt.ts and adopt-transaction.ts unchanged v6.1.0 → main. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-54/logs/v54-adopt-own-graph.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-54/repro/v54-adopt-own-graph.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/logs/f6-adopt-own-graph.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/repro/f6-adopt-own-graph.sh.

## Why
docs/cli-reference.md:2549-2551: 'Nothing else is accepted: the command never searches upward for a graph, so it can never propose to adopt your own graph over itself'; the same promise stands in the docstring of resolveProposal, and the preview and the real run disagree. Passing `.` is an easy mistake, and the answer should be a classified refusal, not an internal error. The restore is exact, so minor.

## Acceptance
After resolveProposal, a realpath of proposal.graphDir equal to the realpath of the target (`<repo>/.yggdrasil`) gives a what/why/next refusal before the dry-run branch and before installGraph: `yg adopt . --dry-run`, `yg adopt .yggdrasil --dry-run` and `yg adopt . --replace` end with exit 1 and this refusal, without the internal code (a unit test for `.`, `.yggdrasil` and an absolute path).

## Changelog
- Fixed: `yg adopt .` / `yg adopt .yggdrasil` (or the same directory by an absolute path) is refused as the repository's own graph (exit 1, nothing moved) instead of a "would accept" preview and an internal error on `--replace`.

## Evidence

- **ran (history):** git commit (merge of jarl/002-adopt into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 aa73c10ef] Merge jarl/002-adopt

