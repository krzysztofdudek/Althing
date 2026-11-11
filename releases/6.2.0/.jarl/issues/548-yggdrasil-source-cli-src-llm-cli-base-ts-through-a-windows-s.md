# 548 · Yggdrasil source/cli/src/llm/cli-base.ts: through a Windows shell, an argument with no whitespace b…

**Status:** in-progress
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
**Worker:** w-534b-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:25

## What
Yggdrasil source/cli/src/llm/cli-base.ts: through a Windows shell, an argument with no whitespace but a cmd.exe metacharacter (& ^ | < > %), such as a gemini or codex policy path under a profile named R&D, is left unquoted and cmd splits or rewrites the line; and the binary itself is never quoted, so copilot-cli, which resolves a full .cmd path such as the npm folder under a profile with a space, is started through cmd.exe as a broken command. Read from the code, not run on Windows.

## Why


## Acceptance


[test] Through a Windows shell, an argument holding & | < > ^ or % without whitespace, and a program path holding a space, reach the child unchanged, by tests that exercise the quoting function directly · by: cd source/cli && npm test

## Changelog
- The claude-code reviewer starts on Windows again (see 534): the quoting also covers & | < > ^ % and a reviewer program path with a space.

## Evidence

### Proof

- **ran (line 2ce337be6aed):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/llm/cli-base-process.test.ts · **saw:** 17 passed; with the previous cli-base.ts the 6 new tests (win32 quoting of & | < > ^ %, a program path with a space, a round trip through a model of cmd.exe and the runtime's argument split, other platforms, a spawned program path with a space) failed, so red before and green after

### Notes

Assumed: on Windows every argument holding whitespace, a quotation mark or cmd syntax (& | < > ^ % ( ) ! etc.) is quoted as before and then every cmd syntax character in the quoted text, the quotation marks included, is escaped with a caret, which cmd.exe strips: the program receives the text the earlier quoting produced. The program path goes through the same function. A .cmd shim reads its line a second time in a batch file and that is not guarded; the function's comment says so. The function stays unexported (the dead-exports gate refuses an export only tests read) and is reached by tests through a static method of the provider class. Read from the code and model-tested, not run on Windows.

