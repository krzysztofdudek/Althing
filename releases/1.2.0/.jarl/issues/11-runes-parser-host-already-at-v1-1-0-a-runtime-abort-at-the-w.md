# 11 · Runes parser host, already at v1.1.0: a runtime abort at the WebAssembly 2 GiB memory limit (Aborte…

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1246-ejui
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-765-opus
**Where:** the review of 188, 765

## What
Runes parser host, already at v1.1.0: a runtime abort at the WebAssembly 2 GiB memory limit (Aborted(), C# 'int x = f(a < b, ...' at 32 KiB) is caught by the scanner-trap retry and run again on a fresh parser (Aborted() printed twice), then rejects with a plain 'Aborted()' error that carries no code, while every later parse in the process fails ('table index is out of bounds'); a consumer can tell that it must restart the process only from the message text.

## Why


## Acceptance


## Evidence

### Notes

Dropped: Duplicate of 5 (a parse the runtime aborts is retried as a scanner trap and the host stays damaged), filed by the worker of 765 earlier; 5 joins the lease of 765, which touches the same retry

