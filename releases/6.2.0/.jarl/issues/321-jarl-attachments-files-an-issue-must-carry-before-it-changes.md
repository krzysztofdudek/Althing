# 321 · Jarl: attachments: files an issue must carry before it changes state, declared by the profile per kind of issue, stored in a fixed place, checked mechanically

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** jarl, attachments, profile
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/attachments.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (profile, set, show, verify)
**After:** 251

## What
The owner, 2026-10-18 (translated from Polish): when he works on bugs with Jarl in another project, he has the agent take screenshots before and after the fix; some kinds of issue should have the attachment of files enforced mechanically, files of a given kind in a given place (for example a before and an after image under the issue folder), checked by Jarl before a state change. His example: a bug hunt files 50 issues, each becomes its own pull request, each with a description and pictures. Design, as trimmed by the architect code review of 2026-10-18 (finding O7 and section 5), so it lands in the existing evidence seam (evidenceTable, doneRefusal) instead of a subsystem: (1) an attachment is one more kind of evidence row: evidence <id> --file <path> --slot <name> records the path of a file at the place the profile declares for that slot, its sha256 and its size, and copies nothing; (2) the profile declares, in its done gate, a requires-slots key per kind of issue, for example "done-gate": { "requires-slots": { "bug": ["before", "after"] } }, and per slot its place (a path pattern under the issue, such as attachments/<id>/before.*), the allowed extensions and a minimum size; (3) set to a guarded state is refused, naming each missing slot and the evidence command that fills it, unless for every required slot the file exists at the declared path, has an allowed extension and at least the minimum size, and its recorded hash still matches; (4) show and the reviewer brief list the slots with their paths, so a reviewer agent can open them; (5) verify (251), which runs before this package, gains the slot checks through its strict parse of evidence rows and the profile, with no grammar of its own. There is no copy store, no storage policy and no export command. Jarl does not judge what a picture shows: that stays the reviewer work, and the gate only guarantees that the proof exists, has the right shape and is the same file that was recorded. With 333 (Proof and Notes) landed before it, an attachment row is proof: it lives in the Proof part of the issue beside the worker --ran/--saw rows, never in Notes or in the merge record, and the slot checks read Proof alone.

## Why
A bug fix without a before and an after picture cannot be reviewed by looking; a rule that lives only in the instructions of an agent gets forgotten, a rule the done gate enforces does not. A row that records a path and a hash gives that guarantee with the seam the gate already has; a store, a storage policy and an export would make Jarl an artifact manager, which it does not grow into. An export of one issue as a pull-request body is a possible later issue, on its own, if the owner wants it.

## Acceptance
- evidence <id> --file <path> --slot <name> records one row with the slot, the path relative to the loop root, the sha256 and the size, and copies nothing; it refuses a missing file, an empty file, a slot the profile does not declare for the kind of the issue, a path outside the declared place, and an extension the slot does not allow; tested
- A profile may declare "done-gate": { "requires-slots": { "<kind>": ["<slot>", ...] } } with, per slot, its place, its allowed extensions and its minimum size; validateProfile checks the key; a profile without it behaves exactly as without the feature, and a profile that declares it is refused by a Jarl that does not know the key, tested with the frozen earlier reader
- set to a guarded state refuses, naming every missing slot and the evidence command that fills it, and refuses when a recorded file is gone, has a disallowed extension, is under the minimum size, or no longer matches its recorded hash; an issue of a kind with no required slots is unaffected; tested one condition at a time
- show lists the required slots of an issue with their recorded paths and whether each is filled; verify reports a slot row whose file is missing or whose hash no longer matches, with no parser of its own
- The library callers of the record code see no change: record-contract.test.mjs green, RECORD_API unchanged
- SKILL.md describes attachments and the bug-hunt workflow (many issues, each with before and after pictures, each a pull request) in the present tense, without version words
- Not here: a copy store, a storage policy for committed loops, and an export command

## Evidence

