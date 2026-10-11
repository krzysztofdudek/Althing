# 297 · Yggdrasil: follow-ups from the broken-node navigation review: a broken child under a mapping parent, load-failure wording, node and log read, docs, init notes

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/owner.ts, Yggdrasil/source/cli/src/cli/build-context.ts, Yggdrasil/source/cli/src/utils/node-load-failure.ts, Yggdrasil/source/cli/src/cli/node.ts, Yggdrasil/source/cli/src/core/log/log-read.ts, Yggdrasil/docs/family-contracts.md, Yggdrasil/source/cli/src/cli/tree.ts, Yggdrasil/source/cli/src/cli/impact.ts, Yggdrasil/source/cli/src/cli/init.ts, Yggdrasil/source/cli/tests/e2e/cli-init-subdirectory.test.ts
**Repo:** ../../../Yggdrasil
**After:** 021
**Found by:** fresh-reviewer
**Where:**

## What
Items the fresh review of 021 left open, as one checklist. (a) A broken child under a mapping parent: owner, context and impact --file on a file under payments/refunds/, where payments/refunds does not load and payments maps src/payments/, answer payments without mentioning refunds (cli/owner.ts:642, cli/build-context.ts:696). (b) node 'payments/refunds/typo' did not load is reported for a path that does not exist, while the doc comment of the function says it returns nothing then (utils/node-load-failure.ts:33). (c) yg node and yg log read --node still answer node-not-found for a node that did not load (cli/node.ts:74, core/log/log-read.ts:73), which Horde's node-existence check reads as absent. (d) docs/family-contracts.md:98 still says node-not-found is given exactly where it was, while context and impact --node now answer yaml-invalid. (e) The [not loaded] line for a YAML syntax error ends on a dangling colon (cli/tree.ts:134). (f) The rewordings in cli/impact.ts:169 and :327 have no assertions. (g) init: the undo warning says to delete only .yggdrasil/ but the bootstrap also writes AGENTS.md, CLAUDE.md, .clinerules/ and .gitattributes (cli/init.ts:1068); the note that a bare yg init asks before it starts one is untrue without a terminal (cli/init.ts:1046); yg init --provider in a package directory with no graph now configures the enclosing graph's reviewer, which needs a Before you upgrade line naming the non-interactive route (--no-reviewer there, then --provider); the e2e --provider case in tests/e2e/cli-init-subdirectory.test.ts does not assert the note that names the graph. Noted and left as it is: context --json for a missing path keeps owner.reason unmapped.

## Why
Each item is a place where the navigation commands still say the node is absent or give a misleading next step for a node that exists but did not load, or where init tells the user something untrue.

## Acceptance
- (a) Test: owner, context and impact --file on a file under a broken child of a mapping parent name the broken child as the step; red before, green after.
- (b) Test: a path that does not exist gives no did-not-load line; red before, green after.
- (c) Test: yg node and yg log read --node on a node that did not load answer yaml-invalid, not node-not-found; red before, green after.
- (d) docs/family-contracts.md:98 says where node-not-found is still given and where yaml-invalid is, beside the 088 correction.
- (e) Test: the [not loaded] line for a YAML syntax error does not end on a colon.
- (f) Assertions exist for the wording in cli/impact.ts:169 and :327; they fail when the wording is reverted.
- (g) Tests: the undo warning names every file the bootstrap writes; the note about a bare yg init is true without a terminal; the e2e --provider case asserts the note naming the graph; CHANGELOG Before you upgrade names --no-reviewer then --provider.

## Changelog
- Fixed: the navigation commands name a component that did not load wherever they used to say it was missing (a broken child under a mapping parent, yg node, yg log read), and yg init's warnings and notes describe what it really writes and when it asks.

## Evidence

