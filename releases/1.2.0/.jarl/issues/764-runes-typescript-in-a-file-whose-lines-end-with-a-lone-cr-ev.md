# 764 · Runes, TypeScript: in a file whose lines end with a lone CR, every use is reported on line 1

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-orqw
**Tags:** api, line-numbers, runes, typescript
**Files:** Runes/src/relations/extractors/typescript.mts, Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-lone-cr-lines
**Where:** Runes/src/relations/extractors/typescript.mts:334
**Branch:** jarl/764-lone-cr-lines
**Worker:** w-764-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 18:16

## What
Claim: At v1.1.0 a use's line is node.startPosition.row + 1, and tree-sitter counts rows by LF alone, so a file with old Mac line ends is one row. Measured in TypeScript; the extractors of the other languages take their lines the same way (63 places).

repros.sh cr_lines: src/a.ts of three statements ended by CR alone, with the import on line 3, printed src/a.ts:1

Moved from issue 764 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A use is reported on the wrong line, so a message points at line 1 and a waiver written on the right line does not match. A new family tool that uses the readers as they are found it.

## Acceptance
- [test] In a file whose lines end with a lone CR, the line of every use in TypeScript is its real line, in a unit test and a catalogue case, red at v1.1.0 (line 1) and green after; files with LF, CRLF, a BOM and U+2028 give the same lines as before · by: npm run check
- [read] The other extractors take their lines in the same way; each either gets the same case or is named in docs/api.md as counting LF only

## Changelog
- in every language, a file whose lines end with a lone CR (old Mac line ends), or that mixes lone CRs in, now gives each use and declaration the line an editor shows, counted by LF, CRLF and lone CR alike; in 1.1.0 every use of such a file was on line 1, or on the line of its LF row. A Vue or Svelte component keeps its lone CR lines in its script view too. A file with LF or CRLF line ends keeps every line it had. A consumer's findings in such files move to their real lines, so a waiver written for line 1 no longer matches them.

## Evidence

### Proof

- **ran (line 8a5603789b44):** git checkout eee139c -- src && npm run build && node --test --test-name-pattern='lone CR|LF, CRLF' test/relations/extractors/typescript.test.mjs test/relations/extractors/*-name-resolution-matrix.test.mjs (the tests of b710510 over the source before the fix, which reads lines as v1.1.0 does, row + 1) · **saw:** tests 18, pass 2, fail 16: all eleven lone-CR catalogue cases red, each with the use on line 1 (r/app/use.ts:1->m where :3 is expected, likewise Python, Go, Java, Kotlin, C#, PHP, Rust, Ruby, C, C++), and the five TypeScript lone-CR unit tests red; the LF, CRLF, BOM and U+2028 test green
- **ran (line 8a5603789b44):** npm run check at b710510 (systemd-run MemoryMax=12G, timeout 1800) · **saw:** tests 3011, pass 3008, fail 0, skipped 3; the eleven lone-CR cases, the TypeScript unit tests (uses, declarations, ERROR-region recovery, component view, lone CR beside a BOM, mixed endings) and the LF, CRLF, BOM and U+2028 test green; catalogue 1053 cases; dist/ is fresh

### Notes

Assumed: the line is the one an editor shows, counted by LF, CRLF and lone CR, in every language, Go, Ruby and Rust included, whose compilers count lines by LF alone: the issue's reason is a message a person reads and a waiver a person writes in an editor. Ruby's and Go's cases separate statements with semicolons, so they are valid in those languages, where a lone CR is a space.

Assumed: the helper reads a node's row and column, not its startIndex. On web-tree-sitter 0.27.2 both startIndex and column count UTF-16 code units (a probe with a BOM and two astral characters before an import gave startIndex 6 and column 6, as the JavaScript string counts), but a Kotlin declaration re-parsed alone (parseAt) is padded by row + column, so its startIndex is not the file offset while its row and column are the file's; a test pins that path and the lexical header path.

Assumed: a case file keeps LF line ends, so the case runner and the C# parity loader read a new fence attribute, eol=cr, that turns the fence's line ends into lone CRs; the schema comment says so. The C and C++ text scan of dead preprocessor groups keeps counting LF rows, as the tree does, so which includes it drops does not change. The C# offsets in declared records (base, members, usings) are positions, not lines, and equal between a lone-CR and an LF file. Rust's exported module and item helpers take the line reader as an optional last argument that defaults to the row plus one, which keeps their callers and tests as they are and keeps the overlap with issue 31 to those lines.

Corpus: npm run corpus -- --tier routine with RUNES_CORPUS_DIR on the shared cache, at b710510: 25 repositories, 33146 edges, 0 added and 0 removed on each, gate passed (go and dotnet oracles skipped here). The Rust case builds: cargo check under rust:1.99.1-slim on its files finished with one dead-code warning.

