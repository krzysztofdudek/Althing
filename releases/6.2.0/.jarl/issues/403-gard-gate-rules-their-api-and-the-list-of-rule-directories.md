# 403 · Gard: gate rules, their API and the list of rule directories

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, git-gate
**Files:** Gard/src/gate/rules.mjs, Gard/src/gate/rule-dirs.mjs, Gard/test/gate-rules.test.mjs
**Repo:** ../../../Gard
**After:** 402
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/git-gate-design.md and gard-design.md, section The git gate

## What
A rule is a module exporting meta (api version, events, mustRun, timeoutMs) and check(ctx), which returns a block with a message and a fix, or nothing; ctx gives the event, the repository, the staged diff, the message and the pushed range. Rules come from the rig's gate.rules and from a list of rule directories in the computer's config; another tool adds and removes its own entries in that list under its own name and never touches others'. A rule past its time is skipped with a warning unless mustRun, which blocks.

## Why
The rules of a company apply to every repository of that company: Mimir fills the list from the chain of areas, and Gard never calls Mimir.

## Acceptance
- Tests cover a blocking rule with its message and fix, a passing rule, a timed-out rule (skipped) and a timed-out mustRun rule (blocks)
- A tool's entries in the list are added and removed under its name, and another tool's entries stay

## Evidence

