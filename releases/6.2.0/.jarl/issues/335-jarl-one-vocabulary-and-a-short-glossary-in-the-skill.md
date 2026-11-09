# 335 · Jarl: one vocabulary and a short glossary in the skill

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261018T2030-lyfk
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/README.md, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/vocabulary.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (cmdTips: role feature for a jarl/ worker branch and release for the checkout branch; the holds-claim profile flag); SKILL.md (user, client and owner for one person; Kind for issue kind, reviewer kind, question kind and kind of task); probe: tips prints "feature jarl/2-a" and "release main"
**After:** 334
**Branch:** jarl/335-vocabulary
**Merged:** b79ef3f41c89563bd734bd63c7bbc41e8778eb1d in ../../../JarlSkill
**CI:** pending

## What
One concept carries several names and one name carries several concepts. The person who rules is the user, the client and the owner. The lease is also the holds-claim profile flag. tips labels a worker branch feature and the checkout branch release, against the skill, where the feature branch is the loop branch. Five things are called check, and the check command, which measures a branch diff and gives no verdict, is not the check that decides landing. Kind means the issue Kind, the reviewer kind (fresh, coordinator, self), the question kind and the kind of task. Horde calls an issue a ticket. The change: owner is the one word for the person who rules; lease is the name, with holds-claim accepted as an alias in a profile; tips labels worker branches, the feature branch and main correctly; the check command gets a name that says it measures scope, with check kept as an alias; issue Kind, reviewer standing and question type are three distinct words; SKILL.md states once that a Horde ticket is a Jarl issue. A short glossary table in SKILL.md defines each concept once. Every MCP tool name, field and flag name that works today keeps working.

## Why
A reader learns a tool through its words; two names for one thing make two things in the reader head, and one word for four things makes every sentence ambiguous. The glossary is the one place the rebuilt skill of 250 can point to.

## Acceptance
- A test: tips on a loop with a worker branch jarl/2-a labels it a worker branch and labels the checkout branch by its role in the skill; the test fails on the base
- A test: a profile declaring holds-claim loads and behaves exactly as one declaring the lease flag
- A test: the renamed scope command and check give identical output, and check prints the alias note
- grep -nwE "user|client" skills/jarl/SKILL.md lists no line that means the owner, and the reviewer and question words are distinct from Kind, recorded as rows
- SKILL.md holds one glossary table; each term in it is defined there once, in the present tense
- The MCP parity test is green and every existing tool, field and flag name keeps working, recorded as a row

## Changelog
- Changed: The skill uses one word for each concept and has a short glossary of them.
- Changed: The person who rules over a loop is called the owner.
- Changed: The claim an issue holds while it is in progress is called a lease. A profile that still writes the old flag name, holds-claim, keeps working.
- Changed: tips labels worker branches as worker branches, and the branch you are on as the feature branch.
- Changed: profile shows lease where it showed holds-claim.
- Changed: The command that measures a branch has the clearer name scope; check keeps working under its name.

## Evidence

- **ran (history):** node --test tests/vocabulary.test.mjs (tips test, before the tips change) · **saw:** fail 1 of 1: the worker branch read as feature, the checkout branch as release; the test expected worker and feature
- **ran (history):** cd skills/jarl/scripts && npm test (after the tips change, commit 806246f) · **saw:** tests 721 · pass 699 · fail 0 — the tips rows of the other suites follow the new labels
- **ran (history):** node --test tests/vocabulary.test.mjs (profile and lease tests, before the lease change) · **saw:** fail 2 of 3: the lease profile is refused as an unknown flag, and no validation message names the lease
- **ran (history):** cd skills/jarl/scripts && npm test (after the lease change, commit b62b3e1) · **saw:** tests 723 · pass 701 · fail 0; a profile declaring lease and one declaring holds-claim print the same transcript
- **ran (history):** node --test tests/vocabulary.test.mjs (scope and check test, before the scope change) · **saw:** fail 1 of 4: check ran as an unknown command, so scope and check printed different things
- **ran (history):** cd skills/jarl/scripts && npm test (after the scope change, commit 203d61f) · **saw:** tests 725 · pass 703 · fail 0; scope and check print the same output, and check alone says on stderr which name to use
- **ran (history):** node --test tests/vocabulary.test.mjs (owner, glossary, kind and history rules, before the vocabulary pass) · **saw:** fail 5 of 9: owner words, standing and type words, history words, the ticket and check words, and the glossary were not yet in the skill
- **ran (history):** cd skills/jarl/scripts && npm test (after the vocabulary pass, commit ef1bbbc) · **saw:** tests 730 · pass 708 · fail 0 · skipped 22; the skill's glossary defines each term once and no line of the skill speaks of the owner as user or client
- **ran (history):** status, resume, next --all, report, list --all, queue, branches, show 335|004|019|334 --full (loop copy, before and after the change) · **saw:** all 12 outputs identical byte for byte; tips on a scratch git repository differs only in one label: release feature becomes feature feature
- **ran (history):** node --test tests/mcp-runes.test.mjs tests/mcp.test.mjs tests/library-parity.test.mjs tests/record-contract.test.mjs tests/vocabulary.test.mjs (MCP parity row) · **saw:** tests 54 · pass 54 · fail 0: the parity of table, usage and tools holds with jarl_check and jarl_scope both listed; record.mjs and its contract test are unchanged
- **ran (history):** node --test --test-name-pattern=glues tests/vocabulary.test.mjs (with a glued word restored, then fixed) · **saw:** red: jarl_ask description carries ownerhas, the test fails; green after the fix (commit 87ed4bf): pass 1 of 1
- **ran (history):** cd skills/jarl/scripts && npm test (round two, on commit 6600658) · **saw:** tests 731 · pass 709 · fail 0 · skipped 22
- **ran (history):** status, resume, next --all, report, list --all, queue, branches, show 335|004|019|334 --full, profile (loop copy, before and after round two) · **saw:** all 11 views identical byte for byte; profile differs only in in-progress: holds-claim becomes lease; tips on a scratch git repository differs only in the label release becomes feature
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge b79ef3f · **saw:** 731 tests, 709 pass, 0 fail, 22 skipped; worker haiku-5.5, two rounds (glued words and an inaccurate changelog found by the sonnet-5.5 reviewer, fixed), approved

