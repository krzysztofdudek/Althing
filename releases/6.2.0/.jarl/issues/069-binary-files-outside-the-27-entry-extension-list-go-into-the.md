# 069 · Binary files outside the 27-entry extension list go into the reviewer prompt with every NUL expanded to '&#x00;': an 8 KB SQLite database or a 64 KB .jar blocks an advisory rule through prompt-too-large

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0754-bgnt
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/utils/binary-extensions.ts, Yggdrasil/source/cli/src/core/pairs.ts, Yggdrasil/source/cli/src/structure/hook-loader.ts, Yggdrasil/source/cli/src/io/file-content-cache.ts, Yggdrasil/source/cli/src/llm/xml-escape.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/utils/binary-extensions.ts:17 (BINARY_EXTENSIONS, 27 extensions compared through path.extname; the file content is not checked); the filter in core/pairs.ts:502-507 (nodes) and :694 (files covered by a type), structure/hook-loader.ts:82 and :596; llm/xml-escape.ts:9-10 turns every NUL into the 6-character '&#x00;'; existing NUL probes over the first 8 KiB: isBinaryBuffer io/file-content-cache.ts:101 (FileContentCache is already available in pairs.ts), isBinaryPackageContent io/package-store.ts:147, isBinaryContent core/suppressions/scan.ts:81
**Branch:** jarl/069-reviewer-subjects
**Merged:** 9f4ce909d72a1ebd6916d4a2c3bbd51c64a941db
**CI:** none

## What
Reproduction (npm yg 6.1.0, Node v24.11.1, a custom offline reviewer mock that records prompts, config from `yg init --provider openai-compatible`, so max_prompt_chars is the default 50000; one advisory reviewer rule on a node mapping src/app/, each scenario in a fresh repo): A. control, one .ts file: prompt 2189 bytes, 0 '&#x00;'. B. a 3 KB .class, a 299 B .pyc, a 2 KB Mach-O as .dylib and a 1 KB .DS_Store: all four enter the prompt as `<file>` blocks, 39 066 bytes, 6018 '&#x00;' (the .DS_Store block: `1| &#x00;&#x00;&#x00;&#x01;Bud1&#x00;…`), and `yg context --node app` counts them as subjects. C. one 8 KB SQLite database (the smallest sqlite3 file) next to a .ts file: `error[prompt-too-large] … 51088 chars, over the 'standard' tier limit of 50000`, exit 1, on an advisory rule. D. a .jar of 65 008 bytes: prompt-too-large at 114 463 characters, exit 1, also with `yg check --no-approve`; none of the four pieces of advice says the payload is a binary file. E and F: the same .jar bytes named .zip and the same SQLite bytes named .bin pass at 2189 bytes, so the result depends solely on the extension. What goes into the prompt includes .jar, .class, .so, .dll, .dylib, .exe, .pyc, .sqlite, .xlsx/.docx, .avif, .tif and .DS_Store (path.extname('.DS_Store') returns ''). Blocking an advisory rule through prompt-too-large is documented (docs/aspects.md:56, docs/aspect-status.md:46); the bug is a binary being in the prompt against the subject-set contract. A different cause than 004 (there .DS_Store through a global ignore; here tracked, non-ignored files). Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-38/logs/verify-38-binary-in-prompt-per-scenario-v2.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-38/logs/verify-38-binary-in-prompt.log (the run with `yg context`); scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-38/repro.sh and <the session scratchpad, since lost>/bughunt/yggdrasil/verify-38/repro2.sh; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/logs/03-binary-files-in-reviewer-prompt.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/repro/03-binary-files-in-reviewer-prompt.sh.

## Why
Mapping a directory is the normal case, and coverage.required makes these files mapped anyway; committed .jar, .DS_Store, SQLite fixtures and .pyc files are common. CI blocks on an advisory rule with a misleading error, and without the block, garbage bytes go to a paid reviewer. templates/knowledge/verification-and-lock.ts:55-56 says 'reviewer rules additionally drop binary files, which cannot enter a prompt', and the log of node cli/utils (.yggdrasil/model/cli/utils/log.md:36) promises that the set covers the extensions of compiled binaries, though .class, .jar, .so, .dll, .exe and .pyc are missing from it.

## Acceptance
- A file with a NUL byte in its first 8 KiB (the same probe as isBinaryBuffer) is not a subject of a reviewer rule whatever its extension: in scenarios B, C and D the prompt contains no '&#x00;' and no blocks of these files, and C and D end in PASS at the default max_prompt_chars (e2e test).
- prompt-too-large, when the largest contribution to the prompt is a binary file, names that file.

## Changelog
- Fixed: A binary file is never sent to the reviewer, whatever its name — a file whose first 8 KiB hold a NUL byte (.jar, .class, .pyc, .so, .dll, .exe, SQLite databases, .DS_Store) is left out of reviewer rules, so it no longer fills the prompt with escaped bytes or trips prompt-too-large; reviewer verdicts on components that map such files are filled again once.

## Evidence

- **ran (history):** git commit (merge of jarl/069-reviewer-subjects into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8113 pairs verified; [repo-check] All checks passed; [release/6.1.1 9f4ce909d] Merge jarl/069-reviewer-subjects

