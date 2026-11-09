# 078 · A single-file mapping written as './src/a.ts' (or 'src/../src/a.ts', 'src/./a.ts') gives a false type-when-mismatch that blocks the gate

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-risq
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/checks/architecture.ts, Yggdrasil/source/cli/src/io/hash.ts, Yggdrasil/source/cli/src/utils/mapping-path.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/checks/architecture.ts:256-257 (checkTypeWhenMismatch passes the raw entry to expandMappingPaths(projectRoot, [entry]) and builds normalizedEntry through toPosixPath(entry), which only swaps separators and trims a trailing slash, instead of normalizeMappingPath as pairs.ts, context-builder.ts, check-coverage-scan.ts, owner-index.ts, repo-scanner.ts:585 and mapping.ts:355/522 do); io/hash.ts:246 for an existing exact file does `pushContained(toPosixPath(mp))` with the raw spelling, so evaluateFileWhen gets repoRelPath './src/a.ts', and globMatch('./src/a.ts', 'src/**') is false
**Branch:** jarl/004-walk-mapping
**Merged:** a98332363a016bd8ef94627a5ad5aa3855231cfc
**CI:** none

## What
Reproduction (a fresh clone v6.1.0 e5441101, npm ci and npm run build, `yg --version` 6.1.0; each spelling in a new git repo with one type module (when.path "src/**") and a node app mapping one file; only `yg check --no-approve`): 'src/a.ts' → PASS. './src/a.ts', 'src/../src/a.ts' and 'src/./a.ts' → FAIL, exit 1: `error[type-when-mismatch] File './src/a.ts' ... does not satisfy 'module'.when: ✗ path does not match "src/**"`, with a fix to move or refactor the file or widen the type, and next: is a prose sentence. In the same repo `yg owner --file src/a.ts` returns app, coverage is 1/1, and `yg context --node app` refuses to assemble the context because of the false error. Directory entries and globs ('./src', 'src/./', './src/*.ts', 'src/../src/*.ts') pass (a directory goes through path.join, globs through the walk). The parser accepts these spellings, docs/nodes.md:47 says 'a directory or a file, relative to the repo root', the docstring of utils/mapping-path.ts:9-19 says that './src/a.ts' and 'src/a.ts' are one equivalence class, the test tests/unit/bounty/path-validation.test.ts:238 relies on that, and the check's comment (architecture.ts ~244-250) promises a classification byte-for-byte consistent with ownership. The second half of the report (a mapping 'SRC/a.ts' on macOS gets a false file-mapping-gitignored) is in a separate issue about the false file-mapping-gitignored diagnosis. Related: 019 (root mappings '/', './', '//', '.'), a different trigger. Code unchanged on origin/main 2493aa16. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-47/logs/verify-47-mapping-spelling.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-47/logs/verify-47-variants.log (scripts repro.sh and repro-variants.sh in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-47); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/logs/F7-mapping-spelling-false-errors.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/F7-mapping-spelling-false-errors/repro.sh.

## Why
A false type-when-mismatch blocks the gate (exit 1), and its advice sends the agent the wrong way: move or refactor the file, or widen the type's `when`. The workaround is simple (the canonical spelling), so minor, but './' is a natural spelling and it reproduces on every system.

## Acceptance
checkTypeWhenMismatch normalizes the entry through normalizeMappingPath (like the other consumers), and the exact-file path from hash.ts is normalized: './src/a.ts', 'src/../src/a.ts' and 'src/./a.ts' give `yg check --no-approve` PASS with `when: path: "src/**"` (e2e test).

## Changelog
- Fixed: an exact file mapped as ./src/a.ts, src/../src/a.ts or src/./a.ts is the file src/a.ts to its type's when:, so no false type-when-mismatch blocks yg check.

## Evidence

orchestrator: the second half of 078's acceptance (architecture.ts checks the raw mapping entry when it resolves to nothing) moves to package 6, which owns that file; package 6 must finish it before the final pass
- **ran (history):** git commit (merge of jarl/004-walk-mapping into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8070 pairs verified; [repo-check] All checks passed; [release/6.1.1 a98332363] Merge jarl/004-walk-mapping

