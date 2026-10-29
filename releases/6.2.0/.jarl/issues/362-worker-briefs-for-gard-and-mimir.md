# 362 · Worker briefs for Gard and Mimir

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** althing, workplace, briefs
**Files:** Althing/releases/6.2.0/briefs/worker-gard.md, Althing/releases/6.2.0/briefs/worker-mimir.md
**Repo:** ../..
**After:** 361
**Found by:** owner
**Where:** releases/6.2.0/briefs/ has worker templates for the six repositories of the release, none for Gard or Mimir

## What
Two worker templates, rendered by ws brief like the others: where the repository is and how a command runs in its dev container; tests first, every case of the acceptance as a test, fixtures built in a temporary folder and never on the user's real home; one issue per commit; code, comments, names and tests in English and self-describing, pointing at nothing outside the repository (no issue numbers, no rulings, no sections of a design); proportionality (protect against loss of work, deletion, what gets in the way and leaks of secrets in ordinary flows, and nothing more); no throwaway scripts on the host; the design to read first (research/2026-10-29-mimir-and-gard/gard-design.md or mimir-specification.md). The reviewer and merger templates name the two repositories' checks.

## Why
A worker knows only its brief; Mimir's first build ran on a rules file outside any repository, and those rules must hold here without it.

## Acceptance
- ws brief worker --repo gard and --repo mimir render with every placeholder filled on this machine and no machine path in the templates (the paths rail passes)
- Each template states the check of its repository, the design to read and the rules above; the reviewer template asks for the proportionality rule by name

## Evidence

