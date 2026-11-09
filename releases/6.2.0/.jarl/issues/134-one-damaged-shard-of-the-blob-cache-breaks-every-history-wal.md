# 134 · One damaged shard of the blob cache breaks every history walk; refresh --full does not repair it, and the error does not name the file

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-pwup
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/bin/grain.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/history.mjs:224 in BlobCache.shard: `s = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};` without try/catch; called from parseBlobs (:346, `cache.has(s)` for every blob of the walk) through BlobCache.has (:230); the cache is created on every walk (:803), also with `--full`, and nothing in `--full` clears blobs/; the constructor (:200-217) discards shards only on a mismatched stamp or a wrong name length, never because they do not parse. The other cache files are read through readJson (engine/grain-context.mjs:156-162, null on a parse error), and readHistoryState sits in a try/catch with a log (history.mjs:806-814). The top-level handler bin/grain.mjs:28 prints only e.message. The same unguarded line on release/6.1.1.
**Branch:** jarl/109-freshness-and-store-truth
**Merged:** 3b40074
**CI:** none

## What
Reproduction (fresh clone of github.com/krzysztofdudek/Grain at v6.1.0, ae6152f; own JS fixture with 13 commits (src/handlers, src/services, src/util) in six clones; in each, an index through `grain where handler`, damage to one cache file, `git commit --amend` and a repeated query; script verify-72/repro.sh):
- Emptied model.json, meta.json, tree.json or history.json: the query rebuilds and answers, exit 0.
- Emptied blobs/08e.json: `where`, `refresh --full` and even `status` print only '[grain] Unexpected end of JSON input' and end with exit 1.
- A shard cut to 40 bytes: the same commands print 'Unterminated string in JSON at position 40 (line 1 column 41)'.
- GRAIN_DEBUG=1: stack JSON.parse ← BlobCache.shard (history.mjs:224:32) ← BlobCache.has (:230) ← parseBlobs (:346).
- No self-repair: the shard is damaged after every command, and every following query that needs a history walk fails the same way until the user removes the directory by hand.
- `--no-history` avoids the problem (exit 0); moving `.grain/cache/blobs` aside fixes it (25 blobs parsed afresh, exit 0).
- Beyond the report: the incremental path is affected too. Without rewriting history, a new commit whose blob lands in the damaged shard fails with 'walking <sha>..HEAD' and 'Unterminated string … position 3', exit 1, so the full walk from the report is not needed: every walk that reads the damaged shard fails.

Shards are written atomically (tmp + rename, history.mjs:176-180), so a shard being damaged on its own is rare; likely causes are a crash or a power loss before the data reaches the disk (no fsync), a sync tool or a manual edit. Different from 487 from release-6.1.0 (cache invalidation by the grammar stamp).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-10/f9-corrupt-shard/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-72/V-corrupt-shard.log.

## Why
docs/reference.md:274 says 'cache/ disposable, rebuilt on demand', reference.md:47 that `refresh --full` 're-walks the whole history', and the comment history.mjs:806-810 sets the policy for a damaged history.json: 'the only consequence is a slower full re-walk, never a wrong answer'. Here the tool stops working with a message that names neither the file nor the remedy, though README.md:155 knows it ('Delete the cache any time; the next query rebuilds the same bytes'). The answer is never wrong, there is only an exit 1, hence minor.

## Acceptance
- A shard that does not parse is treated as a cache miss (`{}`, and its entries are parsed afresh), and its path goes to the log.
- `refresh --full` also discards the blob cache, or at least the error names the file and the `.grain/cache` directory.
- repro.sh: after emptying one blobs/<xxx>.json, both `grain where handler` and `grain refresh --full` end with exit 0.

## Changelog
- Fixed: one damaged file in Grain's cache no longer makes every query fail; Grain rebuilds that part of the cache and names the file.

## Evidence

red: tests/corrupt-blob-shard.test.mjs on release/6.1.1 code 0/2 (emptied / 3-byte shard: where exits 1 'Unexpected end of JSON input'); green 2/2 at 93835c2: where and refresh --full exit 0, log names the shard path, shard rewritten. --full still keeps the blob cache (only the damaged shard is re-parsed).
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2119, pass 2118, fail 0, skipped 1, merge 3b40074

