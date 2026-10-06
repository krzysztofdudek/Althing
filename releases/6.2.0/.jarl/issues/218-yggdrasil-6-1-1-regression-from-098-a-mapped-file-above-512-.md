# 218 · Yggdrasil 6.1.1 (regression from 098): a mapped file above ~512 MiB crashes every yg check with error[internal] in the relation check

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** yggdrasil, relations, regression
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-069
**Where:** source/cli/src/relations/pass.ts — after de7348ff1 (098) decoding is outside the read try
**Branch:** jarl/218-huge-file-crash
**Merged:** 68e4226fe51c7147df1d623ad157bdb9c20768d1
**CI:** none

## What
The worker of package 069 at 097: on release/6.1.1 (after merging 065/098) a mapped file > ~512 MiB ends every yg check with error[internal] in the relation pass; 6.1.0 skipped such a file. Commit de7348ff1 moved decoding outside the read try.

## Why
A regression introduced in this patch: a repository with a large file (e.g. a dump, an artefact) cannot run yg check at all after the upgrade.

## Acceptance
- A file that cannot be read or decoded in the relation pass (including > ~512 MiB) gives no error[internal]: the behaviour is as for a binary/unreadable file from 098 (a non-blocking warning or a reported file error), and the rest of the check works; e2e test red→green.
- The e2e test 097 from package 069 (cli-scope-huge-subject) passes after this fix.

## Changelog
- None: the regression never shipped (6.1.0 skipped such a file silently); a mapped source file too large to read as text (over about 512 MiB) is now also named in the relation-file-binary warning added for 098.

## Evidence

- **ran:** git commit (merge of jarl/218-huge-file-crash into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8100 pairs verified; [repo-check] All checks passed; [release/6.1.1 68e4226fe] Merge jarl/218-huge-file-crash

