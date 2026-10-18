# 280 · Jarl: show prints the gate's window by default, show --full prints the file; a long free-text evidence note is noted on stderr

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** jarl, views
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#jarl-fr-show-bounded
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs:481 at 2c12aa3 (show prints the issue file verbatim)
**After:** 245, 248
**Branch:** jarl/245-retract
**Merged:** 3fb26880d446fd7de70bf8c602beaa764671fbab in ../../../JarlSkill
**CI:** pending

## What
show prints the issue file verbatim (JarlSkill/skills/jarl/scripts/jarl.mjs:481 at 2c12aa3), so an issue worked in parts and rounds grows without bound in every agent's context (a field report from a loop in another project, items 4 and 9). 248 will write every review's full findings into the issue, and the worker's brief pastes the issue whole (SKILL.md:456), so a takeover after three rounds carries three full reviews into a fresh worker. Free-text evidence is appended whole, and only its first line reaches the log (jarl-lib.mjs:1473). The design research/2026-10-08-jarl-field-report-and-repository-names/design.md (B.2, items 4 and 9) bounds show by the gate's own window. Sub-parts of an issue are rejected: issues with After, or a package on one branch, are the parts; a length limit on evidence is rejected, because it would lose text it was given (248's rule). In Jarl 6.2.0 (ask a-018 and the ruling jarl-release-alone-with-every-jarl-issue), after 245: the architect's scope review of 2026-10-18 (section 1) asks that show number the evidence rows by their file-wide ordinal, so evidence --retract <n> (245) can name a row the bounded view shows.

## Why
Agents skip what they have to remember to ask for, so the bound is the default and not an opt-in --brief (the previous architect's section 3.1). The bound is the gate's window, not a fixed count, so a reviewer always sees every row the gate counts, and a worker taking over always sees what is still open.

## Acceptance
- show <id> prints by default: the header, What, Why, Acceptance and Changelog; every --ran/--saw row and every verdict since the last start or reopen, which is what the done gate counts; every changes finding no later approve has answered; one line for each earlier round; and last, the exact call that prints everything
- Every evidence row show prints carries its ordinal counted over the whole issue file, the number evidence --retract <n> takes (245), in the bounded view, in --full and in --json
- show <id> --full prints the file verbatim; show --json stays complete
- The worker's brief in SKILL.md pastes show's output, not the file
- evidence notes on stderr when a free-text note runs long, and still writes it whole: nothing is refused or cut
- Tests: an issue with three rounds shows the current window, one line per earlier round and every unanswered changes finding; the ordinals in the bounded view match those in --full and retract the right row; --full equals the file; --json is unchanged apart from the ordinals

## Changelog
- Added: show <id> now prints an issue as the done gate sees it (the current window of rows and verdicts, every unanswered changes finding, one line per earlier round, and the call that prints everything); show <id> --full prints the whole file. Every evidence row carries its number, the one evidence --retract takes; show --json stays complete and adds the numbers.
- Added: A free-text evidence note that runs long is noted on stderr (command line only); it is still written whole.

## Evidence

- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 3fb2688 · **saw:** 284 tests, 282 pass, 0 fail, 2 skipped

