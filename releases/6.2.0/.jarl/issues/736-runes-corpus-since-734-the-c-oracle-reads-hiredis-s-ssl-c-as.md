# 736 · Runes corpus: since 734 the C oracle reads hiredis's ssl.c as unreadable on every machine, so its 6…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261113T1723-dolu
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-733-opus
**Where:** the review of 713, 733, 734

## What
Runes corpus: since 734 the C oracle reads hiredis's ssl.c as unreadable on every machine, so its 6 include edges, which CI's corpus job checked before (run 43154806778: hiredis checked: c 50), are checked nowhere (44). With -nostdinc and -DHIREDIS_NO_PEER_NAME_VERIFICATION, the define ssl.c's own #error names, ssl.c preprocesses on this host (closure: hiredis.h, read.h, sds.h, alloc.h, async.h, net.h, win32.h, async_private.h, hiredis_ssl.h). Adding that define to hiredis's c.defines in corpus/manifest.json would check all 50 on every machine, and the ssl.c explanation would then be retired because its disagreement no longer occurs.

## Why


## Acceptance


## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-1-1-0-review-findings-after

Deferred: Moved to the Runes 1.2.0 loop (releases/1.2.0) under the same number, on the owner's answer to a-41 and a-42; it is worked and closed there

