# 335 · Jarl: one vocabulary and a short glossary in the skill

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/README.md, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/vocabulary.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (cmdTips: role feature for a jarl/ worker branch and release for the checkout branch; the holds-claim profile flag); SKILL.md (user, client and owner for one person; Kind for issue kind, reviewer kind, question kind and kind of task); probe: tips prints "feature jarl/2-a" and "release main"
**After:** 334

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
- Changed: the skill uses one word per concept and holds a short glossary. tips labels worker branches correctly. The check command that measures a branch has a name of its own; check keeps working.

## Evidence

