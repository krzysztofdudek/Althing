# 435 · Mimir: search and grep find the messages of extension kinds such as session

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** mimir, workplace, search, session
**Files:** Mimir/src/search/sources.mjs, Mimir/src/extensions, Mimir/test/search-extension-kinds.test.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** jarl
**Where:** Mimir at 10257cd: the session kind gives chunks, grep with #m= addresses and paged reads at the module level, but the core's indexer reads only folder-based kinds (src/search/sources.mjs) and the core's grep returns line addresses

## What
The extension contract gains an optional chunks(ctx) of a kind (each chunk with address, text, level, weight and embed, given as an iterator or pages, never all in memory), and indexing uses it: a kind's chunks enter the index at the generated level with their weight (embed false only into the text index, embed true also into vectors when an embedder is set), a hit's address is the message's #m= address, and the core's grep over such a kind returns #m= addresses from the kind. Incremental from the kind's last cursor. Without declared extensions, indexing and search are unchanged in results and cost. No message text reaches logs or error messages.

## Why
Without it the archive of sessions can be read but not searched from the ordinary search, which is the archive's main purpose.

## Acceptance
- A fixture kind with chunks: a sentence of a user message is found by mimir search with its #m= address, and the text of a tool result (embed false, metadata only) is not found by content
- Appending one message indexes only it; a kind that throws or hangs in chunks is skipped with a warning and the rest of the index is built
- Without extensions, the results, order and time of search, grep and index are unchanged (the synthetic set's baseline)

## Evidence

