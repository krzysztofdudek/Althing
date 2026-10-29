# 465 · Gard: doctor finds hooks an earlier gate left in a code repository and removes them on the user's word

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, git-gate, cleanup
**Files:** Gard/src/gate/leftovers.mjs, Gard/test/gate-leftovers.test.mjs
**Repo:** ../../../Gard
**After:** 402
**Found by:** owner
**Where:** Mimir's gate installed stubs in .git/hooks, a core.hooksPath per worktree with an entry in .git/info/exclude, or a chain in front of husky or lefthook; under the ruling git-through-gard none of that is wanted any more

## What
gard doctor recognises in a shell's repos what Mimir's gate installed (its stubs by their marker, its hooks directory, its core.hooksPath and exclude entry, the chain in front of a hook manager) and reports each with the command that removes it; gard gate clean --apply removes exactly those, restores a hook manager's own path, and touches nothing it did not recognise.

## Why
The owner's clones carry Mimir's gate today; moving to Gard must leave the team's repositories as clean as Gard promises.

## Acceptance
Fixtures with plain stubs, with a husky chain and with a lefthook chain installed by Mimir's gate are reported and, after clean --apply, equal the same repositories before the gate was installed, byte for byte in .git/hooks, config and info/exclude

## Evidence

