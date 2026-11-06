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

