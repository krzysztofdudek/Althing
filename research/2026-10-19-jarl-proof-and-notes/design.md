# Jarl: Proof, Notes and the merge record (design note for issue 333)

The design note issue 333 asks for before any code: what lives in an issue's Evidence section today, where each kind of entry goes, how an existing loop is read, what the journal records, what the gate and the views count, what changes for `record.mjs` and Horde, and the smallest design that meets the acceptance. Line numbers are those of `skills/jarl/scripts/jarl-lib.mjs` at the release tip of JarlSkill's `release/6.2.0` (`3f6fbf8`, issue 332 merged). Measurements were made on scratch loops built with that tip and with the frozen earlier reader (the library pinned by `tests/old-jarl.mjs`, run here through the command line of the same tag), and on a frozen copy of the release loop that holds these issues (337 issues, 2,801 log lines).

## 1. What one Evidence section holds today

| # | Kind of entry | Who writes it (file; journal line) | Who reads it | Does the done gate count it |
|---|---|---|---|---|
| 1 | Worker row `- **ran:** … · **saw:** …` | `cmdEvidence` with `--ran/--saw` (2081-2099: file 2093-2096; `<id> evidence row · <ran>` 2098) | `evidenceTable` (2023) and its numbering; `evidenceRows` (2043) for `doneNote` (1772), the untracked gate (1727) and `record.evidenceRows`; `gateOf` row events (2975, 3007); `alignRows` (2010); `show`'s window (2172-2179); `inFlightMark` (2455); `closedGateFlags` (3059); the models unit's `rowsBeforeReview` (3479) | Yes: a row line logged after the window's anchor is the proof `doneRefusalIn` asks for (1728) |
| 2 | Merger check row, the same shape | `cmdMerged` with `--ran/--saw` calls `cmdEvidence` (1805, 1849), then writes `<id> merged <sha> · check <ran>` (1824, 1850) | Every reader of kind 1, which cannot tell it apart; `checkState` (3128) reads the merge line's `check` | Yes, and this is the defect: it is a row line after the anchor |
| 3 | Free text | `cmdEvidence` with text (2093; `<id> evidence · <first line>`, an event of type `other`) | `workEvidence` (2058), hence the first refusal "no evidence yet" (1726); the findings matcher (4982-4985); `show` | Only as "something is written" for 1726, never as proof |
| 4 | Ruling of `decide --settles` | `cmdDecide` (4612) through `appendRuling` (4584-4591; `<id> evidence · Ruling <slug>: …`) | `workEvidence` skips it (2060) | No |
| 5 | Ruling of `answer --issue` | `cmdAnswer` (4532) through `appendRuling` | as 4 | No |
| 6 | Reason of a needs-reason status (`Dropped: …`, `Deferred: …`, any status the profile marks) | `cmdSet` (1612-1616), file only; the move line carries the reason (1631) | `statusReason` (4827) for `report` (4874); `workEvidence` skips it (2060) | No |
| 7 | Retraction: the row struck through in place, and an entry `- **retracted:** row n · by …` | `retractEvidence` (2114-2141: `raiseFormat` 2134, entry 2138-2139; `<id> evidence retract · row n` 2140) | `gateOf` retract-row events resolved through `alignRows` (2974, 2982-2988); `doneRefusalIn` (1725); `closedGateFlags` (3059); `evidenceTable`'s `retracted` (2031) | It subtracts: a retracted row stops counting |

Measured on the frozen copy: Evidence sections hold 509 row lines in 255 issues, 226 free-text lines in 147 issues, 29 ruling lines in 13 issues, 11 `Deferred:` lines, no `Dropped:` line and no retraction; 65 sections are empty. No issue file holds a `###` line, a `## Proof` or a `## Notes` heading. None of the 248 merge lines carries `check`, because the earlier Jarl that drove this loop wrote the merger's row as a bare row line beside a plain merge line. Of the 255 issues with rows, 178 have every row line stamped in the same minute as their own merge line: by that test the merger's row alone closed them. Issue 320 is one: its only row is the merger's suite run "on release/6.2.0 at the merge", recorded in the minute of the merge and of `→ done`. Probe on a scratch loop with the tip: lease, a fresh approve with no row, `merged 1 --sha … --ran "npm test" --saw "3 pass"`, `set 1 done`: accepted.

