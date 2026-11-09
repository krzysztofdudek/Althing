# 225 · Yggdrasil: a mapping entry meaning the whole repository — a defined meaning instead of a refusal (the second half of 019)

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-xjhp
**Tags:** yggdrasil, mapping, partial
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** jarl
**Source:** decisions#yggdrasil-scope
**Where:**
**After:** 021
**Branch:** jarl/225-whole-repo-mapping

## What
In 6.1.1 (019) the entries '/', '//', './' and '.' are rejected when a node is loaded; the meaning 'the whole repository' was deferred to 6.2.0 (yggdrasil-scope).

## Why
A project node that deliberately covers everything outside the rest of the graph has no single documented spelling today.

## Acceptance
- One documented mapping spelling means the whole repository (excluding .yggdrasil/, files of nested graphs and coverage.excluded); the other spellings are either normalised to it or rejected with a hint; the type's when rules, owner, context and check treat it consistently; unit and e2e tests.
- The behaviour towards other nodes that map part of the repository is defined (the deepest owner wins) and tested.

## Changelog
- Added: **The mapping entry `.` means the whole repository.** A node that maps `.` owns every file no other node maps: an owner of last resort that gives way to every other node, whatever the hierarchy between them, and leaves out `.yggdrasil/`, separate projects and `coverage.excluded` roots. `yg owner`, `yg context`, `yg check` and a node type's `when:` read it the same way, and a rule on the node runs on exactly those files. Two nodes mapping `.` are a `file-duplicate-mapping` error.
- Before you upgrade: **A node mapping `.` now owns only the files no other node maps.** In 6.1.0 the entry `.` took in every file of the repository, the graph's own `.yggdrasil/` files and the files other nodes own included, so rules on such a node ran on all of them. Now the node keeps the files nothing else maps and none from `.yggdrasil/`, separate projects or `coverage.excluded` roots: its rules run on fewer files and its verdicts are re-verified once. To take in `.yggdrasil/` as well, map the glob `**`. The entries `/`, `//` and `./` (which mapped nothing) and `src/..` no longer load: the error says to write `.`.

## Evidence


- **ran (history):** vitest run tests/e2e/cli-mapping-whole-repository.test.ts against the unchanged build, then after the change; the unit files against a git archive of the base · **saw:** e2e: 13 failed, 1 passed before (the mapping '.' is refused at load); 14 passed after. Unit (whole-repository-entry, whole-repository-graph, runner-whole-repository, node-parser): 30 failed on the base extraction, 123 passed after. 93 related test files, 2343 tests passed after. Full vitest run: 709 of 712 files pass; the 3 failures depend on the repository's own graph being fully verified (reviewer pairs open) or on the worktree directory name containing the word mapping.

2026-10-28 tidy-up: the worktree is gone (the dev container that held it was removed); branch jarl/225-whole-repo-mapping keeps 1 commit beyond release/6.2.0 (4e6456513); the lease ends and the issue returns to the queue

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Deferred: New capability, not a defect of what ships; moved past this release. Ruling backlog-tidy-for-the-three-tools.

