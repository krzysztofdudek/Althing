# 234 · Runes: a diagnostics channel for an unreadable tsconfig.json/package.json, shown by Yggdrasil (the second half of 074, D9)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-kerh
**Tags:** runes, yggdrasil, partial
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Source:** decisions#patch-scope
**Where:**
**Branch:** jarl/550-typescript
**Merged:** b40a0253114f36a68e53143cf09ab98c446e2802 in ../../../Runes
**CI:** pending
**Worker:** w-550-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:37

## What
In 1.0.1 (074) the resolver strips the BOM; reporting configuration files that cannot be parsed deferred to 1.1.0 (it needs a new option).

## Why
A broken tsconfig silently switches off all the aliases under it — fewer edges without any trace.

## Acceptance
makeResolvePathToFile accepts an optional diagnostics callback (documented in docs/api.md as a minor addition); an unreadable tsconfig/package.json is reported with the file and position; Yggdrasil shows it as a non-blocking warning with the file name; Grain disclosure in relStages; tests.

## Changelog
- Added: ResolvePathOptions.onDiagnostic reports a tsconfig.json, jsconfig.json, package.json, composer.json or compile_commands.json that does not parse, or a pnpm-workspace.yaml whose packages list cannot be read, once per file (code config-unreadable) with its line and column as written when the parser names them or when the offending token is unambiguous (a single-quoted string, an unquoted value, `undefined`, a whitespace character JSON does not allow); where the parser names none and the token cannot be told, as in `{"a": }` or `[1,,2]`, the file is reported without line and column, never with a guessed one; resolution is unchanged. A composer.json or compile_commands.json that starts with a byte order mark is now read, so PHP imports through its autoload maps and C includes through its include roots resolve where they silently did not: a consumer's graph can show new edges for repositories that hold such a file (Before you upgrade).

## Evidence


- **ran (history):** node --test test/relations/diagnostics.test.mjs on the release branch's tree (view stubbed) · **saw:** fail 10 of 11 config-unreadable cases (the callback is ignored there); on the branch tip pass 15, fail 0: one report for a tsconfig consulted by 50 imports, line 6 as written through a comment and a trailing comma; none for a valid file or a BOM file; a broken workspace-member package.json reports when a bare import reaches it.

docs: README.md: the behaviour paragraph on resolution reading the disk: say the files can come from a caller's view (FileView, listedFileView) and that unreadable configuration is reported through onDiagnostic

round 2 (commit 0b15083): BOM composer.json and compile_commands.json now read and silent (red before: the BOM tests failed, composer unresolved; green after: diagnostics tests 17 pass); failureOffset falls back to offset 0 except 'end of JSON input' (red: expected 5 to be 0; green); strictJsonFailure skips one BOM and places failures in the file as written. README paragraph and docs/api.md updated in 9a6fe51; the Y5 and G9 halves import RelationDiagnostic and ResolvePathOptions after RF. npm run check exit 0 (1769 tests), coverage exit 0 (98.99 / 94.75 / 99.05). Note: current V8 often names no position for a bad token (it quotes a snippet), so those failures now read line 1 column 1 instead of the end of the file

round 3 (commit 43124eb), Model: sonnet-5.5. ran: node --test test/relations/diagnostics.test.mjs before the fix with the new cases (a tsconfig with ['./src/*'] on line 4, a package.json with an unquoted main on line 2, an unquoted workspace-member value restored, the BOM column, failureOffset locating a token, a position-less report) · saw: pass 13, fail 6 (line 1 column 1 reported for both real cases; BOM column 8 instead of 7); after: pass 19, fail 0, with the tsconfig at line 4 column 24, the package.json at line 2 column 11, the BOM failure at column 7. Design: the parser names no position for an unexpected token at a value, so the reader scans for the first token that cannot be JSON and reports that place; where nothing is found the diagnostic has no line and column and a message that names none. docs/api.md lists config-unreadable among the stable codes and describes the position as it now is. Perf: 5000 parses of an 8.2 KB package.json through parseJsonc took 777, 757, 736 ms before and 551, 588, 592 ms after (the offset map is built only after a parse has failed). The invisible U+FEFF in the pnpm regex is now an escape. npm run check exit 0 (1771 pass, dist fresh); npm run coverage exit 0 (1771 pass; lines 98.98, branches 94.74, functions 99.05).
- **ran (history):** node --test test/relations/diagnostics-position.test.mjs test/relations/diagnostics.test.mjs against the old dist with the new cases (round 4, commit dd94b5a, Model: sonnet-5.5) · **saw:** pass 21, fail 11 (a missing value and a later 'x' named at the later token; no-break space, U+3000, U+2028 and an inner U+FEFF skipped as whitespace; {"a": 'position 5'} placed at 6; CR and CRLF not counted; the seeded mutation test failing); after the fix pass 32, fail 0. Design: a scanner offset is kept only when the character there is the one V8 quotes in its Unexpected token message, otherwise no line and column; scanner whitespace is space, tab, LF, CR; the message is read anchored; lineColumnAt counts CR and CRLF; parseJsoncAt takes describe=false when no callback is given (the sink comment is now true); the literal U+FEFF in the diagnostics test is an escape; docs/api.md says a position is given when the parser names one or the token is unambiguous, otherwise none, never a guessed one. The fuzz test (3000 seeded mutations) asserts a reported position equals V8's named position or the character V8 quotes. npm run check exit 0 (1784 pass, dist fresh); npm run coverage exit 0 (1784 pass; lines 98.99, branches 94.77, functions 99.05).
- **ran (history):** npm run check · **saw:** tests 1784, pass 1784, fail 0; dist/ is fresh, merge b40a025

2026-10-28 tidy-up: the worktree directory is gone; the Runes part of this issue is merged into release/1.1.0 (its branch has no commit beyond it); what remains is the part in Yggdrasil and Grain named in the acceptance; the lease ends and the issue returns to the queue

Checked on release/1.1.0 at a94d31b, nothing redone: the Runes half is already there (commits 6cf84e9, 0b15083, 43124eb, dd94b5a are ancestors of the release branch). ResolvePathOptions.onDiagnostic and RelationDiagnostic are in docs/api.md with the config-unreadable code, and node --test test/relations/diagnostics.test.mjs test/relations/diagnostics-position.test.mjs test/relations/file-view.test.mjs printed tests 56, pass 56, fail 0. What the line still needs is outside Runes: the Yggdrasil warning (package Y5) and the Grain disclosure in relStages (package G9).

Checked again on release/1.1.0 at e9509e1, nothing redone: commits 6cf84e9, 0b15083, 43124eb and dd94b5a are ancestors of the release branch, docs/api.md lists RelationDiagnostic and describes ResolvePathOptions.onDiagnostic (Unreadable configuration), and node --test test/relations/diagnostics.test.mjs test/relations/diagnostics-position.test.mjs test/relations/file-view.test.mjs printed tests 56, pass 56, fail 0 at 904913f. The Runes half is met; the line's Yggdrasil warning (Y5) and Grain disclosure (G9) are outside Runes and remain.

