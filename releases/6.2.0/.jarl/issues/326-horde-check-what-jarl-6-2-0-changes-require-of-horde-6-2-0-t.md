# 326 · Horde: check what Jarl 6.2.0 changes require of Horde 6.2.0: the vendored record library, the profile, the ids, the mission files

**Status:** open
**Kind:** research
**Priority:** 2
**Tier:** strong
**Tags:** horde, jarl, compat
**Files:** Horde/skills/horde/scripts/loop.mjs, Horde/skills/horde/scripts/queue.mjs
**Repo:** ../../../Horde
**Found by:** coordinator
**Where:** Horde's vendored copy of the Jarl record library and the code that calls it (loop.mjs, queue.mjs, jarl-profile.json)
**After:** 313

## What
The owner, 2026-10-18: do the things that are in Jarl 6.2.0 need to be applied to Horde 6.2.0? Not to be done now; this issue is the standing reminder that it must be checked before Horde 6.2.0 is released, after Jarl 6.2.0 ships alone. Horde vendors Jarl's record library (record.mjs and the library behind it) at a release tag and runs its missions on it, and its own code pads issue ids to three digits and parses them as numbers. The check covers: (1) the record contract jarl-record/1: every export Horde calls still behaves as Horde expects after the library changes of this release (the review of 245 changed which evidence rows count, 246 the CI default of a merge, 248 how multi-line texts are stored, 287 the model fields, 249/283 the views, 310 and 322 the id grammar, 319 the cleanup that library callers do not get); (2) the record format: a Horde mission that writes any element that raises the format (a repository name, an id written without padding below 100 or an id of 1000 or more, a retraction) makes every older Jarl refuse the mission, and Horde itself vendors one Jarl; (3) Horde's profile file (jarl-profile.json): the keys it declares against the profile checks of this release, the tiers (light, standard, strong) and the new fields (Model, Resources); (4) ids: Horde writes padded three-digit ids and Jarl now writes plain numbers; both must resolve to the same issue everywhere Horde reads or writes an id; (5) the stderr notes and the new defaults of the command line: Horde, a library caller, must see none; (6) Horde's own full suite with the 6.2.0 library vendored in a scratch copy, then the decision whether Horde re-vendors at the Jarl 6.2.0 tag in its own release or keeps its pin, and what its CHANGELOG then says; (6.5) Horde's own ticket lookup: ticketFile in loop.mjs matches /^\d{3,}-/ at the start of a file name, so a ticket that the library files under a plain number below 100 (7-<slug>.md) is never found, and the finding says how Horde reads plain-number files before the Horde release. The outcome is a short note on this issue with the decision and, where a change in Horde is needed, the issues for it.

## Why
Horde is the one composer of the record library besides the command line; a change in the library that Horde does not expect would break missions in the field, and the first sign would be a mission that stops, not a test.

## Acceptance
- A scratch copy of Horde with the Jarl 6.2.0 library vendored passes Horde's full suite; the run is recorded as a --ran/--saw row
- Each of the six points above has a written finding on this issue: no change needed, or an issue filed for Horde
- The decision to re-vendor at the Jarl 6.2.0 tag or to keep the pin is recorded with its reason, and the Horde 6.2.0 CHANGELOG line it implies is written for people who use Horde

## Evidence

- **ran:** note from the library parity work: the record library and the command line differ in 29 listed ways (the section 'What only the command line does' of the skill, held by a parity test) · **saw:** no library default changed: the merge CI default (pending) and the caller of a status move are listed as differences, answer records its owner when called through the library, set --worktree is accepted by the library and stores nothing; Horde must be checked against that list

