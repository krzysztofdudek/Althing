# 180 · Grain: a module-level arrow function parameter in TypeScript is recorded as an import (bindingFor catches required_parameter); require in a block/closure in Ruby, Lua and PHP counts as a file import

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T1236-ifry
**Tags:** grain, imports
**Files:** Grain/plugins/grain/engine/scopes.mjs
**Repo:** ../../../Grain
**After:** 041
**Found by:** grain-041
**Where:**
**Branch:** jarl/180-scopes-and-history
**Merged:** 77473cb
**CI:** none

## What
After 041: in TypeScript, 'const g = (gamma: number) => gamma' at module level gives an import 'gamma' — the import-node match in bindingFor also catches required_parameter. In Ruby, Lua and PHP, require inside a block or closure still counts as an import of the whole file.

## Why
False imports distort the import conventions and the deviations in check.

## Acceptance
Parameters are not imports; require outside module level is not a file import in Ruby, Lua and PHP (as in JS after 041); tests.

## Changelog
- Fixed: a parameter of a TypeScript arrow function is no longer read as an import, and in Ruby, Lua and PHP a require inside a block, closure or function no longer counts as an import of the whole file.

## Evidence

commit 48ddbb2: tests/module-level-imports-only.test.mjs red 4/5 before (TS ['real-dep','gamma','string']; Ruby/Lua/PHP closures counted), green after. Side effect on the deterministic fixture: src/core/guard.ts lost its bogus import 'ctx' (interface method parameter); without that feature role induction puts the CanActivate interface (a type) into the canActivate methods' role group (_repo role 7, 31 members), that group gets no template, and grain.test.mjs 'check reads the worktree version … +dirty' sees 1 deviation instead of 2 (the 'activate+can shape: … carry true' line is gone). Cross-kind role assignment is a separate defect the bogus import masked; test left unchanged pending a decision.

commit 830f2e9 (ruling c): fixture src/core/guard.ts now types the parameter as IncomingMessage from node:http, so the interface stays out of the canActivate role group; grain.test.mjs passes unchanged (2 deviations, shape line).
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2279, pass 2278, fail 0, skipped 1, merge 77473cb

