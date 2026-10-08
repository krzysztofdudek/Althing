# 285 · Althing follows Jarl's repository names: loop/shape accepts names, repos.md and a format-only profile.json; ws doctor compares the loop's repositories with ws.local.json, and its bases and Check lines with the manifest

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** althing, workspace
**Files:** Althing/rails/loop.mjs, Althing/rails/test/regions.test.mjs, Althing/workspace/ws.mjs, Althing/workspace/test/ws.test.mjs, Althing/method/loops.md, Althing/method/environment.md
**Repo:** ../..
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#althing-fr-repository-names
**Where:** Althing/rails/loop.mjs:41-44 (a Repo must be a relative path or a registry key)
**After:** 247

## What
Once Jarl names sibling repositories instead of paths (247), Althing's rails and workspace still expect paths or registry keys (the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, A.2 item 8). loop/shape accepts a relative Repo or a registry key (rails/loop.mjs:41-44), not the names Jarl records (the directory git clone gives a repository, which is its name on its host), nor .jarl/repos.md, nor a profile.json holding only jarl-profile and format (252), so the first commit of a loop that carries them would be refused. Nothing checks that the repositories the open loop names resolve where ws.local.json says, or that its declared bases and Check lines match the release manifest, which stays their one home. method/loops.md and method/environment.md describe Repo as a relative path. This lands after 247, and before the 6.3.0 loop opens, because that loop writes names from its first issue.

## Why
A rail that refuses the record Jarl writes stops the next release at its first commit, and a base or a check kept in two places drifts. ws.local.json stays the one home of where this machine's checkouts are; Jarl reads no copy of it, so the doctor is where a difference shows.

## Acceptance
- loop/shape accepts as a Repo value the names (the last segment of each registry entry's github, and Althing) besides relative paths, and accepts .jarl/repos.md and a profile.json holding only jarl-profile and format; tests for each, and for a name outside the registry being refused
- ws doctor compares each repository the open loop names (paths while the loop runs on Jarl 6.1.0; ws jarl status --by repo --json once it runs on Jarl 6.2.0) with ws.local.json, and each declared base and Check line with the release manifest's branch and check, naming any difference and its fix (the layout or a symlink beside the loop's checkout); read-only; tests
- method/loops.md and method/environment.md say how a loop names repositories, and that a machine laid out differently puts a symlink beside the loop's checkout
- The rail change lands before the first commit that carries a name, which is the opening of the 6.3.0 loop; yg check && npm test green

## Evidence

