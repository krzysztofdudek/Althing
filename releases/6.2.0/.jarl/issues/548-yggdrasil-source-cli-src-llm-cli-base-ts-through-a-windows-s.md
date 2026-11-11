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

## Evidence

