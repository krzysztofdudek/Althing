# 319 · Jarl: merged cleans up what the merge made redundant: the issue's worktree and its local branch are removed when it is safe, never when it is not

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, merge
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs, JarlSkill/skills/jarl/scripts/tests/merge-cleanup.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (merged, branches)
**After:** 307
**Branch:** jarl/320-merge-record
**Merged:** 7dcf62c38c50c8b0ce27720f0d3fa7e3fd5cd11f in ../../../JarlSkill
**CI:** pending

## What
The owner, 2026-10-18 (translated from Polish): can Jarl record that at a merge the local working branch is cleaned up? Today the merger removes the worktree and the branch by hand after merged, and branches marks a finished one DONE → delete, so finished worktrees and branches pile up when a merger forgets (the loop's own host held a dozen). merged learns to do it: after it records the merge it removes the issue's worktree and deletes the issue's local branch (git worktree remove, git branch -d, never a force, never rm), and says what it removed or why it kept it. It does so only when every condition holds: the merge sha is recorded and the branch tip is an ancestor of the base or of the recorded merge; the worktree has nothing uncommitted and nothing untracked; no other issue still holds a lease on the branch (a package); the worktree is on this machine; the branch is not the base, not a release branch and not checked out elsewhere. Otherwise it keeps everything and names the condition. It is on by default for the command line and the tools and off for library callers (Horde), and --keep skips it. Nothing is pushed and no remote branch is touched.

## Why
Finished worktrees and branches are the commonest debris of a multi-agent loop; leaving the cleanup to a step an agent can forget costs disk and confuses the next reader of branches, while a cleanup that is safe by construction costs nothing.

## Acceptance
- After merged on a branch whose tip is in the base, the worktree and the local branch are gone and the output says so; with --keep both stay
- Each condition that fails (uncommitted or untracked files, another issue on the same branch, the tip not in the base, the branch checked out elsewhere, the base or a release branch, a worktree not on this machine) keeps the branch and worktree and names the reason; tested one by one
- No force option exists: a branch that git would refuse to delete without a force is kept; no remote branch is touched; no file is removed by any other means than git worktree remove and git branch -d
- A library caller of the record code (as Horde is) gets no cleanup and no change of behaviour; the existing record contract test still holds
- branches and the skill's merger section describe the cleanup as the tool's, not as a manual step; the skill states that Jarl changes git only here, only after a recorded merge

## Changelog
- Added: merged cleans up after a recorded merge: on the command line and in the tools it removes the issue's worktree and local branch when that is safe (git worktree remove and git branch -d, never a force) and names the reason when it keeps them; --keep skips it; a library caller gets no cleanup.

## Evidence

- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 7dcf62c · **saw:** 368 tests, 365 pass, 0 fail, 3 skipped

