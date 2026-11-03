# 064 · Jarl: no view of what changed since a time

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-bac76435
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs:1 at a1132a8
**After:** 035, 052

## What
Claim: A 15-minute watchdog re-read everything each tick. Corrected by the sceptic: Severity low: a watchdog can read the log's tail after a time today; the command saves a filter, mainly for agents limited to the MCP tools.

No since command in the help. Map row fr-30.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: since <time or duration> prints new log lines, moves, rows and verdicts, then the next actions.

## Evidence

Kept small by the model (report section 11): a filter over the log by time that ends with the asker's next --as list.

