# 340 · Yggdrasil: yg check runs out of memory on a repository with large mapped files, because the relation pass holds every mapped file as text

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** yggdrasil, relations, performance
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/relations/pass.ts: enumerateFileRecords and readSourceText; the rule input of the deterministic worker reads each own file of a node whole as well

## What
On a real repository with about 12 000 tracked files and about 2.4 GB of mapped content (52 files over 5 MB: transcripts up to 100 MB, archives, video, images), yg check 6.1.0 on Node 24 dies after about 83 seconds with 'Reached heap limit Allocation failed - JavaScript heap out of memory' at the default heap of about 4 GB, its stack in reading files into strings. With the heap raised to 12 GB it finishes. The cause in the code: the relation pass reads every mapped file of every node, whatever its language, decodes it as UTF-8 and keeps the string in its file records for the whole run; a binary file is decoded too, and its replacement characters take two bytes each. On release/6.2.0 readSourceText still reads every mapped file and keeps its UTF-8 text even when it marks the file binary. The deterministic rule worker also reads each own file of a node whole as text, with no size or binary limit.

## Why
A check that cannot finish on a large repository blocks every commit there through the pre-commit hook, and raising the heap only moves the limit. Only files the relation pass parses need their text; the rest need an identity (a hash from the bytes or a stream).

## Acceptance
- The relation pass reads as text only the files whose language it parses; every other mapped file is identified by a hash computed from its bytes, without a string kept for the run
- A binary or very large file is never decoded to text for a rule; a rule that asks for its content gets it marked binary or too large, as the rule API documents
- A test builds a repository whose mapped files exceed the default heap (generated, not committed) and yg check finishes under the default heap; peak memory is reported
- The CHANGELOG says what changed for large repositories

## Evidence

