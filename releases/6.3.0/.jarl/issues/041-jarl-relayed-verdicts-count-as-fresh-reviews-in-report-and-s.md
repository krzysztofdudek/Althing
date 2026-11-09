# 041 · Jarl: relayed verdicts count as fresh reviews in report and status

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0838-gntw
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-a1ab3b3a
**Where:** JarlSkill/skills/jarl/scripts/lib/metrics.mjs (metricsOf), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4002 at a1132a8
**After:** 035
**Branch:** jarl/007-review-queue
**Merged:** dedd9efc39e61ba3ac648243ac17939cbcce6a32 in ../../../JarlSkill
**CI:** none

## What
Claim: 65 of 136 verdicts came from a pull-request bot and were counted among fresh reviewers. Corrected by the sceptic: Kind gap and owner, not defect: count relayed apart in report and status; whether a bot's approve may clear an issue is the owner's call.

--relayed exists and models counts it per reviewer, but the fresh, coordinator and self split of report and status ignores it, so a relayed approve counts as fresh and clears the gate. Map row fr-06.

## Why


## Acceptance
- A verdict can be recorded as given by a named bot; report and status count bot and relayed verdicts apart from fresh ones
- A loop's definition of an approved issue (its done gate) names which reviewers' approves clear: fresh agents by default, the owner, and bots the loop names; and may require several together (a bot pass and a fresh approve, for instance)
- With no definition, a bot's approve never clears, and done says so naming the bot
- Tests for the default, for a loop that names a bot as clearing, and for one that requires a bot and a fresh approve together

## Changelog
- Added: A review can be recorded as given by a bot, such as one that reviews pull requests. Each loop says in its profile whose approvals close a task: by default a separate agent's or the owner's, never a bot's, and a loop may add a bot it names or ask for several approvals together. The status and the report count bot and relayed reviews apart from the others. The first bot review moves the loop to format 3.

## Evidence

Ruling ask-011 (stuck): Krzysztof, 2026-11-03 (translated from Polish): "1, but it also depends on the loop: whether we iterate locally or on pull requests (to a feature branch, for example). There, other bots may come in, like CodeRabbit or Copilot. As a rule I work only in local mode. The loop should define what an approved issue means." The full ruling is approval-defined-by-the-loop.

Ruling approval-defined-by-the-loop: Krzysztof, 2026-11-03 (translated from Polish): "1, but it also depends on the loop: whether we iterate locally or on pull requests (to a feature branch, for example). There, other bots may come in, like CodeRabbit or Copilot. As a rule I work only in local mode. The loop should define what an approved issue means." Each loop defines what an approved issue is: which reviewers' approves clear it (a fresh agent, the owner, a bot the loop names) and what must come with them. With no definition, option (1) of a-011 holds: a bot's verdicts are recorded and counted apart, its findings are welcome, and only a fresh agent's or the owner's approve clears. Built today: a profile's done gate already says approve fresh or none, requires-merged and required slots; the definition extends that.
- **ran (history):** cd skills/jarl/scripts && node --test tests/bot-reviews.test.mjs (before the change, at 5ab4ccc) · **saw:** pass 0, fail 7: review refused --bot as an unknown flag, the profile refused the done-gate key clears, status and report counted a relayed approve as fresh
- **ran (history):** cd skills/jarl/scripts && node --test tests/bot-reviews.test.mjs (at f463d82) · **saw:** pass 7, fail 0: the default, a loop naming a bot as clearing, a loop requiring a bot and a fresh approve together, the clears checks, the format raise refused by both frozen readers and by a composer's loop, --bot never a coordinator or the worker
- **ran (history):** cd skills/jarl/scripts && node --test the 61 test files that mention review (at f463d82) · **saw:** pass 1097, fail 0
- **ran (history):** on a copy of the 6.3.0 loop: review 026 approve --by rev-probe --relayed with release/6.2.1, then status with release/6.2.1 and with f463d82 · **saw:** release/6.2.1: done reviewed by: fresh 80 · coordinator 1 · self 0; f463d82: done reviewed by: fresh 79 · coordinator 1 · self 0 · relayed 1 · of every verdict recorded, relayed 1
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch jarl/007-review-queue at 12dce63) · **saw:** tests 1399, pass 1377, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test tests/fresh-approve-stands.test.mjs tests/bot-reviews.test.mjs (at 12dce63, the new tests before the fix) · **saw:** fresh-approve-stands: pass 0, fail 3 (agent, other-model, model-rank: on an issue with no code approved fresh and later by jarl, the live approve read as jarl (coordinator) where rev-4 (fresh) was expected); bot-reviews: pass 7, fail 2 (done closed a code issue on review --by owner --bot; status did not flag a note closed by a log line on a bot's approve alone)
- **ran (history):** cd skills/jarl/scripts && node --test tests/fresh-approve-stands.test.mjs (copied into a tree of the base 969f84b) · **saw:** pass 3, fail 0: the expectations of the new test (live approve, fresh, done decisions and counts under agent, other-model and model-rank, code and no code, with and without a later coordinator approve) are the base behaviour
- **ran (history):** cd skills/jarl/scripts && node --test tests/fresh-approve-stands.test.mjs tests/bot-reviews.test.mjs tests/closed-gate.test.mjs (at 716ee1c) · **saw:** tests 19, pass 19, fail 0
- **ran (history):** on a copy of the 6.3.0 loop: 113 given a proof row, an approve by rev-probe, then an approve by jarl (no code), then set 113 done and report with 969f84b, 12dce63 and 716ee1c · **saw:** 969f84b: Reviewed by: fresh 81 · coordinator 1 · self 0; 12dce63: fresh 80 · coordinator 2 · self 0 and fresh reviewers 57; 716ee1c: report identical to 969f84b (diff printed nothing)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch jarl/007-review-queue at 716ee1c) · **saw:** tests 1404, pass 1382, fail 0, cancelled 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1407, pass 1385, fail 0, skipped 22, merge dedd9ef

