# 245 · Jarl: retracting a wrong entry in the record (a verdict, an evidence row) by an appended entry, never by an edit; a review with empty findings rejected

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**After:** 248, 252

## What
A mistaken reviewer verdict has to be struck through by hand in log.md today, and log.md is the event store of the done gate (architect, section 3.2): the manual strike-through from 006 silently removed the verdict from the gate and the metrics. There is also no command to change a title (247 corrected by hand). Narrowed per the architect: no global identifiers, retraction by pointing at the entry, and only tightening. Amended by the architect's scope review of 2026-10-18 (section 4, item 1) and the ruling jarl-release-alone-with-every-jarl-issue: Jarl 6.1.0 does not parse a retract line, so it would still count a retracted approve or evidence row and pass done where 6.2.0 refuses; the first retraction therefore raises the record format (252), so an older Jarl refuses the loop instead of misreading it. The retract line uses the one id grammar of 310, and the row number n is the file-wide evidence-row ordinal that show prints (280).

## Why
A wrong verdict counts today as a fresh review and can open the done gate; it can be corrected only by editing history.

## Acceptance
- review <id> retract --by <who> "<reason>" retracts the newest approve on the issue (never a changes verdict — a retraction must not revive an earlier acceptance); evidence <id> --retract <n> retracts the n-th evidence row, n counted over the whole issue file as show prints it; both append an entry with the author and the reason, the original stays visible as struck through, and the done gate and the metrics do not count it.
- The first retraction written into a loop raises the record format through 252's function, under the same lock, before the retract line is written; the pinned Jarl 6.1.0 fixture of 252 then refuses list and status on that loop, tested
- body <id> --title "<title>" changes the title with an entry in the log (file name unchanged).
- review rejects findings with no letters or digits after trimming, or shorter than a few words; a test on 'x'.

## Evidence

jarl: by the way — Jarl has no command to change an issue's title (set accepts only statuses and profile fields); changing the title of 247 required a manual edit of the file. Consider here or separately: a title change as an appended entry with a reason.

