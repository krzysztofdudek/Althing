# 033 · The portal in progressive mode counts like `yg check --full` and says 'Blockers stop the build' when `yg check` passes, while the documentation promises the same numbers as yg check

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0722-lzmf
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/docs/portal.md, Yggdrasil/docs/progressive-mode.md, Yggdrasil/source/cli/src/templates/portal/js/views/overview-view.js
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** docs/portal.md:189-191 ('The numbers on every view are the same numbers yg check reports; the portal is a window onto that result, never a second opinion'); source/cli/src/templates/portal/js/views/overview-view.js:21-43 (text :42, comment :24); the deliberate absence of a scope: source/cli/src/portal/engine-api.ts:190-199 (runPortalCheck with changeScope: undefined and the comment 'DELIBERATELY unscoped'), tests/portal-e2e/progressive-scope-divergence.spec.ts
**Branch:** jarl/031-portal
**Merged:** 4fdb0779fba283544076fa447532c9abb13a1c62
**CI:** none

## What
Reproduction (npm @chrisdudek/yg@6.1.0, Node v24.11.1, examples/checkout-flow): on main a debt (fulfillment calls trackX instead of track) and `progressive: { reference: main }`; on feat only a comment added to src/cart.ts. `yg check`: PASS, exit 0, '1 warning … 1 obligation outside your changes vs main', warning[refused-outside]; `yg check --json`: errors 0, warnings 1; `yg check --full`: FAIL, exit 1, error[refused]. `yg portal --static` and the served portal (`yg portal --port 47391 --no-write`): meta.counts errors 1, warnings 0, refused 1 (as with --full), the overview in headless Chromium: 'Some code broke a rule. 1 blocking item(s) — 1 refusal(s), 0 other blocker(s) — and 0 advisory signal(s). Blockers stop the build; advisories do not.' The static HTML has 0 occurrences of 'progressive' and 'outside your change'. The portal's lack of scope is intended (a comment in engine-api.ts, a test pinning the divergence), so the part of the finder's report saying the portal should downgrade a refusal to a warning is refuted; the defect is that no user-facing surface says so: portal.md promises the same numbers as yg check, the overview talks about blocking the build, progressive-mode.md does not mention the portal, and the CHANGELOG is silent. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-30/repro.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-30/served.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-30/overview-static.log.

## Why
A progressive-mode user sees in the portal that the build is blocked, while the gate the build really runs passes; the sentence about parity with yg check is false in this mode. The portal's numbers are the real state of the whole project and agree with `--full`, so nothing gates wrongly, hence minor.

## Acceptance
- docs/portal.md says that the portal always answers like `yg check --full`, and docs/progressive-mode.md has a note about it.
- With progressive.reference configured, the portal's overview says it shows the picture of the whole project, not the change gate; runPortalCheck stays unscoped (the progressive-scope-divergence test passes).

## Changelog
- Fixed: under progressive mode the portal's overview says it shows the whole project as yg check --full does, not the change gate; docs/portal.md and progressive-mode.md say so.

## Evidence

- **ran (history):** git commit (merge of jarl/031-portal into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8113 pairs verified; [repo-check] All checks passed; [release/6.1.1 4fdb0779f] Merge jarl/031-portal

