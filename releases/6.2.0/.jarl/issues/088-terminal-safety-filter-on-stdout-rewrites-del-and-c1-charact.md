# 088 · Terminal safety filter on stdout rewrites DEL and C1 characters inside --json documents, so values and file paths in machine contracts are altered

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-qrdc
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/output.ts, Yggdrasil/source/cli/src/utils/terminal-safe.ts, Yggdrasil/source/cli/src/cli/tree.ts, Yggdrasil/source/cli/src/cli/find.ts, Yggdrasil/source/cli/src/cli/log.ts, Yggdrasil/source/cli/src/cli/owner.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/output.ts:46-51 (guardTerminalOutput: neutralizeStream(process.stdout) at module load wraps every write to stdout, JSON documents included) and :95-99 (writeJsonDocument, including yg-error/1); utils/terminal-safe.ts:55-81 neutralizeControls rewrites U+007F–U+009F to '^?' and '<U+XXXX>' (:78, visible() :27-32); the comment :22-23 'JSON output needs neither: JSON.stringify already escapes every control character' is false for U+007F–U+009F; direct JSON writes through writeOut: cli/tree.ts:109, cli/find.ts:105, cli/log.ts:187 and :331, cli/owner.ts:360 and :395, and the check's JSON writer
**Branch:** jarl/021-navigation
**Merged:** 8fa91f90df4e39f20017688f433ca620969f359f in ../../../Yggdrasil
**CI:** pending

## What
Reproduction (npm @chrisdudek/yg 6.1.0, Node v24.11.1, fresh clone 2493aa16 for the code, a copy of examples/checkout-flow, custom inputs): the description of node cart is "A\x7fB\x85C\x9bD" in YAML (DEL, NEL, 8-bit CSI), and an unmapped file with a DEL byte in its name sits in src/. (1) JSON.stringify on this value writes the raw bytes 7f, c285 and c29b, unescaped. (2) `yg tree --json` redirected to a file (not a TTY): description in yg-tree/1 = "A^?B<U+0085>C<U+009B>D", 22 characters instead of 7. (3) The same through a pipe, so the filter runs unconditionally, not only on a TTY. (4) `yg check --json --no-approve`: every path of this file in yg-check/1 is "src/odd^?name.ts" (literally a caret and a question mark), fs.existsSync on it gives false, while the real path with DEL exists. (5) Cause isolated: a --require preload sets Symbol.for('yg.terminal-safe.guarded') on process.stdout, so neutralizeStream skips it, and then `yg tree --json` returns hex 417f42c28543c29b44, equal to the value in the YAML. The finder's mojibake scenario (U+00E2 U+0080 U+0099, a UTF-8 right quote read as Latin-1) takes the same path. CHANGELOG 6.1.0:125 speaks of caret notation when displaying in a terminal; docs/family-contracts.md does not mention that values in contracts are rewritten; tests/unit/utils/terminal-safe.test.ts has no JSON case. The filter was introduced by 203 of 6.1.0. A fix covering only writeJsonDocument will not catch the direct writeOut writes. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-58/repro.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-58/repro.sh), cause <the session scratchpad, since lost>/bughunt/yggdrasil/verify-58/cause.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-58/cause.sh, preload <the session scratchpad, since lost>/bughunt/yggdrasil/verify-58/skip-guard.cjs); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-4-json-control-chars.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-4-json-control-chars.sh.

## Why
JSON documents are versioned machine contracts read by the family's tools (Horde); a path in yg-check/1 that does not exist on disk and a description different from the one in the YAML are silent data corruption, contrary to the intent declared in the code. The triggers are rare (DEL or C1 in names and descriptions, mostly mojibake), and the JSON stays parseable, so minor.

## Acceptance
The JSON serializer escapes U+007F–U+009F (optionally also U+2028 and U+2029) as \u sequences before the stream filter sees them, and the filter stays for plain text: in the repro, `yg tree --json` after JSON.parse gives a description equal to the value in the YAML, and the path from `yg check --json` after JSON.parse exists on disk; the same for the direct writeOut writes (tree, find, log, owner, check); a unit test with DEL and C1.

## Changelog
- Fixed: every --json document keeps DEL and C1 control characters (and U+2028/U+2029) as written, escaped as \u sequences, instead of the caret notation the terminal guard gives text, so descriptions and file paths parse back to the repository's exact values.

## Evidence


- **ran (history):** release branch source + this branch's tests: npx vitest run tests/e2e/cli-json-control-chars.test.ts tests/unit/utils/terminal-safe.test.ts; live: yg tree --json, find --json, owner --json, check --json on a copy of examples/checkout-flow with description A<DEL>B<U+0085>C<U+009B>D and a file name holding DEL · **saw:** red: 4 e2e and 3 unit failures; green on the branch. Live: parsed tree/find description is 7 characters equal to the YAML value, no caret notation in any document, and the check --json path with DEL exists on disk
- **ran (history):** devcontainer: cd source/cli && npm test · **saw:** Test Files 707 passed (707); Tests 10392 passed | 1 skipped | 1 todo (10394); coverage lines 97.41%, statements 96.35%, functions 96.77%, branches 91.27%; repo-check: All checks passed (yg check: PASS, 8245 pairs verified), merge 8fa91f90d