## 2. The structure

The Evidence section stays, and an issue whose Evidence section is empty when its first entry is written gets two sub-headings inside it, always in this order:

```
## Evidence

### Proof

- **ran:** npm test -- probe · **saw:** red before the fix, green after

### Notes

a free note about the work

Ruling probe-ruling: the probe settles on the split
```

and the merge record in the header, beside Merged and CI:

```
**Merged:** 00d8e37
**CI:** none
**Merge check:** npm test · saw 3 pass
```

| Kind of entry | Where it goes |
|---|---|
| Worker row (`evidence --ran/--saw`) | `### Proof`, after the last row of the section |
| Attachment row of 321 (`evidence --file --slot`) | `### Proof`, after the last row: it is proof by its kind |
| Retraction | the row stays where it is, struck through, keeping its number; the entry goes to the end of `### Notes` |
| Ruling (`decide --settles`, `answer --issue`) | end of `### Notes` |
| Reason (`Dropped:`, `Deferred:`, any needs-reason status) | end of `### Notes` |
| Free text (`evidence "<text>"`) | end of `### Notes` |
| The merger's check (`merged --ran/--saw`) | the merge record: `**Merge check:** <ran> · saw <saw>` on one line (several pairs joined by ` ; `), and `check <ran>` on the merge line as today; never a row, in the file or the journal |

Placement rules, each one there to keep a rule that already holds:

