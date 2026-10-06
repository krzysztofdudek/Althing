# 246 · Jarl: Check: lines in goal.md can name a repository, and status and report show per repository whether merges have an evidence row with its gate

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, check
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**After:** 252

## What
Loop repositories as a separate entity (architect, section 3.4; absorbs the core of 247): today a repository is smeared across four places — Repo: paths (13 spellings in this loop), Files prefixes, Check: lines, and the base, which is whatever is currently checked out in the main checkout (defaultBase), read by check, queue, tips, branches and Horde's requires-merged gate. A second loop (in another project) reports the same for Check:.

## Why
In a multi-repository loop, 'did this merge pass the right gate' is today a question answered by reading the evidence by hand.

## Acceptance
- Repositories described once in goal.md: name, path, base branch, gate (Check), identity fingerprint (first commit, normalised origin); --repo accepts a name, a path, a worktree or a file in the repository and reduces it to the root of the main repository; the Files prefix names the repository; an explicit, logged command normalises existing entries to names; existing paths work unchanged.
- merged --ran/--saw binds the gate-run row to the merge and the repository; status --by repo and report show per repository landsOn (check or testimony) and whether every merge has a gate row of its repository; status warns when a repository's checkout is not on the declared base (only a warning in 6.2.0); init prints once a notice about landing on testimony without Check.
- Requires a record format marker (a separate issue) before the Repo: format changes; tests on frozen copies of the private repository's loops.

## Evidence


