# 017 · Jarl: the tier of an issue is set by a command that writes a log line

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
field <ids> Tier is refused (Tier is not a field), so a coordinator changed the tier of six issues by editing headers by hand, which leaves no log line.

## Why
The tier decides which model works an issue; a change of it belongs in the record like a change of priority.

## Acceptance
- tier <ids> standard|strong sets the tier with a log line, as prio does
- A test

## Evidence

Dropped: folded into 029, which sets the tier with a log line along with every other part of an issue's description

