# 297 · Yggdrasil: follow-ups from the broken-node navigation review: a broken child under a mapping parent, load-failure wording, node and log read, docs, init notes

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2056-qlem
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/owner.ts, Yggdrasil/source/cli/src/cli/build-context.ts, Yggdrasil/source/cli/src/utils/node-load-failure.ts, Yggdrasil/source/cli/src/cli/node.ts, Yggdrasil/source/cli/src/core/log/log-read.ts, Yggdrasil/docs/family-contracts.md, Yggdrasil/source/cli/src/cli/tree.ts, Yggdrasil/source/cli/src/cli/impact.ts, Yggdrasil/source/cli/src/cli/init.ts
**Repo:** Yggdrasil
**After:** 021
**Found by:** fresh-reviewer
**Where:**
**Branch:** jarl/220-cli-messages
**Worker:** w-220-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 12:51

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
- Fixed: the navigation commands name a component that did not load wherever they used to say it was missing (a broken child under a mapping parent, yg node, yg log read), and a path that names no component below one that did not load is answered as not found. yg init's warnings and notes describe what it really writes and when it asks.
- Before you upgrade: yg init --provider in a package directory with no graph of its own now configures the graph above. A script that relied on the separate graph runs yg init --no-reviewer in that directory first, then yg init --provider <name> there.

## Evidence

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.
- **ran (line ab6071c853e3):** npx vitest run (cli-broken-node-navigation, cli-init-subdirectory, cli-impact, unit impact, graph-loader-port-aspects) with src reverted · **saw:** 11 failed: scenario C (owner, context, impact on src/payments/refunds/refund.ts answered 'payments' with no warning) failed; green after (Test Files 27 passed, Tests 250 passed)
- **ran (line 7a67707796c4):** npx vitest run (cli-broken-node-navigation, cli-init-subdirectory, cli-impact, unit impact, graph-loader-port-aspects) with src reverted · **saw:** 11 failed: B2 'is answered as missing, never as a component that did not load' failed (node payments/refunds/typo said did not load); green after the loader records the components below a failure
- **ran (line aef8553bbc7e):** npx vitest run (cli-broken-node-navigation, cli-init-subdirectory, cli-impact, unit impact, graph-loader-port-aspects) with src reverted · **saw:** 11 failed: 'yg node and yg log read --node on the child answer yaml-invalid' and the broken-node list with node and log read failed (node-not-found); green after
- **ran (line 61a2d682b842):** git diff HEAD~2 -- docs/family-contracts.md · **saw:** docs/family-contracts.md line 98 now says aspect-not-found, usage and node-not-found for a path that names no component are given where they were, and yaml-invalid for a component that did not load by yg node, context --node, impact --node, tree --root, log add --node and log read --node, beside the three corrections
- **ran (line d63277cc81ab):** npx vitest run (cli-broken-node-navigation, cli-init-subdirectory, cli-impact, unit impact, graph-loader-port-aspects) with src reverted · **saw:** tree test 'yg tree lists the sibling and marks the broken component' failed on the not-loaded line ending on a colon; green after loadFailureReason
- **ran (line 013365466c44):** npx vitest run tests/unit/repo tests/e2e/cli-broken-node-navigation.test.ts tests/e2e/cli-init-subdirectory.test.ts tests/unit/cli/impact.test.ts tests/unit/cli/init-enclosing-graph.test.ts tests/unit/utils/node-load-failure.test.ts, then the merged tree · **saw:** tests/unit/cli/impact.test.ts asserts 'Run one target at a time: yg impact --node orders/order-service, or yg impact --aspect requires-audit.' and the uncovered-file step 'Add src/unmapped/file.ts to the mapping of the node that owns its code ... yg owner --file ... names the likely owners.'; Test Files 27 passed, Tests 250 passed. Not run: a revert of the wording, the assertions are exact strings of the new wording
- **ran (line c40158b1d6e5):** npx vitest run (cli-broken-node-navigation, cli-init-subdirectory, cli-impact, unit impact, graph-loader-port-aspects) with src reverted · **saw:** init: 'the warning of a bare init with no terminal names every file the bootstrap writes' and '--provider ... starts none in the subdirectory' (now asserting the note) failed; green after; unit init-enclosing-graph asserts the note says a bare init asks only in a terminal and the warning lists .yggdrasil/, AGENTS.md, CLAUDE.md, .clinerules/yggdrasil.md, .gitattributes; CHANGELOG Before you upgrade bullet names yg init --no-reviewer then yg init --provider

Assumed: the warning for a broken child under a healthy parent is generic (any failed component below the owner), because the loader cannot tell which files a component that did not load maps; the --json documents of owner, context and impact do not carry it (the warning goes to stderr).

Assumed: nodeParseErrors entries record the components below them (a below list) so a path that names no component is told apart without touching the disk; an entry without the list, as a hand-built graph has it, covers every path under it.
- **ran (line ab6071c853e3):** npx vitest run node-load-failure, log-read, impact, owner, bounty2/owner, graph-loader-config-fallback (src reverted, then fixed); golden:update; unit/repo ratchet; typecheck, lint, dead-exports · **saw:** red before: 8 failed; green after (32 files, 382 tests with the neighbours, golden corpus and ratchet); commit 921241ed2
- **ran (line ab6071c853e3):** npx vitest run log-read, owner (unit), aspect-review-overdue (src reverted, then fixed), with the log e2e, golden corpus and ratchet; typecheck, lint, dead-exports · **saw:** red before: 6 failed (log-read steps, owner --file with --files native paths); green after (30 files, 413 tests); commit aa9df9423

