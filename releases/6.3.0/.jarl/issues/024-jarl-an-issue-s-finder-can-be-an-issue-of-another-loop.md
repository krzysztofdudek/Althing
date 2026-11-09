# 024 · Jarl: an issue's finder can be an issue of another loop

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261028T0924-mrwo
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
A second loop (a defect backlog) was opened in a subdirectory; its issues are found by issues of the first loop, but Found by can only name a person or role.

## Why
Two loops that feed each other should be traceable from either side.

## Acceptance
- Found by (or a source field) can name another loop and an issue in it, and show prints it as a reference
- A test

## Evidence

Dropped: order or a finder across loops is left out of the design of 6.3.0 (design, section 14): no case

