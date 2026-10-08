# 280 · Jarl: show prints the gate's window by default, show --full prints the file; a long free-text evidence note is noted on stderr

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#jarl-fr-show-bounded
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs:481 at 2c12aa3 (show prints the issue file verbatim)
**After:** 248

## What
show prints the issue file verbatim (JarlSkill/skills/jarl/scripts/jarl.mjs:481 at 2c12aa3), so an issue worked in parts and rounds grows without bound in every agent's context (a field report from a loop in another project, items 4 and 9). 248 will write every review's full findings into the issue, and the worker's brief pastes the issue whole (SKILL.md:456), so a takeover after three rounds carries three full reviews into a fresh worker. Free-text evidence is appended whole, and only its first line reaches the log (jarl-lib.mjs:1473). The design research/2026-10-08-jarl-field-report-and-repository-names/design.md (B.2, items 4 and 9) bounds show by the gate's own window. Sub-parts of an issue are rejected: issues with After, or a package on one branch, are the parts; a length limit on evidence is rejected, because it would lose text it was given (248's rule). Release: 6.2.0 on the owner's word, because it pairs with 248; else 6.3.0.

## Why
Agents skip what they have to remember to ask for, so the bound is the default and not an opt-in --brief (the previous architect's section 3.1). The bound is the gate's window, not a fixed count, so a reviewer always sees every row the gate counts, and a worker taking over always sees what is still open.

## Acceptance
- show <id> prints by default: the header, What, Why, Acceptance and Changelog; every --ran/--saw row and every verdict since the last start or reopen, which is what the done gate counts; every changes finding no later approve has answered; one line for each earlier round; and last, the exact call that prints everything
- show <id> --full prints the file verbatim; show --json stays complete
- The worker's brief in SKILL.md pastes show's output, not the file
- evidence notes on stderr when a free-text note runs long, and still writes it whole: nothing is refused or cut
- Tests: an issue with three rounds shows the current window, one line per earlier round and every unanswered changes finding; --full equals the file; --json is unchanged

## Evidence

