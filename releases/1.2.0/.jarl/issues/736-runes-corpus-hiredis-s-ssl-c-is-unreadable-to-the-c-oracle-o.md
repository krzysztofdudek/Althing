# 736 · Runes corpus: hiredis's ssl.c is unreadable to the C oracle on every machine, so six of its include edges are checked nowhere

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-vdfn
**Tags:** runes, corpus, c
**Files:** 
**Repo:** Runes
**Found by:** rev-733-opus
**Where:** the review of 713, 733, 734
**Branch:** jarl/753-classify-reasons
**Worker:** w-753-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:19

## What
Runes corpus: since 734 the C oracle reads hiredis's ssl.c as unreadable on every machine, so its 6 include edges, which CI's corpus job checked before (run 43154806778: hiredis checked: c 50), are checked nowhere (44). With -nostdinc and -DHIREDIS_NO_PEER_NAME_VERIFICATION, the define ssl.c's own #error names, ssl.c preprocesses on this host (closure: hiredis.h, read.h, sds.h, alloc.h, async.h, net.h, win32.h, async_private.h, hiredis_ssl.h). Adding that define to hiredis's c.defines in corpus/manifest.json would check all 50 on every machine, and the ssl.c explanation would then be retired because its disagreement no longer occurs.

Moved from issue 736 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
Six include edges of one C file are checked by no gate on any machine, so a regression there passes every gate.

## Acceptance
[check] corpus/manifest.json gives hiredis's C oracle the define that ssl.c's own #error names, the corpus gate checks all 50 hiredis include edges on every machine, and the ssl.c explanation is retired from corpus/explained.md · by: npm run corpus

## Evidence

