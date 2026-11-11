# 341 · Family: the commits made on main after the release branches were cut enter Yggdrasil's and Grain's release branches

**Status:** done
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261028T0923-srlc
**Tags:** 
**Files:** Yggdrasil/README.md, Yggdrasil/AGENTS.md, Grain/README.md, Grain/CLAUDE.md
**Repo:** ../../../Yggdrasil, ../../../Grain
**Found by:** coordinator
**Where:**
**Branch:** jarl/341-main-into-release
**Merged:** 4ed8e0d8 in Grain
**Merge check:** npm test · saw tests 2355, pass 2342, fail 7 (the known canonical-exemplar seven), skipped 6, with Yggdrasil supplied

## What
Between 2026-10-05 and 2026-11-04 main moved on in both repositories with five commits each that the release branches do not hold. Yggdrasil: Skald leaves the family, start at the step where it hurts, what you install and why, and two commits for Horde leaving the family. Grain: the same three, the family section without em dashes, and one commit for Horde leaving the family. Until they are in, the release branches still describe Horde and the canon check of 267 and 268 cannot pass. A release that fast-forwards main would fail, and one that merges would have to resolve them at the last moment.

## Why
The release branch is what ships; text written on main since must not be lost or fought over during the release steps.

## Acceptance
- Each release branch holds every commit of its origin/main, merged with conflicts resolved in favour of the newer text, and the repository's check is green on the merge
- git rev-list release/6.2.0..origin/main is empty in both repositories, recorded as a row

## Reviews
- **approve** · by rev-341-fable (fresh) · 2026-11-11 · model claude-fable-5-2
  No Critical or Important finding. Line 1 [read], 'Each release branch holds every commit of its origin/main, merged with conflicts resolved in favour of the newer text, and the repository's check is green on the merge': holds. Every file main changed since the merge base is byte-identical to main on the branch, except the ones the release also changed, where both sides' changes are present (Yggdrasil docs/family-contracts.md keeps the release's publisher field and both 6.2.0 corrections; Grain docs/reference.md and the two engine files keep the release's code with main's edits). Every line the release had added to a conflicted file and the branch lacks was traced: Yggdrasil README.md and Grain CLAUDE.md lost only the Skald-era family text main replaced; Yggdrasil docs/family-contracts.md lost one sentence about how Horde keys findings, moot with Horde gone; Grain README.md lost the 2026-10-02 re-measure figures (all of them are in docs/results.md row R2, line 95), the note that the placement example is fixture output (the example itself is gone from main's README, so nothing is left unlabelled) and the 6.1.1 status line (main's README has no status section and states no version, so nothing is wrong today). Horde mentions on each branch are line for line those of origin/main: none in a README, CLAUDE.md, AGENTS.md or docs/family-contracts.md. Line 2 [read], 'git rev-list release/6.2.0..origin/main is empty in both repositories, recorded as a row': holds for both branch tips, and release/6.2.0 is an ancestor of each. Checks re-run on clean copies: Yggdrasil yg check PASS with 0 unverified and 21 of the 22 files of tests/unit/repo green (self-governance-rules could not resolve its package in my copy; the merge does not touch what it reads); Grain 2355 tests, 2342 pass, 7 fail, all canonical-exemplar for the machine's git rule. Minor: Grain README.md no longer names the version it describes; taste, main's choice. Not run by me: Yggdrasil's full repo-check (coverage, browser tests, docs build, markdown lint); the worker's row for it stands untested by me.
  outside the issue, filed as 571: Yggdrasil CHANGELOG.md:5 and Grain CHANGELOG.md:5 still say, in the present tense, that the core of the family is Yggdrasil, Grain, Jarl and Horde; the same text is on origin/main of both, so issue 341 did not introduce it
  outside the issue, filed as 572: Grain docs/validation.md:734 speaks of Horde's retrospective in the present tense, and docs/results.md:32 and :77 name Horde; identical on origin/main

## Evidence

### Proof

- **ran (line 4207545e4882):** git -C Grain/341-main-into-release rev-list HEAD..origin/main (branch jarl/341-main-into-release at 83995d6b) · **saw:** empty (0 commits); all five of Grain's origin/main commits are in the branch
- **ran (line 4207545e4882):** git -C Yggdrasil/341-main-into-release rev-list HEAD..origin/main (branch jarl/341-main-into-release at 62859e4ee) · **saw:** empty (0 commits); all five of Yggdrasil's origin/main commits are in the branch
- **ran (line 590909165fb5):** scripts/repo-check.sh in the yggdrasil devcontainer on the merge 62859e4ee · **saw:** [repo-check] All checks passed; yg check: PASS 34 warnings, 8249 pairs verified (6724 script, 1525 reviewer), 0 unverified
- **ran (line 590909165fb5):** full-gate.sh npm test -- --test-concurrency=6 in plugins/grain on the Grain branch at 8f9e0634 (release/6.2.0 merged in), under MemoryMax=12G, all test files, YG_BIN and GRAIN_CORPUS_CLONES set · **saw:** 2355 tests, 2342 pass, 7 fail, 6 skipped; the 7 failures are all canonical-exemplar (the machine's git rule refuses a commit authored by an AI identity); seams, orphan-child, build-coordination and review-range-not-an-option pass
- **ran (line 590909165fb5):** scripts/repo-check.sh in the yggdrasil devcontainer on de7db752a (merge plus the docs commit) · **saw:** [repo-check] All checks passed; yg check PASS, 0 unverified
- **ran (line 4207545e4882):** git rev-list jarl/341-main-into-release..origin/main in Yggdrasil (tip de7db752a) and in Grain (tip 8f9e0634); git merge-base --is-ancestor release/6.2.0 on both · **saw:** 0 commits in both; release/6.2.0 is an ancestor of both branches, so the same holds for the release branch once each is merged
- **ran (line 590909165fb5):** On a git archive of Yggdrasil de7db752a in the container: vitest run tests/unit/repo, then yg check --approve --only-deterministic and yg check --no-approve with the branch's built CLI. On a git archive of Grain 8f9e0634: full-gate.sh with runes:check and node --test --test-concurrency=6 over all test files, under MemoryMax=12G · **saw:** Yggdrasil: 22 test files of tests/unit/repo pass once the copy has its own git history and installed packages (family-contracts-invariant, family-guard, absolute-wording among them; self-governance-rules could not load its package through a linked node_modules in the copy, not run further); yg check: PASS, 34 warnings, 8249 pairs verified (6724 script, 1525 reviewer), 0 unverified. Grain: runes check green; 2355 tests, 2342 pass, 7 fail, 6 skipped; all 7 failures are canonical-exemplar, refused by this machine's git rule against a commit authored as an AI identity

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: in Grain README.md and CLAUDE.md I took main's text whole. The release branch's only edits there were the Skald removal (already in main) and README figures from the 2026-10-02 re-measure, the fixture-output note and the 6.1.1 status line; main's rewritten README has no such sections, and the figures stay in docs/results.md row R2. In Yggdrasil README.md I took main's text whole (the release's only edit there was the Skald removal).

