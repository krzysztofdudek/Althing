# 168 · Jarl: the models refusal prints the root bare in its reason, the flaw issue 140 fixed in the no-loop refusal

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261106T1648-xorf
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-128-opus-c2
**Where:** skills/jarl/scripts/lib/models.mjs:311
**Branch:** jarl/163-base-and-reopen
**Merged:** 835fcd05f8a49889f0a1bffefe2d4453aa2bfc82 in ../../../JarlSkill
**CI:** none

## What
The models refusal echoes the root without quoting, so a root holding a line break splits the reason and one holding a command substitution runs when the whole message is pasted into sh.

## Why
Every refusal that prints a caller-given root should quote it the way the no-loop refusal now does.

## Acceptance
The models refusal prints the root quoted with line breaks escaped, and a test pins a line-break root and a command-substitution root

## Changelog
- Fixed: When models, a check of a task's repository, a filing from a second copy of the checkout or a lock refuses and names the loop's folder, it now writes the folder in quotes, so a name with a line break or a shell sign stays on its line and runs nothing when the message is pasted.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/no-loop.test.mjs (with the library fix taken back) · **saw:** fail 3: models printed the root bare, so the reason split at the line break and '$(touch made-by-paste)' stood unquoted; new --repo ./nope and ./inner printed the path and the loop's root bare
- **ran (history):** cd skills/jarl/scripts && node --test tests/no-loop.test.mjs; then tests/repositories, lock-scope, models-loops, gate-decide-tips, resume and the linked-worktree tests of tests/jarl.test.mjs (after the fix) · **saw:** no-loop pass 30, fail 0, pasting each message into sh writes nothing; the others pass 46, 3, 8, 15, 7 and 2, fail 0. Quoted in the same way: the models no-loop reason, the two repository refusals (lib/repositories.mjs, the root and the path built on it), the linked-worktree filing refusal (lib/commands.mjs) and the lock's loop-gone refusal (lib/lock.mjs)
- **ran (history):** cd skills/jarl/scripts && npm test (the whole suite on the branch tip 58824ff) · **saw:** tests 1548, pass 1526, fail 0, skipped 22; the suite left nothing in its temporary directory
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on two import lines of lib/commands.mjs (group H2 added leaseConflictOf, this group swapped in baseOf and added unmergedText), resolved by keeping both · **saw:** tests 1566, pass 1544, fail 0, skipped 22, merge 835fcd0

