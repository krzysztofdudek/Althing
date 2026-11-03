# 083 · Jarl: one record format raise to 3 in 6.3.0, with the jarl-record/2 contract, never applied to a loop under a composer's profile

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design, format
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-format-raise
**Where:**
**After:** 035
**Branch:** jarl/083-format-raise-3
**Worker:** w-jarl-083-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-083
**Since:** 2026-11-03 12:44

## What
Ruling one-format-raise-horde-later: every change of the model that an older reader would misread rides one raise to format 3 (report section 9 lists them: the issue key, the writer, the owner-only mark, the parent of a sub-issue, the batch id, the kinds promise and wait, the escalation ask kind, and the retraction of a note, 019, which reuses the shape of a row's retraction). Horde re-vendors later, so a composer's loop is never raised.

## Why
Several raises across a release, or a raise that reaches a Horde mission, would make readers refuse loops they read today.

## Acceptance
- The raise to format 3 happens at the first write that needs it, under the lock, as the raise to format 2 does today; a reader that knows format 2 only refuses a format 3 loop with a message naming the version that reads it
- A loop whose profile names a composer (an external scheduler) is never raised; a write that would need format 3 there is refused with the reason, and the feature says it is off in that loop
- record.mjs exports the jarl-record/2 contract with the new lines; references/record.md and composers.md describe them
- Tests: the raise on the first write that needs it, the refusal by a format-2 reader, and a composer-profiled loop never raised

## Evidence

