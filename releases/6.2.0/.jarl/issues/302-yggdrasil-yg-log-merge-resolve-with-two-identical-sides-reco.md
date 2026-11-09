# 302 · Yggdrasil: yg log merge-resolve with two identical sides records a baseline over a committed rewrite of the first entry, and the new advice points at it

**Status:** open
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

## What


yg log merge-resolve --node app --ours HEAD --theirs HEAD records a baseline over a committed rewrite of the node log's first entry, and yg check then reports PASS: the integrity check is silenced by the very command that the advice added for 242 now names at every committed prefix_modified. Reproduced by the reviewer on the build before the 242 fix too, so it predates it, but the new advice sends users to the command. The explicit-sides mode of merge-resolve should refuse two identical sides, or require a side that agrees with the recorded baseline, and the advice should name the two branches that really were combined.

## Why


A command offered as the repair for an integrity failure must not be a way to clear the failure without repairing anything.

## Acceptance


- merge-resolve with two identical sides is refused with a message that names the real fix; a test reproduces the committed rewrite of the first entry and shows check red before and after the refused command.
- The advice at prefix_modified names the branches to pass, and the CHANGELOG says what the command now refuses.

## Evidence

