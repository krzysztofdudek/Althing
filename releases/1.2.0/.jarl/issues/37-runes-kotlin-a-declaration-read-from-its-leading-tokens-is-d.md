# 37 · Runes, Kotlin: a declaration read from its leading tokens is declared on the line of its class, fun…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1734-cimy
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-709-opus
**Where:** the review of 709

## What
Runes, Kotlin: a declaration read from its leading tokens is declared on the line of its class, fun or val keyword, not of its first annotation, while a tree-read annotated declaration is declared on its first annotation's line. A misread declaration in a clean file (okhttp's @OkHttpInternalApi over const val TYPE_A, TYPE_AAAA, TYPE_HTTPS and CLASS_IN, @Tag("Slow") over open class ConnectionListenerTest, @Target and @Retention over annotation class Flaky, StartStop and OkHttpInternalApi, @TargetClass and @Delete over class TargetBouncyCastlePlatform) and a damaged declaration's lexical fallback (CacheTest, URLConnectionTest, Http2Stream, Android10Platform, Android17SocketAdapter) take the keyword's line, which readHeader takes from the keyword token: 14 top-level declarations of okhttp at 984e8bf, the same at b4b3ffe, more than the 6 issue 709 moves. The same text is then declared on another line depending on how it was read, which is the harm issue 709 names.

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: declarations read from their leading tokens took the keyword's line at v1.1.0 already (ruling runes-1-2-0-cut-for-new-findings)

