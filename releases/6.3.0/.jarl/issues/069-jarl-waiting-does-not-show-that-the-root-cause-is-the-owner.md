# 069 · Jarl: waiting does not show that the root cause is the owner

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-c1cbd6ef
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (renderResume), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5971 at a1132a8
**After:** 035

## What
Claim: Task 30 waits on 40, which waits on the owner, and shows only 'after 40'. Corrected by the sceptic: Severity low: it hangs on fr-03/fr-41, since only an owner hold that is recorded can be followed.

resume prints '(after 010)' style lines only. Map row fr-37.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Follow After to an open question on the owner and print 'waiting on the owner, via N'.

## Evidence

Dropped: folded into 052 (waits on X via N), research/2026-11-03-jarl-as-a-loop-tool report section 11

