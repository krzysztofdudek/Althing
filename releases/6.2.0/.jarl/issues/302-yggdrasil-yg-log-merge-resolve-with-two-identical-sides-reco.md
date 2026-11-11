# 302 · Yggdrasil: yg log merge-resolve with two identical sides records a baseline over a committed rewrite of the first entry, and the new advice points at it

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261011T2328-vxal
**Tags:** yggdrasil, log, security
**Files:** Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts, Yggdrasil/source/cli/src/cli/merge-driver.ts
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-221-opus
**Where:** source/cli/src/core/log/log-merge-resolve.ts; source/cli/src/cli/merge-driver.ts (the advice at integrity failures)
**After:** 221
**Branch:** jarl/302-log-merge-integrity
**Worker:** w-302-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 10:21

## What


yg log merge-resolve --node app --ours HEAD --theirs HEAD records a baseline over a committed rewrite of the node log's first entry, and yg check then reports PASS: the integrity check is silenced by the very command that the advice added for 242 now names at every committed prefix_modified. Reproduced by the reviewer on the build before the 242 fix too, so it predates it, but the new advice sends users to the command. The explicit-sides mode of merge-resolve should refuse two identical sides, or require a side that agrees with the recorded baseline, and the advice should name the two branches that really were combined.

## Why


A command offered as the repair for an integrity failure must not be a way to clear the failure without repairing anything.

## Acceptance


- merge-resolve with two identical sides is refused with a message that names the real fix; a test reproduces the committed rewrite of the first entry and shows check red before and after the refused command.
- The advice at prefix_modified names the branches to pass, and the CHANGELOG says what the command now refuses.

## Changelog
- yg log merge-resolve refuses --ours/--theirs holding the same log (log-merge-sides-identical) and sides none of which holds the recorded history (log-merge-history-rewritten); a rebase that keeps original dates, and a fill before a squash or merge --no-commit is committed, now ask for the entry the combination owes; logs checked out with CRLF line endings are compared with git's LF copies the same way, and merge-resolve advises the eol=lf attribute where none is set.

## Evidence

### Proof

- **ran (line bd9f1d320572):** npx vitest run tests/e2e/cli-merge-driver.test.ts tests/unit/core/log-merge-resolve.test.ts (before the fix, then after) · **saw:** before: 12 (committed rewrite of the first entry) and 3 unit refusals fail; after: 30/30 e2e and 89/89 unit pass; check is log-integrity before and after the refused merge-resolve --ours HEAD --theirs HEAD (log-merge-sides-identical) and --ours main --theirs later (log-merge-history-rewritten), lock unchanged

### Notes

Assumed: the identical-sides refusal applies to --ours/--theirs holding the same log with at least one entry (an entry-less log stays a no-op, as an existing test pins); the recorded-history guard applies to every two-sided reconciliation (merge commit, merge in progress, named sides), and for a whole log it runs after the union is verified so the more precise refusal still comes first. Line 2: the prefix_modified advice already named the branches; it now also says they must differ and one must hold the log as recorded; CHANGELOG under Security.

