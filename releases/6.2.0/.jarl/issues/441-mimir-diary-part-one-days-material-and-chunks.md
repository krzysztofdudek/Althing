# 441 · Mimir diary, part one: days, material and chunks

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261029T1430-felv
**Tags:** mimir, workplace, session, diary
**Files:** Mimir/owner-setup/journal/day.mjs, Mimir/owner-setup/journal/chunks.mjs, Mimir/src/manifest/keys/prefs.mjs, Mimir/test/journal-day.test.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** owner
**Where:** the owner, 2026-10-25: the diary is not a summary of a session but of a day, from all its sessions, made mechanically by a script, with links to the raw archive

## What
Without a model: a message belongs to a day by its timestamp in prefs.timezone; the material of a day (user messages, answers, short descriptions of tools); chunks under 100 thousand tokens, estimated as characters divided by three (a constant in one place, conservative for languages with long words); front matter with generated-hash and sources; a day corrected by hand gets its new content as an addendum file; a session appended later marks its day for rewriting; prefs.timezone and prefs.language validated in the registry of keys.

## Why
The diary of a day is the raw material for films and training: one place per day, every fact traceable to its message.

## Acceptance
- A message at 23:30 UTC lands on the right local day in summer and in winter time; a changed hash gives an addendum instead of an overwrite; a late session marks its day
- A day of 400 thousand estimated tokens gives at least five chunks under 100 thousand; an unknown time zone or language gives SCHEMA with its fix

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

