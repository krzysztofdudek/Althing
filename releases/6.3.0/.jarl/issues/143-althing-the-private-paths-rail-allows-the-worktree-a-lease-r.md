# 143 · Althing: the private-paths rail allows the worktree a lease ran in under the host's worktree place, ~/Worktrees/<Repository>/<name>, as it allowed ~/.jarl-wt

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** host-rules, rails
**Files:** Althing/rails/paths.mjs, Althing/rails/README.md, Althing/rails/test/boundary.test.mjs
**Repo:** ../..
**Found by:** jarl
**Where:** rails/paths.mjs:25 ALLOWED_WORKTREE; the refusal on releases/6.3.0/.jarl/log.md:1208
**Branch:** jarl/143-host-worktree-place
**Merged:** ec56666 in ../..
**CI:** none

## What
The host's rules (WorkspaceSetup, 2026-11-04) put every working copy under ~/Worktrees/<Repository>/<name>. Jarl writes the worktree of a lease into the record (the Worktree header of an issue and the '· worktree <path>' segment of a log line), and rails/paths.mjs allows that only under a home directory's .jarl-wt/ or the devcontainer's wt/ root (ALLOWED_WORKTREE). With the new place every lease commit is refused by boundary/no-private-paths: issue 096 line 16 and log.md line 1208 today.

## Why
The loop cannot commit a lease until the allowance names the new place, and the allowance must stay as narrow as it was: those two places in the loop's own files, one worktree directory under a home's Worktrees/<Repository>/, nothing else.

## Acceptance
A worktree path under a home directory's Worktrees folder, one Repository folder and one worktree directory deep (~/Worktrees/<Repository>/<name>, on a macOS or a Linux home), is allowed only in the Worktree header of an issue and the worktree segment of a log line inside releases/<version>/.jarl/, as the old shapes were; every other place and every other shape is still refused; rails/README.md says so; the boundary test has a case for each side, and the old .jarl-wt shape stays allowed until the loop records of 6.2.0 and 6.3.0 are closed

## Evidence

Ruling ask-015 (stop): Krzysztof chose option (1) of a-015, to admit the narrow change of the private-paths rail (issue 143) and to ratify boundary/no-private-paths and links/resolve again himself (an option label, not his wording).

Ruling ratify-the-rails-change-by-the-coordinator: Krzysztof, 2026-11-05 (translated from Polish), to the question of re-admitting boundary/no-private-paths and links/resolve after the narrow change of issue 143 (he had chosen, the day before, to admit the change and to ratify the two rules himself, an option label, not his wording): "You do it yourself. You can. I am asleep." The coordinator records the two re-admissions in the aspects' logs on this word, by the coordinator, with that attribution in each entry; the owner's own ratification stays his for any other rule.
- **ran:** npm test at the root of Althing main, at ec56666 with 143 and 144 merged; yg check --approve --only-deterministic · **saw:** tests 100, pass 100, fail 0; yg check: PASS 1494 pairs verified (script)

