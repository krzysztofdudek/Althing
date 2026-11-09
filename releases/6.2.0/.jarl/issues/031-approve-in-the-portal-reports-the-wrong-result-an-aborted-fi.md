# 031 · Approve in the portal reports the wrong result: an aborted fill shows 'Filled · re-checked', a fill already running shows 'View-only mode', a refused dry-run shows 'static export' (and the server returns 500 internal)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-zndc
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/templates/portal/js/bootstrap.js, Yggdrasil/source/cli/src/templates/portal/js/consumer.js, Yggdrasil/source/cli/src/portal/server/approve.ts, Yggdrasil/source/cli/src/portal/server/router.ts, Yggdrasil/tests/portal-e2e/served-refresh-approve.spec.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/templates/portal/js/bootstrap.js:140-147 (approve(true).then discards the body and does not read ok/exitCode/stdout), :150-152 (any other rejection = 'Approve unavailable (static export)'); consumer.js:131 (`if (resp.status === 409) throw new Error('view-only')`, ignores body.error), :111 ('dry-run-failed'); portal/server/approve.ts:187-190 and :154-170 (parseDryRunBudget without checking exit.status); router.ts:232-236, :240-245 and :251-256 (two different 409s), :259-264, :269-281 (catch-all 500 internal)
**Branch:** jarl/031-portal
**Merged:** 4fdb0779fba283544076fa447532c9abb13a1c62
**CI:** none

## What
Reproduction (npm @chrisdudek/yg@6.1.0; examples/checkout-flow from a fresh clone of v6.1.0; `yg portal --port N` with writing enabled; a playwright-core 1.63 driver with a cached headless shell clicks the real '✓ Approve' button and accepts the dialog). Control: a successful fill → 'Filled · re-checked'. A: log_required: true and an edited src/cart.ts: POST /approve returns 200 {ok:false, exitCode:1, stdout:'yg check: ABORTED  nothing recorded — 3 nodes need a log entry first'}, and the pill says 'Filled · re-checked'; the overview beside it still says 'Some code is waiting to be checked. 6 blocking item(s)', and `yg check --no-approve` afterwards FAILs with 6 errors, nothing was recorded. B1: .yggdrasil/.yg-approve.lock in the CLI format with a live pid of this host; B2: a real `yg check --approve` in progress in a terminal (slowed down by a script rule): in both, POST /approve returns 409 {error:'approve-in-progress'}, and the page with writing enabled says 'View-only mode — write disabled'. C: a tier with `provider: nonexistent-provider`: GET /approve/dry-run returns 500 {error:'internal'}, the pill on the served page says 'Approve unavailable (static export)', and the portal's terminal prints '[portal] request handler error ... Could not read the dry-run cost preview' and the whole JSON document; the CLI itself returns exit.status 'aborted', reason 'nothing ran — 1 problem must be fixed first', without dryRunBudget. C concerns the structural gate codes (APPROVE_GATING_CODES, utils/check-codes.ts:203, about 30 codes); relation-broken does not abort the dry-run. In A, the CLI dry-run warns 'note: a fill stops before spending this budget until these exist: error[log-entry-missing] ... cart, fulfillment, payment', while the portal's dialog shows only numbers and 'Proceed?'. The test tests/portal-e2e/served-refresh-approve.spec.ts checks only /Approved|re-checked/, which would also pass after an abort; the server deliberately detects a parallel fill (tests/integration/portal-approve-busy.test.ts), but the client describes it wrongly. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-28/repro.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-28/repro-a-overview.log (script repro.sh, driver install/click-approve.mjs).

## Why
The portal's only write action gives wrong feedback in a common state: every code edit in a log_required node followed by Approve shows 'Filled', and the reason is never visible, so one has to go to the terminal. bootstrap.js:106-111 promises 'never a silent success'. Nothing wrong is recorded, and CI stays red.

## Acceptance
- An ok:false response shows that nothing was recorded, with the gate's reason (e.g. log entries due); 409 approve-in-progress shows 'another fill is running', and only 409 view-only shows read-only mode; 'Filled' never appears with ok:false.
- /approve/dry-run with exit.status 'aborted' returns the reason and the structural findings instead of 500 internal, and the page shows that the fill cannot start; portal-e2e tests for A, B and C.

## Changelog
- Fixed: the portal's Approve button says how the run really ended — nothing recorded and why when a gate stops it, another fill already running, or why no fill can start (no confirmation offered) — and reads Filled only after a fill that passed.

## Evidence

- **ran (history):** git commit (merge of jarl/031-portal into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8113 pairs verified; [repo-check] All checks passed; [release/6.1.1 4fdb0779f] Merge jarl/031-portal

