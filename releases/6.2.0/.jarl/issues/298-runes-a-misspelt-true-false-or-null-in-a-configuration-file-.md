# 298 · Runes: a misspelt true, false or null in a configuration file is placed one to four columns early, and a lone CR does not end a comment line

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, diagnostics
**Files:** Runes/src/relations/diagnostics.mts, Runes/src/relations/extractors/typescript-resolve.mts, Runes/test/relations/diagnostics-position.test.mjs
**Repo:** ../../../Runes
**Found by:** rev-runes-234-opus3
**Where:** src/relations/diagnostics.mts:57-69; src/relations/extractors/typescript-resolve.mts:449, :575, :595; test/relations/diagnostics-position.test.mjs:43-46, :81, :109
**After:** 234
**Branch:** jarl/236-ts-extends-and-config-columns
**Merged:** d3580d4ebc1e4507e3239a4c53215d22df8c0e73 in ../../../Runes
**CI:** green

## What


Three small findings from the third review of 234. (1) A misspelt true, false or null can be placed one to four columns early: the scanner flags the word at its first letter, but V8 stops at the first letter that differs from the real word; when that letter equals the first one (ttrue, ffalse, nnull, faflse, nulnull) the characters match by coincidence and the report points at the start of the word (a tsconfig with "strict": ttrue on line 4 reports column 15, V8 stopped at 16). The same rule leaves an unquoted value starting with t, f or n (foo, next-app) with no position, although docs/api.md says an unquoted value gets one. One fix covers both: before comparing, walk a word that starts with t, f or n to the first letter that differs from the real word. The comment at diagnostics.mts:68 and the header of diagnostics-position.test.mjs claim more than the seeded test can show (it compares only the character). (2) The test file diagnostics-position.test.mjs contains literal invisible characters (no-break space, U+3000, U+2028, U+FEFF) at the lines named: write them as escapes. (3) A lone CR ends no line in the JSON-with-comments stripper (a // comment runs to LF only, typescript-resolve.mts:449) nor in the pnpm-workspace.yaml reader (split on LF or CRLF only, :575, :595): a CR-only tsconfig with a line comment does not parse and is reported at the end of the file; older than 234, an honest report, but wrong for the file.

## Why


A position that points inside the offending word is what the docs promise, and it is right in all but a few misspellings; the comments and the test header promise more than they hold, and the invisible characters in a test file are a trap for the next editor.

## Acceptance


- A misspelt true, false or null and an unquoted value starting with t, f or n are placed at the first letter V8 stops at, with a case for each of the five spellings above and for foo and next-app.
- The seeded mutation test compares the column, not only the character.
- diagnostics-position.test.mjs holds no literal invisible character.
- A CR-only file with a line comment parses like its LF twin, in the stripper and in the pnpm-workspace reader, with a test each.

## Changelog
- Fixed: a misspelt `true`, `false` or `null` (`ttrue`, `faflse`) and an unquoted value such as `foo` in a configuration file are reported at the letter the parser stops at, and a CR-only `tsconfig.json` with a `//` comment or `pnpm-workspace.yaml` is read like its LF twin; a graph can show fewer refusals for such files.

## Evidence

- **ran:** node --test test/relations/diagnostics-position.test.mjs test/relations/extractors/typescript-resolve.test.mjs (src held at the previous commit) · **saw:** fail 14: the ten word spellings, the five-misspellings test, the seeded mutation test (exact column), the pnpm CR test and the parseJsonc CR assertion
- **ran:** same files, then diagnostics.test.mjs, with the fix; npm run check and npm run coverage · **saw:** 0 failures; check green (1918 pass), coverage over thresholds
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** tests 1918, pass 1918, fail 0; dist/ is fresh (merge d3580d4ebc1e4507e3239a4c53215d22df8c0e73 on release/1.1.0)

