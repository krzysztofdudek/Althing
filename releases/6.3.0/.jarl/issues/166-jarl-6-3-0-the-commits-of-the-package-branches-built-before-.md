# 166 · Jarl 6.3.0: the commits of the package branches built before 2026-11-06 carry an agent attribution trailer the owner's rule now forbids

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** needs-owner
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a
**Where:** git log release/6.2.1..jarl/004-gate-and-ratify, and the same for jarl/074-merge-and-files and jarl/128-fields-and-refusals: every commit ends with a Co-Authored-By trailer

## What
The briefs of 2026-11-05 required an attribution trailer on every commit; since Althing 7637ab0 (2026-11-06) the owner's rule forbids it and the machine's git refuses such a commit or push. Package branches A, B and C are local and unpushed, and their commits carry the trailer.

## Why
A push of the release branch would be refused or would publish what the owner does not want, and the rules also say a reviewer's fix is a further commit, never an amend.

## Acceptance
- The owner decides, before any push of a package or release branch, whether the trailers are rewritten out of the unpublished history or merged as they are; the decision is recorded as a ruling
- New fix commits and merge commits made from now on carry no attribution

## Evidence

Tested the rewrite on a scratch clone and a scratch copy of the loop: dropping the agent trailer lines from the 323 commits of the unpublished release branch with a message filter rewrote all 323, left no trailer, and left the tree of the tip identical; status, verify and report on the copy then read the same as before the rewrite (the gate of closed issues lists only issue 028 both before and after, with the old objects present and after they were pruned), because the loop's views do not depend on the merge shas recorded in the log. The shas written in the log and in evidence text before the rewrite name the old history.

