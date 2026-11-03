# 041 · Jarl: relayed verdicts count as fresh reviews in report and status

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-a1ab3b3a
**Where:** JarlSkill/skills/jarl/scripts/lib/metrics.mjs (metricsOf), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4002 at a1132a8
**After:** 035

## What
Claim: 65 of 136 verdicts came from a pull-request bot and were counted among fresh reviewers. Corrected by the sceptic: Kind gap and owner, not defect: count relayed apart in report and status; whether a bot's approve may clear an issue is the owner's call.

--relayed exists and models counts it per reviewer, but the fresh, coordinator and self split of report and status ignores it, so a relayed approve counts as fresh and clears the gate. Map row fr-06.

## Why


## Acceptance
- A verdict can be recorded as given by a named bot; report and status count bot and relayed verdicts apart from fresh ones
- A loop's definition of an approved issue (its done gate) names which reviewers' approves clear: fresh agents by default, the owner, and bots the loop names; and may require several together (a bot pass and a fresh approve, for instance)
- With no definition, a bot's approve never clears, and done says so naming the bot
- Tests for the default, for a loop that names a bot as clearing, and for one that requires a bot and a fresh approve together

## Evidence

Ruling ask-011 (stuck): Krzysztof, 2026-11-03 (translated from Polish): "1, but it also depends on the loop: whether we iterate locally or on pull requests (to a feature branch, for example). There, other bots may come in, like CodeRabbit or Copilot. As a rule I work only in local mode. The loop should define what an approved issue means." The full ruling is approval-defined-by-the-loop.

Ruling approval-defined-by-the-loop: Krzysztof, 2026-11-03 (translated from Polish): "1, but it also depends on the loop: whether we iterate locally or on pull requests (to a feature branch, for example). There, other bots may come in, like CodeRabbit or Copilot. As a rule I work only in local mode. The loop should define what an approved issue means." Each loop defines what an approved issue is: which reviewers' approves clear it (a fresh agent, the owner, a bot the loop names) and what must come with them. With no definition, option (1) of a-011 holds: a bot's verdicts are recorded and counted apart, its findings are welcome, and only a fresh agent's or the owner's approve clears. Built today: a profile's done gate already says approve fresh or none, requires-merged and required slots; the definition extends that.

