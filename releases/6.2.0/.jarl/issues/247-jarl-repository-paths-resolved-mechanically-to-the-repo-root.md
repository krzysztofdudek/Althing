# 247 · Jarl: repository paths resolved mechanically to the repo root and recorded canonically, with an identity fingerprint, a check on write and on demand, and finding moved ones

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, ux
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**

## What
After the ruling jarl-6-2-0-scope the core of this issue (resolution to the repo root, names, fingerprint, check on write) moved to 246. What stays here is the part the architect moved: finding moved repositories or loops by fingerprint among the neighbouring repositories, and checking whether the files from --files exist on the loop's branch. No loop has needed this yet, and new files turn the existence check into noise.

## Why
A fragile detail repeated in hundreds of issues, which adds nothing to the decision, and whose error shows only when someone looks for an issue's code in the wrong place.

## Acceptance
For the next release: the checking command gives, for a moved repository or loop, a proposed path correction found by fingerprint; the file existence check distinguishes a new file from a lost one.

## Evidence

jarl: title changed by hand (Jarl has no command to change a title) after the issue was rewritten to mechanical path resolution; former title: 'loop repositories named in goal.md (Repos: name=path), and --repo accepts a name instead of a path relative to the loop directory'. The missing title-change command is a small gap — added to 245.

Deferred: moved to 6.3.0 per jarl-6-2-0-scope; the core moved to 246

