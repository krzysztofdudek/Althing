# 041 · The convention layer does not see CommonJS `require()` in JavaScript: a .cjs file that requires a module is reported as not importing it, and CommonJS repositories (express, koa) get no import conventions at all

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-qhsr
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/scopes.mjs, Grain/plugins/grain/engine/facts.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/scopes.mjs:650 `if (b.imp.size === 0 || /ruby|lua|php/.test(String(b.name)))`: the loader-call scan runs only for grammars without import nodes or for Ruby, Lua and PHP; the javascript binding (parse.mjs:121) has a non-empty b.imp; facts.mjs:65 records an explicit 'false' for every vocabulary module that is not in s.imports
**Branch:** jarl/041-cjs-require-and-indent-unit
**Merged:** ba08bd8
**CI:** none

## What
Reproduction (Grain ae6152f = 6.1.0). A synthetic repo: 14 files cjs/*.js starting with `const fmt = require('left-pad'); const path = require('node:path');` and 14 ESM twins; `grain spectrum cjs/alpha.js` records `auto.imp:left-pad = false` and `auto.imp:node:path = false` (share 1.00, n 14), while the ESM twins have `= true`. commander.js @ba6d13d: each of the 4 files tests/*.cjs has `const assert = require('node:assert/strict')`, and Grain lists all 4 as deviants from 'files here import `node:assert/strict`' (fires=true); a new .cjs copied from tests/incrementNodeInspectorPort.test.cjs: `grain check` → '1 known deviation(s) in your change … Your file `newInspector.test.cjs` (line 1) does not import `node:assert/strict`.', although line 2 requires it. The enforced rule from propose (grain/tests/partition-imp-node-assert-strict) says '5 break it today', 4 of which are this bug, and the generated check.mjs does not flag these files, so yg check will show 1. koa @824c1cf and express @7ef98448 (entirely CommonJS, 0 ESM files, 81 and 130 files with a module-level require): 0 `auto.imp:` conventions out of 12 and 29; in koa all 30 files in __tests__/request require '../../test-helpers/context' and 'node:test', and `grain spectrum` on accept.test.js has 0 import rows, although the report's architecture line shows '__tests__/request/ → test-helpers/ (30)', because the relation layer (vendored runes extractors/typescript.mjs:271-274) handles require. Experiment: just adding `javascript` to the expression at scopes.mjs:650 gives `auto.imp:left-pad = true`, a require inside a function correctly stays out, and on commander the only remaining deviant is tests/testHelpers.js. TS files with a bare `require()` (not `import x = require`) probably need the same. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-6/logs/v6a-commander.log, v6e-synthetic-facts.log, v6c-koa-express.log, v6b-propose-commander.log, v6f-patched-gate.log.

## Why
check, the command meant for the agent, says to add an import that is already there; whole CommonJS repositories have no import conventions; propose can enforce a rule with a count inflated by false deviants. The README does not say that CommonJS is unsupported, and the comment at scopes.mjs:648 describes the scan as meant for 'grammars whose module system is a function call', which covers CommonJS.

## Acceptance
- A module-level `require('x')` in .js and .cjs files counts in the convention layer as an import of x, and a require inside a function does not.
- commander.js @ba6d13d: the only deviant from 'files here import `node:assert/strict`' is tests/testHelpers.js, and `grain check` on a copy of tests/incrementNodeInspectorPort.test.cjs reports no import deviation; a synthetic CJS and ESM test in tests/.

## Changelog
- Fixed: in JavaScript and TypeScript, a require() at module level now counts as an import, so a CommonJS file is no longer told to add an import it already has, and CommonJS repositories get import conventions.

## Evidence

- **ran (history):** node --test tests/commonjs-require-imports.test.mjs on 5c4c799 (scopes.mjs unfixed) · **saw:** pass 1 fail 7: imports [] for module-level require in .cjs/.js; spectrum shows no auto.imp rows on CJS files; check on a new .cjs not governed by 'files here import left-pad' (log <the session scratchpad, since lost>/patch-611/grain-041/041-red.log)
- **ran (history):** node --test tests/commonjs-require-imports.test.mjs on a94a0a2 · **saw:** pass 8 fail 0
- **ran (history):** grain report/export/check on commander.js @ba6d13d, base 5c4c799 (<the session scratchpad, since lost>/patch-611/grain-041/commander-run.sh) · **saw:** files here import node:assert/strict — 96% of 110, 5 deviants (4 tests/*.cjs + tests/testHelpers.js); check on copy of incrementNodeInspectorPort.test.cjs: 'does not import node:assert/strict' (<the session scratchpad, since lost>/patch-611/grain-041/commander-base.log)
- **ran (history):** same on commander.js @ba6d13d with 78f35b8 · **saw:** 99% of 110, 1 deviant: tests/testHelpers.js only; check on the copy: 0 known deviation(s), conforms to 'files here import node:assert/strict' (<the session scratchpad, since lost>/patch-611/grain-041/commander-fixed.log)

docs: none. Needs: EXTR_V (per-file imports are cached in the tree and history blob caches; the final pass bumps it once, D5).
- **ran (history):** round 2: node --test tests/commonjs-require-imports.test.mjs (module-level try/catch case) on 6671573 · **saw:** fail: imports lack 'optional-fallback' (the require in catch (e) {…})
- **ran (history):** same on c90caa6 · **saw:** pass 8 fail 0; changelog reworded to 'at module level'
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2027, pass 2026, fail 0, skipped 1, merge ba08bd8

