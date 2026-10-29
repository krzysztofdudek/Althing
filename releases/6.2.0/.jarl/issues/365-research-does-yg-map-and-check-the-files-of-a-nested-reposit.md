# 365 · Research: does yg map and check the files of a nested repository that the parent's git ignores

**Status:** open
**Kind:** research
**Priority:** 1
**Tier:** strong
**Tags:** yggdrasil, gard, workplace
**Files:** Althing/research
**Repo:** ../..
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section The shell and the code together: a shell's graph maps the files of the repos inside it, whose directories the shell's git ignores

## What
One measurement on a fixture shell (a git repository whose .gitignore lists a nested code repository, with a Yggdrasil graph at the shell's root mapping the nested files by wildcards) settles whether yg check covers, verifies and reports drift for those files, what yg log and the locks record, how a change committed only in the nested repository shows, and what the progressive mode does there. The result goes to a research folder with Question, Method, Status and Conclusion; every defect found becomes an issue of Yggdrasil, and the conclusion says what Gard's shell layout must do if yg cannot see the files.

## Why
Law beside a repository whose team does not want it is the case Gard exists for; if the law cannot see the code it governs, the shell's architecture check is a false green, the failure the family exists to prevent.

## Acceptance
- A research folder records the fixture, the exact yg version and commands, and what each printed, for mapping, check, drift after a nested commit, log and progressive mode
- Every defect is filed as a Yggdrasil issue, and the conclusion names the layout Gard uses for the graph of a shell

## Evidence

