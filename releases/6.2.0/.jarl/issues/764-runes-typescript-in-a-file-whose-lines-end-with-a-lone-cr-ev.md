# 764 · Runes, TypeScript: in a file whose lines end with a lone CR, every use is reported on line 1

**Status:** deferred
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261115T1054-czqb
**Tags:** api, line-numbers, runes, typescript
**Files:** Runes/src/relations/extractors/typescript.mts, Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-lone-cr-lines
**Where:** Runes/src/relations/extractors/typescript.mts:334

## What
Claim: At v1.1.0 a use's line is node.startPosition.row + 1, and tree-sitter counts rows by LF alone, so a file with old Mac line ends is one row. Measured in TypeScript; the extractors of the other languages take their lines the same way (63 places).

repros.sh cr_lines: src/a.ts of three statements ended by CR alone, with the import on line 3, printed src/a.ts:1

## Why


A use is reported on the wrong line, so a message points at line 1 and a waiver written on the right line does not match. A new family tool that uses the readers as they are found it.

## Acceptance
- [test] In a file whose lines end with a lone CR, the line of every use in TypeScript is its real line, in a unit test and a catalogue case, red at v1.1.0 (line 1) and green after; files with LF, CRLF, a BOM and U+2028 give the same lines as before · by: npm run check
- [read] The other extractors take their lines in the same way; each either gets the same case or is named in docs/api.md as counting LF only

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