- A sub-heading is written when its first entry is. `new` still renders `## Evidence` empty, so a new issue file is byte for byte what it is today.
- A Proof entry goes after the last `- **ran:**` row of the section, wherever that is, or at the end of `### Proof` when there is none. Row numbers are ordinals over the whole section and a retraction names one; a row inserted before an existing row would renumber it and turn a recorded retraction onto another row. Under this rule a number never moves, also when an older writer appended a row under `### Notes`.
- A Notes entry goes at the end of the section, which is where every writer appends today, so an older writer's notes, rulings, reasons and retraction entries land under `### Notes` too (probed: a frozen writer's note on a split issue ends up last, under Notes).
- `### Proof` and `### Notes` do not end the section: `parseIssue` (672) and `setSection` (807) cut only at `## ` followed by a space, and `###` is not that.
- Free text and reasons go through `bodyText` (819), as What and Why do, so a note can never contain a line that reads as a sub-heading. Rows are already indented.
- `Merge check` joins `TOOL_FIELDS` (381), so a profile cannot declare a field of that name. It is written by every `merged --sha`: set when `--ran/--saw` are given, removed when they are not (a later merge without a check does not keep the earlier merge's), and left alone by `--ci` alone. It is not one of 332's rendered fields: the journal's state is the merge line's `check`, which `checkState` reads; the saw is text, as Worktree is, and no count reads it.

## 3. Reading existing loops, and the first write of the split form

The reading rule: an Evidence section that holds content and neither sub-heading is unsplit, is read by the same code as today and stays unsplit; later entries append at its end as they do now. Splitting it would mean sorting its rows into the worker's and the merger's, and in the file and the journal those cannot be told apart (section 1), so no read and no write ever converts one. Every one of the 337 files of the frozen copy is unsplit or empty, so every read of it takes the paths of today. The one write that changes for an unsplit issue is the merger's check, which goes to the merge record and so stops standing in for the proof of open issues of existing loops as well; nothing already recorded is read differently, so the gate's decision on the record as it stands is the same.

The first write of the split form does not raise the record format. The claim to test was that the frozen earlier reader must refuse such a loop, since it would otherwise count a merger row as proof. Probed on a scratch loop built with the tip and then put by hand into the form this note specifies (issue 2: a worker row under `### Proof`, a note and a ruling under `### Notes`, a fresh approve, a merge line with `check npm test` and the Merge check field, no merger row; issue 3: the same with no worker row; issue 4: `Deferred:` under `### Notes`), the frozen reader's command line gave:

- `set 3 done`: refused, "003 has no evidence yet". The merger's check is not a row line, so no reader can count it. The claim is refuted: the merger row counts as proof only where it is written as a row, and the split form never writes it as one.
- `set 2 done`: accepted, on the worker's row line.
- `report`: `004 split deferred — waits for the probe of 3`. `statusReason` finds the reason anywhere in the section.
- `show 2`: both sub-headings and every entry, unchanged.

The frozen reader reads the split form right, and so does a composer that vendors an earlier library (Horde's vendored copy reads format 1 only). By the format marker's own rule, the format is raised only by a write that a reader on the base would misread in silence; this write is read right, so it raises nothing, and `format-marker.test.mjs` stays green unchanged.

For comparison, the same loop with two top-level headings `## Proof` and `## Notes` in place of `## Evidence` (section 7), read by the frozen reader: `set 2 done` refused "002 has no evidence yet" although the worker's row is there; `report` printed `004 split deferred — ` with the reason silently gone; and a note written by the frozen writer created a third section, `## Evidence`, after Notes. That form is misread in silence and would have to raise the format.

## 4. The journal

No new line shape. Proof is the issue's `row` events (`<id> evidence row · <ran>`), and 321 adds one typed kind for an attachment, taught to `eventParser` (2605) with its writer in `LINE_WRITERS` (2640), so the free `log` command refuses it like every typed kind (`appendNote`, 2650). Notes are `other` events (`<id> evidence · …`), the reason on a move line and the `retract-row` events. The merge record is the `merged` event's `check`, as now. The fold of 332 (`issueState`) gains nothing, and `gateOf` already counts only row events.

The only change in what the journal holds is that `merged` stops writing a row line. Forgery stays where 332 left it: `log` and `record.appendLog` refuse a row line, a merge line and a retraction. A merger who records the merge's suite run as a worker row with `evidence --ran` is not stopped: the tool cannot tell who ran a command. What is guaranteed is that `merged` itself never writes proof.

## 5. The gate and the views

The done gate counts only Proof since the window: the row events after the anchor of `gateWindow` (2932), not retracted. That is the code of today. What changes is that the merger's check is no longer one of those events. `doneRefusalIn` (1721) is unchanged except `workEvidence` (2058), which for a split section reads the Proof part, so a note alone gives the refusal "has no evidence yet" (the wording the record contract test asserts) and a sub-heading line is never read as evidence. Over an unsplit section it reads as today.

- `show` (2151): over a split section it keeps both sub-heading lines, windows the rows of `### Proof` as it does today (earlier rows replaced by one line), and prints `### Notes` whole. Over an unsplit section it prints what it prints now. The Merge check field is printed with the header.
- `closedGateFlags` (3042), `checkState` (3128), `report`, `metrics` and `models` (the unit's `rowsBeforeReview`, 3479): no code change. From the first merge recorded under this design, their counts no longer include the merger's row. On a loop already recorded they read the same lines and print the same bytes.
- `inFlightMark` (2444): unchanged. On the frozen copy, issue 169 is approved with no row and reads "approved and queued for the merge"; after this change its merge will not give it a row, and done will refuse. Changing the mark would change what the copy prints, so the warning goes into the replies instead, and a mark for "approved, no Proof" is left as a follow-up for the owner to decide.
- `merged` reply: for each issue that holds no Proof row since the window, a loud note beside `MERGED WITHOUT A FRESH REVIEW`: `NO PROOF FROM THE WORKER — <id> holds no Proof row since it was moved → <status>; the merge check is recorded in the merge record and is not proof; done refuses until the worker records it: jarl.mjs evidence <id> --ran … --saw …`. It records, and never refuses.
- `review` reply (`nextAfterVerdict`, 3824-3829): the steps name Proof ("then set done, which needs a Proof row from the worker"), and an approve given while the issue holds no Proof row since the window says so. This is the ordering gap of invariant I6 in the coherence review (an approve recorded before any proof). Now that the merger's check is no longer a row, the rule "the live approve is newer than the newest Proof row" could be enforced without refusing the normal flow, where the merger's check comes after the approve. It would change gate outcomes on recorded loops, so it is not part of this issue; it is named for the owner as a follow-up.

## 6. `record.mjs` and Horde

`record.mjs` adds no export, removes none and reshapes none, and `RECORD_API` stays `jarl-record/1`. The contract test is not edited. Its sequence (no evidence refused, a row, a merge, the rows, a retraction) passes as before. Its issue gets the split form, and `evidenceRows` reads the rows of the whole section in either form. Documented in the header comments only: `addEvidence` puts rows in Proof and text in Notes; `recordMerged` takes the optional keys `ran` and `saw`, which it already passes through, and they go to the merge record and are never a row; `evidenceRows` reads both forms.

Horde writes the proof of a ticket in `closeMerged` (loop.mjs:140-146): `recordMerged` with `sha` and `ci` only, then `addEvidence` with its `ran` and `saw`, then the move through its gate (`requires-merged`, `approve: none`). Its row is an `addEvidence` row, so it lands in Proof and still satisfies the rows its gate asks for. Nothing moves to the merge record. `ticketEvidence` (loop.mjs:175) puts rows in Proof and text in Notes. `replaceTicketBody` (tk.mjs:1429) keeps everything from `## Evidence` to the end, sub-headings included. Its `**Evidence:**` header field is a header field, untouched. Its vendored copy reads the split form right (section 3). None of Horde's tests asserts row text. Horde needs no change, now or at its next vendoring. A composer that relied on `recordMerged` with `ran/saw` to meet a gate that asks for rows would now be refused, with the `evidence` command named. That key was never in the documented opts, and Horde does not pass it.

## 7. The smallest design

Three designs meet the defect, and the probes above decide between them.

- **(S) No heading.** One Evidence section as it is; only the merger's check moves to the merge record. This is the whole gate fix: the gate reads row events, and those are then written by `evidence` alone. It needs no format step and changes no reader. It does not meet acceptance lines 1 and 3, which ask for headings and for each kind to land under its heading. Rows, notes, rulings and reasons stay interleaved, so a reviewer cannot see at a glance what counts, and 321's attachments have no place to land.
- **(T) Two top-level headings** `## Proof` and `## Notes` in place of `## Evidence`, as the issue first sketched. The frozen reader misreads it in silence (section 3), so it has to raise the format. It needs a second path for every reader of `sections.evidence` (`workEvidence`, `evidenceTable`, `retractEvidence`, `appendRuling`, `cmdSet`, `statusReason`, the findings matcher, `setSection`'s rule that Evidence stays last at 810-812, `renderIssue` at 922, `BUILTIN_SECTIONS`). It collides with any profile section named Proof or Notes. And Horde's `replaceTicketBody`, which keeps the text from `## Evidence` on, would delete both sections on every body edit until Horde changed.
- **(U) Sub-headings inside Evidence**, the design of section 2. It is (S) plus a placement rule and two lines of text. The frozen reader and Horde read it right, so it needs no format step. Readers of `sections.evidence` keep one path: only `workEvidence` and `show` look at the parts.

**Recommended: (U).** It is the smallest design that meets acceptance lines 1 to 4 and 6. For line 5 it meets "format-marker.test.mjs is green" and changes the second clause. The frozen reader refusing a split loop loudly is there to stop a misreading, and the probe shows there is none. The rule of the marker forbids raising the format without one: a raise would stop every earlier reader, Horde's vendored copy included, from opening a loop it reads right. The proposed line is: "format-marker.test.mjs is green unchanged, and the frozen earlier reader reads a loop in the split form right, tested: done refused on the merger's check alone, accepted on a worker row, the Deferred reason in report; the record format is not raised". The fresh reviewer of this note approves that change of line 5, or holds to it as written. In that case the design is (T) with a raise to format 2, which every released reader and Horde's vendored copy refuse. The base of this issue (`release/6.2.0` before it) reads format 2 too, so only a format 3 would make that unreleased base refuse. This note does not recommend paying for that: the base is never released, and the release loop is driven by the pinned earlier reader, not by the base.

## 8. Commit plan

Before the first commit, take the goldens of the frozen copy with the base: the `live-loop.test.mjs` set (status, resume, next, report, models, list, tips, queue, branches, text and JSON) and `show` of ten issues chosen to cover a row, a note, a ruling, a reason and a merge. The oracle of every commit is the suite (`cd skills/jarl/scripts && timeout 600 npm test`) and `live-loop.test.mjs` with `JARL_LIVE_LOOP` and `JARL_LIVE_GOLDEN` set to that copy, recorded as a row. `tips` and `branches` read git, so take them on the same machine within the same hour.

1. **The merger's check goes to the merge record.** `cmdMerged` writes no row, writes `Merge check` (added to `TOOL_FIELDS`) and keeps its merge line byte for byte; the `merged` and `review` replies as in section 5. Tests: `proof-notes.test.mjs` takes an issue with no worker row through a fresh approve, `merged --sha --ran --saw` and `set done`, and expects a refusal naming `evidence` (red on the base: acceptance line 2). The merge line equals the base's for the same calls; `checkState` and the landing banner are unchanged; a Horde-shaped flow (`recordMerged`, then `addEvidence`, then done under `requires-merged` and `approve: none`) still closes; a profile declaring `Merge check` is refused. Oracle: suite, goldens.
2. **Placement.** One function that writes an entry into its part (Proof after the last row, Notes at the end, a sub-heading at its first entry, an unsplit section appended as today), used by `cmdEvidence`, `retractEvidence`, `appendRuling` and `cmdSet`; `bodyText` on text and reasons. Tests: a row, a note, a ruling via `decide --settles`, an `answer --issue` ruling, a `Deferred:` reason and a retraction each land under their heading, and the merge check in the header (acceptance line 3). The row numbers hold when a row sits under Notes (written there by hand, as an older writer would) and a new row and a retraction follow. For an unsplit issue every writer's output is byte-identical to the base's for the same calls. Oracle: suite, goldens.
3. **Reading the parts.** `workEvidence` reads Proof in a split section, and `show` keeps the sub-headings, windows Proof and prints Notes whole. Tests: show of a split issue across a reopen; a note alone under Notes gives "has no evidence yet"; `show` on unsplit issues is unchanged (goldens). Oracle: suite, goldens.
4. **The earlier reader.** `tests/old-jarl.mjs` learns to run `set` and `report` (its pinned library is untouched), and `format-marker.test.mjs` gains one case: on a loop built in the split form the frozen reader refuses done on the merger's check alone, accepts it on a worker row, prints the Deferred reason, and finds the format still 1. Or, if line 5 is held, the raise and its loud refusal. Oracle: suite.
5. **The words.** SKILL.md describes Proof, Notes and the merge record once, in the present tense, where the record is described. The help of `evidence`, `merged`, `show` and `review`, the header comments of `record.mjs` (section 6) and the changelog fragment say the same. `record-contract.test.mjs` is green and unedited. Oracle: suite, and the goldens as the last row on the issue.

### Risks

| Risk | Detection |
|---|---|
| An unsplit issue's writes or prints drift | Commit 2's byte test for each writer; the goldens of the frozen copy |
| Row numbers move under a retraction | Commit 2's test with a row under Notes; 251 reports a row outside Proof |
| A user or composer relied on `merged --ran/--saw` to meet the rows of the gate | Commit 1's composer-shaped test; the refusal and the `merged` note name `evidence`; Horde's flow checked in section 6 |
| An approved issue with no Proof still reads "queued for the merge" (169 on the copy) | The `merged` note says it loudly at the merge; the mark is a follow-up for the owner |
| A note holding a line that reads as a sub-heading | `bodyText` escapes it at the write; none exists in the copy |
| A mixed-version loop: an older writer's merge row lands under Notes and counts | Said in SKILL.md: the merger's check is kept out of Proof only by this Jarl; 251 reports a row under Notes |

## 9. What follows for issues 321 and 251

**321 (attachments).** An attachment is a Proof entry: its row is written after the last row of the section, under `### Proof`, never in Notes or in the merge record. Its journal line is its own typed kind, which the free `log` refuses through `LINE_WRITERS`. It is not a `- **ran:**` row, so the row numbers do not count it, and whether an attachment can be retracted is 321's to decide. The slot checks read the journal's attachment lines and the files at their paths, never the sub-heading. The place is proof by construction because the kind of the line says so, not because of the heading.

**251 (verify).** Verify adds no grammar. It reports what the parts reader of commit 2 cannot place: a row under `### Notes`, a ruling, reason, note or retraction entry under `### Proof`, `### Notes` before `### Proof`, a sub-heading written twice, and a Merge check field on an issue whose last merge line names no check. It does not guess which rows of an unsplit section were the merger's, because nothing recorded says so.
