# 093 · `yg context --file` and `yg impact --file` report a non-existent path as a file without graph coverage (exit 1) and say to add it to a mapping; from a subdirectory this also hits a covered file given relative to the current directory

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-sknt
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/build-context.ts, Yggdrasil/source/cli/src/cli/impact.ts, Yggdrasil/source/cli/src/cli/owner.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/build-context.ts:529-532 (resolveFileArg relative to the repo root), :642-662 (`fail({... 'has no graph coverage' ...}, 'no-coverage')` with `next: Add <file> to the mapping of the node that owns its code`, without checking whether the file exists); cli/impact.ts:207-208 and :296-303 (renderOwnerlessFile: 'no graph coverage / Add the file to an existing node mapping'); for comparison cli/owner.ts:413-416 (`access(absPath)`), :550 and :574-582 (kind: missing, '-> no graph coverage (file not found) ... Check the path for typos')
**Branch:** jarl/021-navigation
**Merged:** 8fa91f90df4e39f20017688f433ca620969f359f in ../../../Yggdrasil
**CI:** pending

## What
Reproduction (fresh clone of v6.1.0; after the tag, main has only docs and dependencies): node orders maps src/orders/; from the directory src/orders: `yg context --file handler.ts` and `yg context --file ./handler.ts` → `error[no-coverage]: handler.ts has no graph coverage ... next: Add handler.ts to the mapping of the node that owns its code`, exit 1, and `--json` has owner.reason "unmapped"; `yg impact --file handler.ts` → 'no graph coverage ... Add the file to an existing node mapping', exit 1. From the same directory, `src/orders/handler.ts` and the absolute path resolve to orders (exit 0), and `yg check` passes. From the repo root, the non-existent does-not-exist.ts gets the same text 'has no graph coverage / add it to a mapping', exit 1, so the cause is not the working directory but the fact that context and impact treat a missing file as unmapped. The rejected half of the report: resolving --file relative to the repo root is an intended, documented contract (`yg owner --help` and docs/cli-reference.md:1694 and :1719 'relative to repository root'; the rule cli-command-contract says to use resolveFileArg(repoRoot, …) and never process.cwd()), so switching to the current directory is a design change, not a fix. `yg owner --file handler.ts` from the same subdirectory answers correctly '(file not found) ... Check the path for typos' with kind: missing, and `yg type-suggest` says the file does not exist. Related risk: with an unmapped handler.ts at the repo root, `yg context --file handler.ts` from src/orders silently answers about the file at the root; this follows from the contract, but `yg context --help` and `yg impact --help` describe --file only as 'Source file path — resolves owner node automatically' (only `yg owner --help` says 'relative to repository root'). This is not 166, 048, 243, 447 or 500 of 6.1.0. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-63/verify-63-context-from-subdir.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-63/repro.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-63/verify-63-help.log; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/find-9-context-from-subdir.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/repro/context-from-subdir.sh.

## Why
The message diagnoses a missing file as missing coverage and sends the agent to the wrong graph edit (adding a path that does not exist to a mapping), while the neighbouring `yg owner` gets it right, so three commands treat the same path differently. No data loss and no effect on enforcement, so minor.

## Acceptance
context and impact check that the resolved file exists, as owner does, and for a missing one answer that there is no such file relative to the repository root <root> (with a hint of the path from the root when the file exists relative to the current directory, e.g. 'did you mean src/orders/handler.ts?'), without advice to add it to a mapping; `yg context --help` and `yg impact --help` say that --file is relative to the repo root (an e2e test from a subdirectory and with a non-existent path).

## Changelog
- Fixed: yg context --file and yg impact --file answer a path with nothing at it as a missing file relative to the repository root, suggesting the path from the root when it names a file from the current directory, instead of advising a mapping; their --help says --file is relative to the repository root.

## Evidence


- **ran (history):** release branch source + this branch's tests: npx vitest run tests/e2e/cli-file-arg-missing.test.ts tests/e2e/cli-impact.test.ts; live: yg context/impact --file handler.ts and nope.ts from src/orders, and yg context --help, yg impact --help · **saw:** red: 4 e2e failures plus the changed impact case; green on the branch. Live: handler.ts from src/orders answers 'no such file relative to the repository root — did you mean src/orders/handler.ts?' with next: yg context --file src/orders/handler.ts, nope.ts answers no such file with no mapping advice, exit 1; both --help texts say relative to the repository root, not the current directory
- **ran (history):** devcontainer: cd source/cli && npm test · **saw:** Test Files 707 passed (707); Tests 10392 passed | 1 skipped | 1 todo (10394); coverage lines 97.41%, statements 96.35%, functions 96.77%, branches 91.27%; repo-check: All checks passed (yg check: PASS, 8245 pairs verified), merge 8fa91f90d

