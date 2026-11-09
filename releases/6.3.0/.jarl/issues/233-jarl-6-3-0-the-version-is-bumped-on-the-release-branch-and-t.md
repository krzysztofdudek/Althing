# 233 · Jarl 6.3.0: the version is bumped on the release branch and the changelog reads as released

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261109T0954-ehop
**Tags:** 
**Files:** 
**Repo:** JarlSkill
**Found by:** jarl
**Where:**
**Branch:** jarl/232-bump
**Worker:** w-jarl-232-sonnet
**Model:** claude-sonnet-5-5
**Since:** 2026-11-09 09:55

## What
The plugin manifests of every platform name 6.3.0; CHANGELOG.md's Unreleased section becomes 6.3.0 with its compare links, and says what 6.3.0 is against 6.2.0 for the people who use Jarl.

## Why
The release procedure's bump commit, prepared before the owner's word on the push and the tag.

## Acceptance
- [check] every plugin manifest names 6.3.0 and none names 6.2.0 · by: grep -rn '"version"' .claude-plugin .codex-plugin .cursor-plugin .github/plugin
- [read] CHANGELOG.md has a 6.3.0 heading, an empty Unreleased section and compare links, and every line under 6.3.0 is true of the release tip against 6.2.0, for someone who uses Jarl
- [check] the full suite passes on the merged result

## Reviews
- **changes** · by rev-jarl-232-opus-prep (fresh) · 2026-11-09 · model claude-opus-5-5
  Line 2 read is not met: "every line under 6.3.0 is true of the release tip against 6.2.0, for someone who uses Jarl". Important 1, a false line. The Added entry "Every command that records work can now say who did it ... a task started without a name shows as unnamed" and the Changed entry saying answer and decide need --by "as a review, a retraction and the owner's tick already did" describe an optional --by. At the tip the command line refuses set, new, log, evidence, field, ask and goal --set without --by ("every write names its writer with --by"), and the tools require by. A lease without a name cannot happen there. Important 2, Before you upgrade is incomplete. The changelog's own header says that section lists the changes that ask something of you, and 6.2.0 listed a removed command there. It lists only the format and the library. Required --by, a method on every acceptance line, --line on a proof row and the removed body, tag, prio, files, repo, source, after, tips, queue and check all belong there. Nothing in the section says set in-progress now needs --worker and --model, or that review needs --model on the command line: set 1 in-progress go passes on 6.2.0 and the tip refuses it. Important 3, not said. A 6.2.0 copy does not refuse a converted loop. On a loop with Format: 4, 6.2.0 new and set both wrote, the log gained lines with no key or writer, profile.json gained "format": 2, and 6.3.0 then refused the loop as "not a valid profile". The section needs a line that every copy touching a loop moves to 6.3.0 first. Important 4, the first Before you upgrade line understates the conversion. Every old log line takes the writer unrecorded, per converting-from-6-2.md, beyond "lines Jarl could not place". That file also says an open issue's history rows prove nothing, so each of its test, check and compare lines needs its proof recorded again, and an unmarked line becomes a read line. A user with work in progress needs those two facts. Important 5, a wrong removal. The Changed entry says the files rule applies "When more than one coordinator has work in play". With one coordinator and one issue in no slice, set is refused: "2 slices are in play (slice:odin, the issues in no slice)". The removed entry "the tasks that belong to no part count as one more part" stated that behaviour, so widen the entry or restore it. Minor: "A task closes when each line has what its method asks" names test and read only; a compare line needs two matching rows from the holder, and a check on the declared command closes on the landing. Checked and fine: the five manifests, both compare links, the refusal on 18 commands naming the conversion file, jarl-record/4, the other removed entries, reserved names in a running loop, and changelog-entries.test.mjs, whose first test fails on a duplicate entry and on a missing heading and passes on an empty Unreleased. The suite passes.
- **changes** · by rev-jarl-232-opus-prep (fresh) · 2026-11-09 · model claude-opus-5-5
  Round 1 at 0f1f274. Line 2 read is still not met: "every line under 6.3.0 is true of the release tip against 6.2.0, for someone who uses Jarl". Important, a false line in Before you upgrade: "every issue still open has to be proved again". I built a loop with 6.2.0, gave issue 1 a row and an approve and issue 2 a row only, and converted it by converting-from-6-2.md. verify came back clean. set 1 done then printed "1 -> done" with no new proof. Issue 2 asked only for an approve. A 6.2.0 acceptance line has no method, so it reads as a read line, and an approve given before the conversion still clears it. Only a line already marked test, check or compare needs its rows again, as the last section of that file says. My round 1 point 4 cited that section too loosely, and the new wording follows my error. Say what the tool does: unmarked lines become read lines, an approve from before the conversion counts, old rows prove nothing. Minor: "a verdict from review needs --model" has two exceptions, since --bot and --by owner both pass without it. Checked by running and true: a write with no --by on 22 commands, a lease with no --worker or --model, a line with no method through new and field, proof with no --line, the ten removed commands with their replacement calls, every old log line unrecorded, 6.2.0 from the tag writing to a converted loop (set, evidence and new add "format": 2 and 6.3.0 refuses the loop, log leaves a line verify names), and the coordinator entry across six cases. Both changelog tests pass, 118 entries with no repeat.

## Evidence

### Proof

- **ran (line 8744d8aa42e7):** grep -rn '"version"' .claude-plugin .codex-plugin .cursor-plugin .github/plugin · **saw:** four manifests, each "version": "6.3.0"; no 6.2.0 (root plugin.json also 6.3.0)
- **ran (line fe2337ab86c3):** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 1800 node tests/suite.mjs, on the bump branch · **saw:** 1743 tests, 1721 pass, 0 fail, 22 skipped, exit 0
- **ran (line 8744d8aa42e7):** grep -rn '"version"' .claude-plugin .codex-plugin .cursor-plugin .github/plugin plugin.json, at 5e786c3 · **saw:** five manifests, each 6.3.0; git grep finds no 6.2.0 outside the changelog and one test fixture
- **ran (line fe2337ab86c3):** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 1800 node tests/suite.mjs, on a clean git archive extraction of 5e786c3 with git init · **saw:** 1743 tests, 1721 pass, 0 fail, 22 skipped, exit 0 (the bump branch, before its merge)

### Notes

Assumed: the root plugin.json is a plugin manifest too and names 6.3.0 with the four the grep covers; the changelog test that required an entry under Unreleased now requires only the heading, since an empty Unreleased is what the issue asks for and the reader is still proved by its synthetic test; the format refusal and its conversion are said once, under Before you upgrade; entries about fixes of things 6.2.0 never had (the tag command, slices, rules that end, the review question, conflict notes) and two duplicates are removed.

