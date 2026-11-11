# 548 · Yggdrasil source/cli/src/llm/cli-base.ts: through a Windows shell, an argument with no whitespace b…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1024-fwjn
**Tags:** 
**Files:** Yggdrasil/source/cli/src/llm/cli-base.ts
**Repo:** Yggdrasil
**Found by:** rev-534-opus
**Where:** the review of 534, 535
**Branch:** jarl/534-windows-spawn-and-lock
**Merged:** 111b2de55a2433aa2300ec965afbf3ac76dad56a in Yggdrasil
**Merge check:** cd source/cli && npm test · saw scripts/repo-check.sh on the merged tree: All checks passed (yg check PASS, 8249 pairs verified)

## What
Yggdrasil source/cli/src/llm/cli-base.ts: through a Windows shell, an argument with no whitespace but a cmd.exe metacharacter (& ^ | < > %), such as a gemini or codex policy path under a profile named R&D, is left unquoted and cmd splits or rewrites the line; and the binary itself is never quoted, so copilot-cli, which resolves a full .cmd path such as the npm folder under a profile with a space, is started through cmd.exe as a broken command. Read from the code, not run on Windows.

## Why


## Acceptance


[test] Through a Windows shell, an argument holding & | < > ^ or % without whitespace, and a program path holding a space, reach the child unchanged, by tests that exercise the quoting function directly · by: cd source/cli && npm test

## Changelog
- The claude-code reviewer starts on Windows again (see 534): the quoting also covers & | < > ^ % and a reviewer program path with a space.

## Reviews
- **approve** · by rev-534b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1101-tfvt
  Round-1 findings answered. 535: only the rename is retried and only a rename that keeps failing throws LockedFileError, in both writes (atomic-write.ts:298-309 and :338-349); a temp-file failure is thrown raw and at once, confirmed by a probe on a 0555 directory (EACCES, syscall open, 1 ms async, 0 ms sync, no LockedFileError, no temp left), and the message no longer asserts another program. 534/548: read against cmd.exe's rules, every quotation mark is caret-escaped, so cmd.exe never counts itself inside quotes, and every syntax character and space carries a caret that cmd.exe removes; the text left is the MSVCRT quoting of round 1. For every argument yg passes (two empty values, the mcp-config JSON, temp paths, a resolved copilot path) this holds, and it also survives a .cmd shim's second reading, because after the first reading those arguments sit inside balanced real quotes. Read line 534/2 met: CHANGELOG 'The claude-code reviewer starts on Windows again ... An argument that is empty, holds whitespace, a quotation mark or one of & | < > ^ %, and the path of the reviewer program when it holds a space, is now quoted'. Tried to get past it: %PATH:a=b%, a newline, a lone %, ^, a trailing backslash, a quotation mark after backslashes. Minor (548) source/cli/src/llm/cli-base.ts:219-222: 'the program then receives exactly the quoted text' overclaims in two cases no reviewer argument reaches today: cmd.exe expands percent signs before it removes carets, so %PATH:a=b% (written ^%PATH:a=b^%) is still expanded as PATH with a replaced by b^; and a newline becomes caret plus newline, which cmd.exe drops. Minor (548) source/cli/tests/unit/llm/cli-base-process.test.ts:112-158: the model of cmd.exe has no percent-expansion step and removes any caret, so its '%PATH%' and '100%' rows pass by construction; they hold by the rules only because the caret makes the variable name unknown. Minor (548) source/cli/src/llm/cli-base.ts:417: the program path is quoted and then careted, where the known practice carets an unquoted path; the token cmd.exe is left with equals an ordinarily quoted path, so it should resolve, but that is reasoned, not run. Minor (548) cli-base.ts:222-224: through a .cmd shim an argument holding both a quotation mark and one of & | < > outside the program's quote count (such as {"command":"R&D|x"}) still breaks on the second reading; the comment says so, no test shows it, and no current argument has that shape. Minor (535) source/cli/src/io/atomic-write.ts:260: 'every verdict written before is kept' is said for every file this write serves, not only the lock. Unproved: nothing ran on Windows; cmd.exe, the shim's second reading and a live approve there remain a reading.

## Evidence

### Proof

- **ran (line 2ce337be6aed):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/llm/cli-base-process.test.ts · **saw:** 17 passed; with the previous cli-base.ts the 6 new tests (win32 quoting of & | < > ^ %, a program path with a space, a round trip through a model of cmd.exe and the runtime's argument split, other platforms, a spawned program path with a space) failed, so red before and green after
- **ran (line 2ce337be6aed):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/llm/cli-base-process.test.ts tests/unit/io/atomic-write-retry.test.ts tests/unit/io/atomic-write-sync-retry.test.ts tests/unit/formatters/cli-preamble.test.ts (tip 96ee004e7, in the dev container); then the first three in a git archive of the tip with dcc170cf5's cli-base.ts and atomic-write.ts put back · **saw:** tip: 17 of 17 in cli-base-process passed. Round-1 cli-base.ts: the five 'quoting for the Windows shell' tests and the program path with a space failed. The tests reach the quoting function directly and read its output through a model of cmd.exe written in the test, which leaves out the percent expansion cmd.exe does before it removes carets; cmd.exe was not run.

### Notes

Assumed: on Windows every argument holding whitespace, a quotation mark or cmd syntax (& | < > ^ % ( ) ! etc.) is quoted as before and then every cmd syntax character in the quoted text, the quotation marks included, is escaped with a caret, which cmd.exe strips: the program receives the text the earlier quoting produced. The program path goes through the same function. A .cmd shim reads its line a second time in a batch file and that is not guarded; the function's comment says so. The function stays unexported (the dead-exports gate refuses an export only tests read) and is reached by tests through a static method of the provider class. Read from the code and model-tested, not run on Windows.

