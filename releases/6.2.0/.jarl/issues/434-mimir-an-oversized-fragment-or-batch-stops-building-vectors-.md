# 434 · Mimir: an oversized fragment or batch stops building vectors for good (HTTP 413)

**Status:** dropped
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1430-brry
**Tags:** mimir, workplace, search, performance
**Files:** Mimir/src/search/embed.mjs, Mimir/src/search/vectors.mjs, Mimir/src/doctor, Mimir/test/search-embed.test.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** jarl
**Where:** found live on a real Desk of about 120 thousand fragments with bge-m3 in a local Ollama: after six runs and 15 904 vectors every mimir index ends with the warning UNAVAILABLE 'the Ollama answered HTTP 413 to the embedding request' and does nothing more, stuck at 13 percent

## What
A batch of 32 fragments, or one fragment, has more bytes than the model's request or context allows, and the adapter treats 413 as a failure of the whole run, so the next run meets the same batch. The fix: cut a fragment's text to a character limit that follows from the model's context (a named constant, about 6000 characters, overridable as search: embed-max-chars), keeping the fragment's key; split batches by total bytes as well as by count; on 413 or 400 halve the batch and retry down to one fragment; record a fragment that still fails as skipped (its id, never its text) and go on; report the number skipped in index and doctor; retry a skipped fragment only when its text, the model or the limit changes; cut an overlong query to the same limit; count skipped fragments as not doable when measuring coverage for the auto mode.

## Why
Without it the vectors of a real Desk cannot be built, and the auto mode of search stays at keyword search for good.

## Acceptance
- A fake HTTP server answering 413 above N bytes: index builds vectors for every fragment below the limit and reports the skipped count, with no error and no loop
- A fragment over the limit is cut and gets a vector; one the server refuses even cut is skipped and not sent in the next run (the second run's requests are counted)
- Batches split by bytes and halve on 413 or 400 (a request counter); doctor and index report N skipped, and no fragment text reaches a log or a message

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

