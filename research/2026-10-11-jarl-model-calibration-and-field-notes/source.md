# Field input, as it arrived

Two inputs from a private deployment of Jarl; its origin is not named here. Both were written in Polish. The first, fourteen notes from the coordinator of a loop in another project, reached the architect on 2026-10-11 already translated and abridged by the session that commissioned this study, and is kept as relayed. The second is a distilled field report written for this study from that deployment's own comparison of three models: no project, company, product, person, file or issue number is kept, the deployment's package numbers are replaced by letters, and its counts are kept as the deployment gave them, approximate where it said so. The check of each item against Jarl's code and Althing's templates is in [design.md](design.md).

## 1. Fourteen notes from a coordinator (translated from Polish, abridged, as relayed)

1. There are no criteria for when an issue is `strong`. Suggest a list in the skill and a hint at `new`.
2. There is no example map of tiers to models for popular platforms.
3. Reasoning effort is a second lever the skill does not mention.
4. Weaker models drop formal steps. A standard-tier brief should end with a checklist (verdict recorded with the tool, evidence ran/saw, the evidence file, the full gate), and the skill should tell the coordinator to check it before merging.
5. "Never inherit the coordinator's model on spawned agents" is one sentence in the middle of step 4. Move it to the top of "Which model sits where", and show each agent's tier in the status report.
6. A coordinator recorded a verdict on behalf of a reviewer (`--by reviewer-<NNN>`, the reviewer's own name), and Jarl accepted it as fresh by its name. Consider a "relayed" mark, or a rule.
7. A package was merged before its fresh review (git does the merge). `merged` could warn when the issue has no approve newer than the last round.
8. Issue numbers leak into the repository (code comments, docs, the architecture graph) from worker briefs. The brief should forbid it: the reason in the worker's own words, the number only in the commit message, or nowhere when the loop is outside git. `check` could catch such mentions in a branch's diff.
9. `handoff write` is retired, but the skill still suggests handoff in places. Unify on `resume`.
10. A queue of questions for the owner to answer in the morning: `ask --defer`, with a status view.
11. Reviewers on the standard tier sometimes do not call `review`. The reviewer brief template should end with a bold "You MUST record the verdict with jarl_review".
12. There is no state for "merged, gate red".
13. Workers read "write the evidence file <path>" as "check the file" when the folder is missing. Say "create the folder and the file".
14. Three review rounds ended well, but one round was spent discovering that a security fix had switched production mode off in tests. The brief for the reviewer of a fix could ask "did the fix weaken something that worked?".

## 2. Three models as workers and reviewers: a distilled field report (translated from Polish)

**The setting.** About 35 packages of work in one loop over two days, on three models of one provider: Claude Opus 5.5, Sonnet 5.5 and Haiku 5.5. The coordinator ran on the strongest model and checked every result itself (the diff, the tests, the full check). The first wave ran on the strongest model because spawned agents inherited the coordinator's model; then the mid model took most work, the strongest kept the hard tasks, and finally the light model was tried as worker and reviewer.

**The deployment's own caveats.** The sample is small and unequal: the strongest model got the hardest tasks (the first wave, unknown causes, design), the mid model well-described execution, so rounds are not a clean comparison of models. Reviewers were at first of the same class as the workers. Cost is not split by model; only a weekly meter exists. Part of the counts come from the coordinator's memory and are approximate.

**Strongest model as worker.** About 11 packages; about 8 passed their first review; one came back after 3 rounds, one after 2, one minor. Formal reliability very good: evidence descriptions always present, before and after captures, tests added. Two of its packages introduced unstable tests that showed only after the merge, as two red full checks the review had not caught. Used later where the cause was unknown: in both cases (packages F and G) the "flaky test" was a real defect in the application, reproduced only by a test that forced the bad path, and both passed their first review.

**Mid model as worker.** About 15 packages; about 13 passed their first review; one came back after 1 round, one after 3. Formal reliability worse: evidence descriptions missing three times (the coordinator wrote them), a rule's approval missing once until asked, part of a cleanup abandoned once, a reviewer that did not record its verdict (the coordinator recorded it in the reviewer's name), and one use of a command form the repository forbids. Code logic at the level of the strongest model on well-described tasks, at a fraction of the cost. Mid-model reviewers caught real defects (a production safeguard in test doubles, a regression of production mode in tests, a page past the end of a list).

**Light model as worker (five packages, A to E).**

| Package | Worker | Review | Result |
|---|---|---|---|
| A (4 issues) | light, to the end | light: changes, then approve | merged; the review caught stale counts in a README and a gap in clearing a message; one false alarm, caused by the coordinator's own shorthand |
| B (4) | light, to the end | mid: approve in round 1 (the light review was cut off by an outside interruption) | merged with no fixes; the best package of the test |
| C (1) | light, to the end | light: changes, changes; then mid: approve | merged after 3 rounds; the cause was found correctly, but each fix left a new gap next to it |
| D (5) | light, cut off by the outside interruption; finished by the mid model | mid: changes, then approve | merged; the mid model had to judge and finish uncommitted work |
| E (8) | light, cut off; finished by the mid model | mid: approve | merged; two of the light model's solutions (a layout at one width, a bottom bar) were wrong and were redone |

The light workers delivered 3 of 5 packages to the end, with complete evidence and without being reminded. Three times (C, D, E) a light worker came back with a report "in progress" instead of waiting for the full check in the queue; the instruction "wait until the end, do not report before the result" helped. Small changes outside scope, reported openly.

**Light model in other roles.** Exploratory testing of five areas (five testers and five checkers, about 420 clicks): findings that almost all reproduced when a second agent checked them; suspicions marked as suspicions; checkers able to say "not reproduced". Filing from notes: 21 issues in four minutes, duplicates merged, out-of-scope items left out, one omission. A read-only study of a platform question: three main claims checked by the coordinator and true.

**Light model as first reviewer.** In the last batch, four packages done by the mid model were reviewed first by the light model and then by the mid model: the light reviewer returned changes in 4 of 4 and was right on at least one Important point each time (a promise in a scenario with no assertion behind it, missing before and after logs, a documented fix that did not work when tried, a wrong description of secrets, three real gaps between scenarios and tests); the mid reviewer then approved. Earlier, two light reviews of package C each found further real problems (an undo step missing for a change of trust, a script writing files its own text said it would not, a test that read generated files and would fail on a fresh checkout). Two false alarms in about six light reviews, both caused by the coordinator's shorthand.

**The deployment's conclusion.** Light model: exploratory testing, filing, read-only studies, the first review of every package, and workers on clear-scope tasks with no layout and no security. Mid model: visual tasks, finishing someone else's work, reviews of packages that touch security or data, the second review after a changes. Strongest model: unknown causes, design, coordination. Every brief to say "wait for the full check's result, never report in progress" and "record the verdict with the tool".
