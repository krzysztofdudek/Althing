# 478 · Runes: two commands whose names differ only by a space or a hyphen (a a and a-a) get one MCP tool name, silently; the property test finds it on some seeds and turned CI red

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** runes, mcp, 1.1.0
**Files:** Runes/src/mcp/tools.mts, Runes/src/cli/table.mts, Runes/test/properties.test.mjs
**Repo:** ../../../Runes
**Found by:** jarl
**Where:** CI run 41549295867 on release/1.1.0 (test-windows, Node 22): properties.test.mjs:145 'every generated tool lists exactly the fields argvFor accepts' failed with RUNES_PROPERTY_SEED=1328475926; it fails the same way on Linux with that seed. toolName (src/mcp/tools.mts:47) maps both a space and a hyphen to an underscore, and test/helpers/prng.mjs name() can produce a hyphen
**Branch:** jarl/478-mcp-tool-name-collisions
**Merged:** 5cbcc8c in ../../../Runes
**CI:** green

## What
toolName turns both spaces and hyphens into underscores, so a table with the commands a a and a-a gives two tools named prop_a_a. Nothing refuses such a table, and a call to that name reaches whichever command is found first. The property test's generator can draw such a pair, so CI fails on some seeds.

## Why
A consumer whose command names collide this way gets a tool that runs the wrong command, with no error; and a red CI on a random seed blocks the release.

## Acceptance
- A table whose commands map to one tool name is refused where the tools are built (or where the table is defined), naming both commands, with a test
- The property test draws tables without such collisions, or asserts the refusal for them, and passes with seed 1328475926 and with 200 fresh seeds in one run
- docs/api.md says what happens to colliding command names

## Changelog
- Fixed: a command table in which two public commands give one MCP tool name (`a a` and `a-a` both `<prefix>a_a`), or a public command named `help` while the help tool is on, is refused by `buildTools` (and the first kind by `defineTable`), naming both, instead of the tool running whichever came first; a consumer's table shows a new refusal only if it had such a pair

## Evidence

- **ran:** node --test test/properties.test.mjs with src/cli/table.mts and src/mcp/tools.mts held at release/1.1.0 (new tests only) · **saw:** defineTable refuses the table and names both commands: Missing expected exception; buildTools refuses a table that skipped defineTable: Missing expected exception
- **ran:** RUNES_PROPERTY_SEED=1328475926 node --test test/properties.test.mjs; also seeds 11, 222222, 987654321, 1234567, 2000000000; each 200 tables per property · **saw:** pass 9 fail 0 on every seed; npm run check: 1966 pass, dist fresh; npm run coverage: 99.06 lines, 94.85 branches, 99.14 functions

rev-runes-478-opus ran 200 fresh seeds of properties.test.mjs one after another on 66eb360 (2026-11-03): none failed
- **ran:** node --test test/properties.test.mjs, help-name test against the build before the fix, then after · **saw:** before: pass 9 fail 1 (a public command named help with the help tool on was accepted); after: pass 10 fail 0; npm run check 1967 pass, dist fresh
- **ran:** the many-seeds line: properties.test.mjs with seeds 1328475926, 11, 222222, 987654321, 1234567, 2000000000, six seeds, each drawing 200 tables per property · **saw:** pass 9 fail 0 on each of the six
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** tests 1982, pass 1982, fail 0; dist/ is fresh (merge 5cbcc8c on release/1.1.0)

