# 193 · Yggdrasil: a committed symlink .yggdrasil/.ast-cache to a forged cache turns FAIL into PASS (false green)

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T1617-vzmd
**Tags:** yggdrasil, security
**Files:** Yggdrasil/source/cli/src/io/ast-cache.ts
**Repo:** ../../../Yggdrasil
**After:** 063
**Found by:** ygg-063
**Where:**
**Branch:** jarl/063-local-writes
**Merged:** 786a2847333c0ea01ee390b47922ffa8efdd75ec
**CI:** none

## What
The ignore rule '.ast-cache/' does not catch a symlink of that name, so a branch can commit .yggdrasil/.ast-cache -> ../forged-cache without git add -f. yg check reads the cache through the link, and the forged fragments turn relation-undeclared-dependency (FAIL) into PASS — reproduced by the worker of 063. .type-class-cache most likely has the same problem.

## Why
The CI gate can be silently switched off by a change in a branch; this is a false green on the tool's main promise.

## Acceptance
A local cache under .yggdrasil/ behind a symlink is not read (it is rebuilt or rejected with a clear error); a test with a forged cache through a link — FAIL stays FAIL; the same for .type-class-cache.

## Changelog
- Security: a branch can no longer forge the caches yg check reads — a parse, classification or script-verdict cache behind a symbolic link is never read; the check runs as if it were empty.

## Evidence

Hard links are out of scope, with no fix: git cannot carry a hard link, so a branch cannot commit one into .yggdrasil/.
- **ran (history):** vitest run tests/e2e/cli-local-state-links.test.ts (before the fix) · **saw:** 7 and 8 failed: a committed forged parse / classification cache on a fresh clone gave yg check: PASS
- **ran (history):** vitest run tests/e2e/cli-local-state-links.test.ts (after the fix) · **saw:** 8 passed: error[relation-undeclared-dependency] / error[unmapped] stay, a warning names .yggdrasil/.ast-cache / .type-class-cache

Ruling 193-tracked-cache-untrusted: 193: a local cache/state under .yggdrasil/ tracked by git (index or HEAD) is never trusted — including .yg-lock.deterministic.json. Test 6A in cli-log-remaining, which claims that a committed verdict cache survives a revert, is rewritten (option a): revert only the committed files, no log-integrity, a clean free fill, check --approve exit 0. This closes a false green, so per ask-001 (the owner: blocking right away with 'Before you upgrade') it goes in with a CHANGELOG note: a repository that commits .yg-lock.deterministic.json or another local cache will get a warning and unverified script pairs after the upgrade — the fix: add the file to .gitignore, remove it from the index (git rm --cached) and run the free yg check --approve --only-deterministic.
- **ran (history):** git commit (merge of jarl/063-local-writes into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8100 pairs verified; [repo-check] All checks passed; [release/6.1.1 786a28473] Merge jarl/063-local-writes

merged at 786a28473 with c5aba2aac as the tip: 42753644c (fail-closed) got changes from the reviewer because it broke CI under dubious ownership; c5aba2aac restores the behaviour approved on 0a011fd0b plus a warning and LC_ALL=C as the orchestrator ruled, accepted by the orchestrator without a new review

Ruling ask-005 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

