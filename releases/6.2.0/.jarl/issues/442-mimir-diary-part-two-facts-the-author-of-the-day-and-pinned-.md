# 442 · Mimir diary, part two: facts, the author of the day and pinned links to messages

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Tags:** mimir, workplace, session, diary
**Files:** Mimir/owner-setup/journal/extractor.mjs, Mimir/owner-setup/journal/author.mjs, Mimir/owner-setup/journal/verify-links.mjs, Mimir/test/journal-links.test.mjs, Mimir/test/fixtures/fake-claude
**Repo:** ../../../Mimir
**After:** 441
**Found by:** owner
**Where:** the owner, 2026-10-25: Haiku is fine for the work after the ingest; the diary links to the archive's files so that a search for film material goes from the day into the raw messages

## What
Interfaces of a fact extractor (Haiku 5.5 by default, a fake in tests) and of the author of the day (Haiku or Sonnet 5.5, configurable), called through claude -p --model on the user's own login, with an API key as a variant. Message markers in the text are checked against the archive's database; an unknown id fails the day, and each known marker becomes a pinned link mimir://<desk>:session/<id>@<version>#m=<uuid>, where @ for a kind without git is a prefix of the sha-256 of the archive file when the day was generated, and a read at another hash returns the message with a warning (the archive is only appended to). The day is written by the write core to journal/yyyy-mm-dd.md in the knowledge role of the configured area. A real run of a model happens only on the owner's word.

## Why
A diary must be checkable: every fact leads to the message it came from.

## Acceptance
- A fake with correct markers gives a day whose every link reaches an existing message; an invented id fails the day
- A read after the archive grew returns the same message with a warning about the hash; without claude or a login the answer is UNAVAILABLE with its fix (a fake claude on the PATH)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

