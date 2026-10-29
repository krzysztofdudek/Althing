# 443 · Mimir: one command runs every job of an area or of the Desk

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, jobs
**Files:** Mimir/src/jobs, Mimir/src/commands
**Repo:** ../../../Mimir
**After:** 426
**Found by:** owner
**Where:** the owner, 2026-10-24: in the morning I run the company ingest and the ingest of sessions, and it would be good to have one button that grinds everything; Mimir at 10257cd runs one job at a time (job run)

## What
job run --all [--area <id>] runs every job the chain declares with on: manual, one after another in a stable order, each under its own lock, and reports each one's exit code and time; a job that needs a place or a machine this computer lacks is reported as unavailable and the rest go on. An agent and a person use the same command.

## Why
Grinding everything should be one move, not a list remembered every morning.

## Acceptance
A fixture Desk with three jobs, one failing and one needing a missing place: run --all runs the other two, reports all three, and exits 1

## Evidence

