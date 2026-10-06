# 092 · `yg incident add --reason` with a line shaped like an entry header (`## [<datetime>] <tag>`) writes extra ledger entries with any tag, aspect and timestamp, bypassing the validation of --tag and --aspect

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/incident.ts, Yggdrasil/source/cli/src/io/incidents-store.ts, Yggdrasil/source/cli/tests/e2e/cli-aspects-health.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/incident.ts:50-56 only checks that --reason is not empty (no guard like the one in `yg log add`: core/log/log-entry.ts:78 and reasonHasLevel2HeaderOutsideFence :154-169); io/incidents-store.ts:131-140 (formatIncidentEntry writes reason.trim() unchanged), :148-161 parseIncidents applies HEADER_RE (:114-115) to every line of the file, body lines included; the comments :17-20, :111-112 and :154-155 say 'a reason cannot forge a rule name'
**Branch:** jarl/079-singletons
**Merged:** b446e32fab2fe73581bfda4eb599a5a9da921277
**CI:** none

## What
Reproduction (npm yg 6.1.0 in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-62/yg-install, fresh clone at tag v6.1.0, a new project, own steps): `--tag banana` is refused, `--aspect nope` gives aspect-not-found, and in both cases nothing is written. One `yg incident add --tag no-rule` with a --reason containing the lines `## [2020-01-01T00:00:00.000Z] banana aspect=nope` and `## [2099-01-01T00:00:00.000Z] wrong-rule aspect=ra`: exit 0 and a message about one incident written; `yg incident read` shows 3 incidents, including the invalid tag banana and a wrong-rule from 2099; `yg aspects --health` gives the rule ra `wrong-rule 1 (thin data)`, although no --aspect was given; `yg advise` counts 3 incidents and 1 wrong-rule; `yg check` warns incident-ledger-out-of-order at once (the forged 2020 before the real 2026), and a forged future date (2099) breaks every later real add the same way. Attribution to a non-existent aspect (`aspect=nope`) is accepted too. For comparison, `yg log add` refuses the same text ('Reason contains `## ` (level-2 header) outside a code fence'). Rejected part of the issue: a pasted log.md fragment is not enough; the log.md header is a bare `## [<ISO>]`, and HEADER_RE requires a tag token after the bracket (a reason with only `## [2099-01-01T00:00:00.000Z]` gives exactly 1 entry); only a line shaped like an incident header triggers it, e.g. a quote of an earlier incidents.md entry or a deliberate forgery. The e2e test cli-aspects-health.test.ts:555 only checks a fake `aspect: x` in the body, not a full header line. incident.ts and incidents-store.ts unchanged since v6.1.0 on origin/main. This is not 351 of 6.1.0, nor anything from the 6.1.1 loop. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-62/verify-62-incident-forge.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-62/repro/verify-incident-forge.sh); issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/find-9-incident-forge.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/repro/incident-forge.sh.

## Why
docs/cli-reference.md (the yg incident section): 'Each `add` appends one timestamped, human-signed entry' and 'the command adds the timestamp'; the ledger feeds the advise counter, the rule's health column and the ordering warning, so one pasted quote falsifies the statistics and breaks the order for good. Anyone who can run add can also edit the file (the ledger has no baseline), and the effects are advisory, so minor.

## Acceptance
`yg incident add` refuses a --reason with a line that would parse as an entry header (outside a code block), as `yg log add` does, or escapes it: in the repro scenario the ledger has exactly one entry with a validated tag and aspect, and `yg aspects --health`, `yg advise` and `yg check` see no forged entries (an e2e test with a full header line).

## Changelog
- Fixed: yg incident add refuses a --reason containing a line shaped like a ledger entry header (fenced or not), so one add records exactly one incident and advise, aspects --health and check see no forged entries.

## Evidence

- **ran:** git commit (merge of jarl/079-singletons into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8117 pairs verified; coverage branches 90.2%; [repo-check] All checks passed; [release/6.1.1 b446e32fa] Merge jarl/079-singletons

