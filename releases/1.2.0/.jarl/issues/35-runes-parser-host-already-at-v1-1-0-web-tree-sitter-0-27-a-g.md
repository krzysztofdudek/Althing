# 35 · Runes parser host, already at v1.1.0 (web-tree-sitter 0.27): a grammar load at the WebAssembly 2 Gi…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1712-bwxw
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-27-opus
**Where:** the review of 27

## What
Runes parser host, already at v1.1.0 (web-tree-sitter 0.27): a grammar load at the WebAssembly 2 GiB limit does not abort, it damages the runtime silently, so the host records nothing and every later call goes on. The runtime's loader takes a grammar's memory with calloc and does not check for null, and this build lets malloc fail instead of aborting (only tree-sitter's own allocator calls abort). Probe at Runes 39e15be on 0.27.2: one host with C# loaded, the heap filled with parsers (newParser) to within 35 parsers of the limit, then parseFile of a .py file: Language.load returned, new Parser threw 'RuntimeError: table index is out of bounds', and a later parse of a .cs file on the parser cached before failed the same way, with no 'Aborted(' anywhere and no code. With 36 freed, the load and the parser went through and the parse of 'x = 1' never returned (killed at 30 s); with 37, all parsed. A consumer that follows docs/api.md restarts only on ERUNTIMEABORTED. Options: load every grammar a run needs before its first large parse (loadGrammarsFor) and say so in docs/api.md, or treat a RuntimeError from a grammar load or from making a parser as damage.

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: present at v1.1.0 already (ruling runes-1-2-0-cut-for-new-findings)

