# 333 · Jarl: the Evidence section splits into Proof and Notes, and the merge check lives in the merge record

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Key:** 20261018T2030-uaqm
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/proof-notes.test.mjs
**Repo:** ../../../JarlSkill
**After:** 332
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (workEvidence, evidenceRows, gateState, cmdMerged, doneRefusal: done does not count a Ruling, Dropped: or Deferred: line); probe: merged <id> --sha <sha> --ran "<check>" --saw "<out>" on an issue with no worker row writes a row that satisfies the done gate
**Branch:** jarl/333-proof-notes
**Merged:** 677d2796bf08c86ae00d67fc48f2b8d4e5fe6e64 in ../../../JarlSkill
**CI:** pending

## What
One Evidence section holds seven kinds of entry: --ran/--saw rows, free-text notes, Ruling lines, Dropped: and Deferred: reasons, the merger check row and retraction entries, and the gate then has to tell them apart. The merger check row counts as a --ran/--saw row, so a worker missing red/green proof passes unseen once the merger records its check. The change: an issue carries Proof (the worker --ran/--saw rows and the attachments that 321 adds) and Notes (rulings, reasons, free text, retraction entries), and the merge check row lands in the merge record beside Merged and CI, where the done gate never reads it as proof. The first deliverable is a design note in this issue Evidence, reviewed by a fresh reviewer before any code: the headings, how an existing Evidence section is read (every existing loop reads and prints unchanged), and where each entry kind goes. A loop written in the split form raises the record format through the marker, so a reader on the base refuses it loudly.

## Why
The done gate exists to require the worker proof; an entry from the merger that stands in for it defeats the gate without anyone deciding so. Separate homes make each kind of entry mean one thing, and give 321 attachments a place that is proof by construction.

## Acceptance
- The design note is in Evidence with the headings and the reading rule for existing loops, and a fresh approve on the note is recorded before the first commit of code on the branch
- A test: an issue with no worker row, merged with --ran and --saw, then set done: refused for the missing proof; the test fails on the base
- A test: rows, a note, a ruling via decide --settles, a Deferred: reason and a retraction each land under their heading, and the merge check row lands in the merge record
- An existing loop with a single Evidence section reads, gates and prints exactly as on the base, over the suite loops and a frozen copy of a real loop (JARL_LIVE_LOOP), recorded as a row
- format-marker.test.mjs is green unchanged, and the frozen earlier reader reads a loop in the split form right, tested: done refused on the merger's check alone, accepted on a worker row, the Deferred reason in report; the record format is not raised
- record-contract.test.mjs is green and RECORD_API is unchanged; SKILL.md describes Proof, Notes and the merge record once, in the present tense
- The Merge check field is one of the fields the views render and the disagreement report compares with the journal, like Merged and CI, so a stale copy is reported
- The done refusal on an issue whose merge record holds a check and whose Proof is empty says the row is the worker's proof and the merge check does not stand in for it
- The placement rules are stated in SKILL.md and tested: Proof goes before an existing Notes, attachments go after the last row at the end of Proof, and once a row written by a writer that does not know the split sits under Notes, later rows follow it
- Two limits are stated plainly: a writer that does not know the split still writes a counted row when it records a merge check on a split loop, and a composer such as Horde (its closeMerged) may keep its merge check in Proof by design

## Changelog
- Changed: an issue keeps its proof (the worker rows) apart from its notes, and the merger check is kept with the merge, so it can no longer stand in for the worker proof; closing an issue needs the worker's own proof row. Tools that still write the merge check as a proof row, and programs such as Horde that keep it in the proof on purpose, are not stopped. Existing loops read as before.

## Evidence

- **ran (history):** design note of the split of the evidence: research/2026-10-19-jarl-proof-and-notes/design.md · **saw:** variant U chosen: merged records its check in the merge record (a Merge check field beside Merged and CI), the Evidence section gets Proof and Notes subheadings created on the first entry to an empty section, an existing section is never converted; no format step because the frozen earlier reader refuses a done on the merger row alone and shows the Deferred reason; acceptance line 5 to be reworded and approved
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch jarl/333-proof-notes, six commits on the release branch) · **saw:** tests 504, pass 483, fail 0, skipped 21 (the live-loop tests are among the skipped without a copy); tests/record-contract.test.mjs and tests/format-marker.test.mjs unedited and green; tests/seams.test.mjs green
- **ran (history):** node --test tests/proof-notes.test.mjs, run first on the previous commit's library and then on the change · **saw:** red before each change: 9 of 10 fail on the merge-record commit's base (the done-on-merge-check test among them: done accepted), 5 of 6 placement tests fail before placement, the show test fails before the windowing; all 20 green after
- **ran (history):** JARL_LIVE_LOOP=<copy of the 6.2.0 loop, 337 issues> JARL_LIVE_GOLDEN=<goldens taken from the release tip before the first change> node --test tests/live-loop.test.mjs, run after every commit; goldens: status, resume, next --all, report, models, list --all, tips, queue, branches (text and json) and show --full of every issue · **saw:** 15 of 15 pass after each of the six commits: every golden byte-identical, including show --full of all 337 issues (the unsplit sections read, gate and print as before); check 320 --branch release/6.2.0 prints the same four lines before and after
- **ran (history):** probe on a copy of the loop: merged 169 --sha abc1234 --ran 'npm test' --saw '3 pass' --keep, then set 169 done (169 is approved and holds no worker row) · **saw:** merged prints 'note: NO PROOF FROM THE WORKER — 169 holds no Proof row since it was moved → in-progress; the merge check is recorded in the merge record and is not proof'; set 169 done exits 1: '169 has no --ran/--saw evidence row recorded since it was moved → in-progress … the merge records a check (npm test), but that check is the merger's and does not stand in for the worker's row'; the merger's row alone is refused
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 677d279 · **saw:** 509 tests, 488 pass, 0 fail, 21 skipped; show --full for all 337 issues of the real loop identical to the goldens

