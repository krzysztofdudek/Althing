# 333 · Jarl: the Evidence section splits into Proof and Notes, and the merge check lives in the merge record

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/proof-notes.test.mjs
**Repo:** ../../../JarlSkill
**After:** 332
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (workEvidence, evidenceRows, gateState, cmdMerged, doneRefusal: done does not count a Ruling, Dropped: or Deferred: line); probe: merged <id> --sha <sha> --ran "<check>" --saw "<out>" on an issue with no worker row writes a row that satisfies the done gate

## What
One Evidence section holds seven kinds of entry: --ran/--saw rows, free-text notes, Ruling lines, Dropped: and Deferred: reasons, the merger check row and retraction entries, and the gate then has to tell them apart. The merger check row counts as a --ran/--saw row, so a worker missing red/green proof passes unseen once the merger records its check. The change: an issue carries Proof (the worker --ran/--saw rows and the attachments that 321 adds) and Notes (rulings, reasons, free text, retraction entries), and the merge check row lands in the merge record beside Merged and CI, where the done gate never reads it as proof. The first deliverable is a design note in this issue Evidence, reviewed by a fresh reviewer before any code: the headings, how an existing Evidence section is read (every existing loop reads and prints unchanged), and where each entry kind goes. A loop written in the split form raises the record format through the marker, so a reader on the base refuses it loudly.

## Why
The done gate exists to require the worker proof; an entry from the merger that stands in for it defeats the gate without anyone deciding so. Separate homes make each kind of entry mean one thing, and give 321 attachments a place that is proof by construction.

## Acceptance
- The design note is in Evidence with the headings and the reading rule for existing loops, and a fresh approve on the note is recorded before the first commit of code on the branch
- A test: an issue with no worker row, merged with --ran and --saw, then set done: refused for the missing proof; the test fails on the base
- A test: rows, a note, a ruling via decide --settles, a Deferred: reason and a retraction each land under their heading, and the merge check row lands in the merge record
- An existing loop with a single Evidence section reads, gates and prints exactly as on the base, over the suite loops and a frozen copy of a real loop (JARL_LIVE_LOOP), recorded as a row
- format-marker.test.mjs is green and the frozen earlier reader refuses a loop written in the split form loudly, tested
- record-contract.test.mjs is green and RECORD_API is unchanged; SKILL.md describes Proof, Notes and the merge record once, in the present tense

## Changelog
- Changed: an issue keeps its proof (the worker rows and attachments) apart from its notes, and the merger check row lives with the merge, so the merger check can never stand in for the worker proof. Existing loops read as before.

## Evidence

