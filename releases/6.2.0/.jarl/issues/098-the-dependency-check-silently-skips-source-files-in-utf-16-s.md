# 098 · The dependency check silently skips source files in UTF-16, so a forbidden import passes without any warning

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/relations/pass.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/relations/pass.ts:357 (files mapped by nodes) and :383 (files covered by a type) read every file through readFile(..., 'utf-8') without checking for a BOM; parseSingle (:428-473) fails closed only when parseFile throws, while tree-sitter tolerates errors and from text with U+FFFD and NUL between the characters builds an ERROR tree without an exception, so the file gives zero edges without relation-parse-failed and without file-unreadable
**Branch:** jarl/065-relations
**Merged:** 265c4c6bad023e410ee20c6a60dec39de17e7a91
**CI:** none

## What
Reproduction (fresh clone at tag v6.1.0 and npm @chrisdudek/yg@6.1.0 in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-70/tool, Node v24.11.1, own scripts in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-70/repro, no reviewer and no paid calls): (1) utf16-ts.sh: three components import '../data/repo' with the same line and declare no relation, in UTF-8, UTF-8 with BOM and UTF-16 LE with BOM ('Unicode' in Visual Studio), plus a UTF-16 BE file; `yg check` reports relation-undeclared-dependency only for src/utf8/handler.ts:1 → data and src/bom/handler.ts:1 → data, while src/utf16/handler.ts (file(1): 'UTF-16, little-endian text') and src/utf16be/handler.ts stay silent, with no finding and no note. Control: `tsc --noEmit --listFiles` accepts the UTF-16 file (exit 0) and resolves its import to src/data/repo.ts. (2) utf16-green.sh: when the only undeclared import is in a UTF-16 LE file, `yg check` gives PASS, exit 0 (only an advisory 'uncovered' about files outside src); the same text saved in UTF-8 gives FAIL with relation-undeclared-dependency src/web/handler.ts:1 → data, exit 1. (3) utf16-cs.sh, C# (the more realistic case: 'Unicode - Codepage 1200' in Visual Studio is UTF-16 LE with BOM): `using Data;` with a use of Repo is reported for a UTF-8 file with BOM (src/cs8/Handler.cs:7 → data), and for UTF-16 LE src/cs16/Handler.cs nothing. The UTF-8 BOM works only because the decoded U+FEFF is harmless. Lines unchanged on origin/main 2493aa16. This is not 500 of 6.1.0 (a UTF-8 BOM on the stdin of `yg owner --files`). Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-70/logs/utf16-ts.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-70/logs/utf16-green.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-70/logs/utf16-cs.log; issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/logs/08-utf16-dependency-missed.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/repro/08-utf16-dependency-missed.sh.

## Why
docs/relations-flows-ports.md:74: the relation check 'never passes over code it could not read … Rather than go green over unanalyzed code, the check fails closed'; here there is neither an edge nor a diagnosis, and the free deterministic gate is green on an undeclared dependency. tsc and the C# compiler accept UTF-16 with BOM, and no documentation requires a source encoding. The trigger is rare (mostly older C# and C++ code from Windows), so minor.

## Acceptance
A file with the BOM FF FE or FE FF is decoded through TextDecoder('utf-16le' or 'utf-16be') before parsing, and a file whose decoded content contains NUL or whose tree is nothing but errors is reported (relation-parse-failed or file-unreadable) instead of giving zero edges: scenarios (1), (2) and (3) give the edge → data for UTF-16 LE and BE files (an e2e test).

## Changelog
- Fixed: the relation check reads source saved as UTF-16 with a byte-order mark; a file marked UTF-16 that still holds NUL characters, or one in which nothing parses, fails with relation-parse-failed; binary content behind a source extension (a .ts video segment) is skipped as before and named in a non-blocking relation-file-binary warning.

## Evidence

rev-ygg-065: after an upgrade to 6.1.1 with the Runes pin unchanged, the cached 6.1.0 result for a file nothing parses still passes (stale green). The cache key changes only with the Runes 1.0.1 pickup (package runes-101-pickup) — Yggdrasil's 6.1.1 cannot ship without that pickup, or the final pass must bump the relation cache key.

Ruling 098-binary-does-not-block: 098: we treat a file without a UTF-16 BOM marker that has a NUL byte in its first 8000 bytes as binary — skipped as in 6.1.0, with a non-blocking relation-file-binary warning (pointing to coverage.excluded / .gitignore). This narrows the literal wording of the acceptance for UTF-16 without BOM (today only a warning, not relation-parse-failed): without a BOM, UTF-16 cannot be told apart from a binary file (e.g. a .ts video segment), and a patch must not turn a repository red over something that is not a defect. relation-parse-failed stays blocking for UTF-16 text with BOM that still holds NUL, and for a file whose tree is nothing but ERROR.
- **ran:** git commit (merge of jarl/065-relations into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8076 pairs verified; [repo-check] All checks passed; [release/6.1.1 265c4c6ba] Merge jarl/065-relations

