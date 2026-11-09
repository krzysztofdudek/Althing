# 087 · yg-advise/1: hidden items in suppressed[] never carry the documented decision `suppressed: { action, until, reason }`

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-fria
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/advise.ts, Yggdrasil/source/cli/src/core/advise-feed.ts, Yggdrasil/source/cli/src/formatters/advise-json.ts, Yggdrasil/docs/public/schemas/yg-advise-1.schema.json
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/advise.ts:946-968 (buildAdviseJson: project() copies id/what/why/next/evidenceHash/aliases/provenance and does not set item.suppressed; :967 `suppressed: hidden.map(project)`); core/advise-feed.ts:71-107 applyDecisions works out the decision but returns `hidden: Nomination[]` (:34), pushing the bare nomination (:90, :102), so action, until and reason are lost; the type in formatters/advise-json.ts:54 (`suppressed?: { action; until?; reason }`) has been declared and unused since 49ea51da (5.9.0)
**Branch:** jarl/079-singletons
**Merged:** b446e32fab2fe73581bfda4eb599a5a9da921277
**CI:** none

## What
Reproduction (a fresh clone HEAD v6.1.0-5-g2493aa16, no changes in advise since the tag, and npm @chrisdudek/yg@6.1.0; a copy of examples/checkout-flow): before any decisions `yg advise --ids` shows aspect-effective-nowhere:dead-rule and overdue-review-by:old-rule; `yg advise dismiss aspect-effective-nowhere:dead-rule --reason …` and `yg advise defer overdue-review-by:old-rule --until 2099-01-01 --reason …` end with exit 0, and .yggdrasil/advise-decisions.jsonl has both decisions with action, until and reason. `yg advise --json`: items [] and suppressed with 2 items whose keys are only [id, what, why, next, evidenceHash(, aliases)]; the `suppressed` field is missing in both. In the installed dist/bin.js (~l.37139) buildAdviseJson matches the source, and the only string 'suppressed: {' is embedded documentation text. The sentence in docs/cli-reference.md:1579-1582 and the field in docs/public/schemas/yg-advise-1.schema.json came in with cce7f155 (issue 350, first in 6.1.0); the schema's $comment says it describes exactly what this release writes. The only consumer in the family, Horde audit.mjs:628-630, only counts `doc.suppressed.length`, and the field is optional in the schema, so validation passes. The `yg advise --all` text does not show the decision either, but the documentation promises there only a list of hidden items, so that is at most an addition to the same fix. This is not 139 from 6.1.0. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-57/repro-advise-suppressed.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-57/repro-advise-suppressed.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-5-advise-suppressed.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-5-advise-suppressed.sh.

## Why
A consumer of the /1 contract cannot tell a dismissal from a deferral or see the date and reason without reading advise-decisions.jsonl, and the documentation, the type and the published schema promise a field that no path produces. Nothing in the family breaks because of this today, so minor.

## Acceptance
applyDecisions returns with each hidden item the decision that hides it, and project() maps it to `suppressed: { action, until?, reason }`: in the repro scenario `yg advise --json` has `{ action: 'dismiss', reason }` for dismiss and `{ action: 'defer', until: '2099-01-01', reason }` for defer, and the document validates against the yg-advise-1 schema (test).

## Changelog
- Fixed: yg advise --json gives each suppressed item suppressed: { action, until, reason } (dismiss/done with reason, defer with date and reason), as the yg-advise/1 schema promised.

## Evidence

- **ran (history):** git commit (merge of jarl/079-singletons into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8117 pairs verified; coverage branches 90.2%; [repo-check] All checks passed; [release/6.1.1 b446e32fa] Merge jarl/079-singletons

