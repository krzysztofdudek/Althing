# 39 · Runes: in a file whose lines end with a lone CR, the Python, Go, Ruby, C and C++ grammars do not end a statement or directive at the CR, so the file parses with errors

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1849-duig
**Tags:** runes, line-numbers, grammars
**Files:** 
**Repo:** Runes
**Found by:** w-764-opus
**Where:** the grammars' own parse; Kotlin's recovery tokenizer and splitter count LF only

## What
Found by the worker of 764: after 764 every extractor reports the line an editor shows in a lone-CR file, but the Python, Go, Ruby, C and C++ grammars do not treat a lone CR as a line end, so such files parse with errors (Ruby without semicolons is misread), and Kotlin's recovery tokenizer counts LF only. This was so at v1.1.0.

## Why
A lone-CR file in those languages may give missing or wrong uses, not only wrong lines.

## Acceptance
[read] A ruling in the loop says whether lone-CR files are normalized before parsing for these grammars or stated in docs/api.md as a limit, with how often the form occurs

## Evidence

### Notes

Deferred: To the next Runes version: v1.1.0 parsed lone-CR files the same way (ruling runes-1-2-0-cut-for-new-findings)

