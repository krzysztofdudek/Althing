# 365 · Research: does yg map and check the files of a nested repository that the parent's git ignores

**Status:** deferred
**Kind:** research
**Priority:** 1
**Tier:** strong
**Tags:** yggdrasil, gard, workplace
**Files:** Althing/research/yg-nested-repository
**Repo:** ../..
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section The rig and the code together: a rig's graph maps the files of the repos inside it, whose directories the rig's git ignores

## What
One measurement on a fixture rig (a git repository whose .gitignore lists a nested code repository, with a Yggdrasil graph at the rig's root mapping the nested files by wildcards) settles whether yg check covers, verifies and reports drift for those files, what yg log and the locks record, how a change committed only in the nested repository shows, and what the progressive mode does there. The result goes to a research folder with Question, Method, Status and Conclusion; every defect found becomes an issue of Yggdrasil, and the conclusion says what Gard's rig layout must do if yg cannot see the files.

## Why
Law beside a repository whose team does not want it is the case Gard exists for; if the law cannot see the code it governs, the rig's architecture check is a false green, the failure the family exists to prevent.

## Acceptance
- A research folder records the fixture, the exact yg version and commands, and what each printed, for mapping, check, drift after a nested commit, log and progressive mode
- Every defect is filed as a Yggdrasil issue, and the conclusion names the layout Gard uses for the graph of a rig

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

