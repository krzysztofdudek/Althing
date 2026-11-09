# 045 · Jarl: init does not ask for the Model lines

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0838-amei
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-c41d3623
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdInit), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:1367 at a1132a8
**After:** 035, 052
**Branch:** jarl/108-small-gaps
**Merged:** 4e89d0ba43de04503c11bcd97ef430ec04e9fdef in ../../../JarlSkill
**CI:** none

## What
Claim: The goal had no Model (<tier>) lines, so models could rank nothing.

init notes a missing Check line but not missing Model lines; models on the loop copy said the loop declares no Model lines. Map row fr-10.

## Why


## Acceptance
- init asks nothing new; when the first agent is leased in a loop with no Model lines, next --as jarl offers once the lines per tier, naming the jarl's tier (strong) and the coordinators' (standard)
- Tested

## Changelog
- Added: Opening a loop whose goal has no line naming the models per tier now says so, with the command that adds one, as it already does for a missing check. The first lease that raises an agent with a model in such a loop says the same once in its own answer, naming the strongest tier for the jarl and the standard tier for the coordinators; nothing else offers it again.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test --test-name-pattern 'init says once' tests/models.test.mjs, before the change · **saw:** not ok 1: init on a goal with no Model line printed only the note on the missing check
- **ran (history):** cd skills/jarl/scripts && node --test tests/models.test.mjs tests/merge-check.test.mjs tests/library-parity.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs, on commit 267869d · **saw:** pass 185 fail 0 after the parity row of the reference was updated; init prints 'note: the goal declares no Model line ... add one for each tier: jarl.mjs goal --set "<machine-line>"' once, nothing for a goal with a Model line or a library caller, and models reads the line the form writes. Not done: the second clause of the acceptance (next --as jarl offering the lines when the first agent is leased) is left to a decision, see the report
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, once for the group, on commit 56dd68a · **saw:** tests 1503 pass 1481 fail 0 skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test tests/model-offer.test.mjs, new cases and the code before the change · **saw:** pass 2 fail 3: no log line after the first lease, no row on the jarl's list, no offer-closing line, and the frozen readers case failed only on its own setup
- **ran (history):** cd skills/jarl/scripts && node --test tests/model-offer.test.mjs tests/next-as.test.mjs tests/liveness.test.mjs tests/writer.test.mjs tests/sub-issues.test.mjs tests/slices.test.mjs tests/lone-agent-review.test.mjs, on the commit that follows 56dd68a · **saw:** pass 5 fail 0 in model-offer: one 'models offered' log line however many leases, one row on the jarl's list only (the form is the goal --set call), none in status, resume, next, list, models or for the owner, none and no line in a loop whose goal has Model lines, the row gone once lines exist, one closing line at the next lease, offered again only after the lines are gone and another lease; the pinned 6.1.0 and 6.2.0 readers read list, status, next and queue and the format stays 1. Rule stated: the row stands while the last such line is 'offered' and the goal has no Model line; a view writes nothing. Not shown under an external scheduler. Tests that lease in a loop with no Model line and read the exact rows were given Model lines in their goal
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs · **saw:** tests 1508 pass 1486 fail 0 skipped 22

Ruling ask-019 (ratify): yes: Krzysztof chose to keep the offer in the answer of the lease command, once, with no row in the views (an option label, not his wording).
- **ran (history):** cd skills/jarl/scripts && node --test tests/model-offer.test.mjs, written for the lease's answer, on the code before the change · **saw:** the offer was a row of next --as jarl (what models), the lease answer carried none, a free log note in the shape of the remembering line was accepted, and a scheduled loop wrote the line: the cases failed
- **ran (history):** cd skills/jarl/scripts && node --test tests/model-offer.test.mjs tests/next-as.test.mjs tests/lone-agent-review.test.mjs tests/writer.test.mjs tests/liveness.test.mjs tests/sub-issues.test.mjs tests/slices.test.mjs tests/models.test.mjs, on commit d3b8086 · **saw:** pass, fail 0. Rule: the lease that records a model (an agent raised) in a loop whose goal has no Model line and no standing offer says the offer once in its own answer and writes one 'models offered' line; later leases say and write nothing; a lease that finds the lines closes the offer with one line, a lease after they are gone offers again; a lease with no model (an agent working alone), a loop under an external scheduler and a library call say and write nothing; no view holds the offer (next --as, status --as, resume --as, status, resume, next, list, models, report); log refuses a note shaped like 'models offered', 'models offer closed' or 'repo path ... noted' with the lease's or the field call's form, and so does a composer's appendLog; the pinned 6.1.0 and 6.2.0 readers read the loop and the format stays 1. The row of next --as jarl and the Model lines given to the goals of the tests of that list are removed; the lone-agent test runs on its original goal
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on commit d3b8086 (after merging the release branch, green before the fixes too: tests 1547 pass 1525 fail 0) · **saw:** tests 1550 pass 1528 fail 0 skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test tests/library-parity.test.mjs tests/repositories.test.mjs, new cases, with the library's call to the offer switched off and the path note's pattern unanchored, put back after · **saw:** not ok: 'the files differ and the list does not name the difference: lease with a model, offered, second lease with a model, not offered again, lease after the lines are gone, offered again' (the library wrote no remembering line), and not ok: 'a free note that holds the words of the line which remembers the path note does not stand for it' (the note was not said)
- **ran (history):** cd skills/jarl/scripts && node --test tests/library-parity.test.mjs tests/models.test.mjs tests/repositories.test.mjs tests/model-offer.test.mjs tests/record-contract.test.mjs · **saw:** pass 136 fail 0 on the first run and 67 of 67 in models after the case order was fixed. The library writes the same lines as the command line (offered once, not again, closed when the lines appear, offered again after they are gone, nothing under an external scheduler), only the command line prints the offer; composers.md and the parity table say so; record.mjs exports unchanged. The offer reads 'note: <id> is leased with a model and the goal declares no Model line, …'. The path note's line is anchored to the writer's line shape. In a loop with no Model line the first lease says the offer, a later one the spelling, and a lease that is both says the spelling first
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on the tip · **saw:** tests 1552 pass 1530 fail 0 skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1552, pass 1530, fail 0, skipped 22, merge 4e89d0b

