# Command, decision rights and reliable organisations: what the field says for an agent loop

Written on 2026-11-08 by a research agent (Opus 5.5 at xhigh) from public sources, for the question of this folder. Kept as it reported. Applications to an agent loop are its inference; none of these sources tests agents.

**Evidence note.** The official 2019 ADP 6-0 PDF was unreachable, so its content comes from the Combined Arms Center summary and quoting pages. Marked sources were not opened. Agent-loop applications are my inference; none of these sources tests agents.

## 1. Principles

1. **State purpose, end state and limits; leave the method open.**
   - Why: orders cannot foresee change. Moltke: "The higher the authority, the shorter and more general will the orders be."
   - Loop: each goal and issue carries purpose, end state, key tasks with reasons, constraints, antigoals (Klein) and where risk is accepted (JP 3-0). The owner's words pass down verbatim.
   - Limit: intent goes vague and "rarely gets reviewed and updated", so version it.

2. **Verify that intent arrived.**
   - Why: a correct format still produced 34% matches (section 3). Those who matched went back to the intent text.
   - Loop: before its first change, a worker records purpose, stop conditions and what it will not touch. The brief includes intent two levels up. On any surprise it rereads the intent.
   - Limit: fluent restatement proves parsing, not judgement. Add one "what would you do if X" case.

3. **Tie the right to decide to reversibility.**
   - Why: one-way doors need deliberation; two-way doors "should be made quickly by high judgment individuals or small groups".
   - Loop: a two-way door inside own files and intent means decide and log. The owner enumerates the one-way list, and unknown counts as one-way.
   - Limit: whoever wants to proceed misjudges reversibility.

4. **Publish a delegation level per decision area.**
   - Why: the level differs by area and rises with demonstrated maturity (seven levels, delegation board).
   - Loop: the mandate is an area-by-level table in the record, injected into briefs. Raise a level when ratify items keep passing unchanged.
   - Limit: boards go stale. Review on a fixed event.

5. **One decider per decision, one superior per agent.**
   - Why: each person reports to one person (NIMS). "The one person (yes: one!)" (DACI).
   - Loop: every decision names its decider. A reviewer holds an Agree role on one question only, outside the reporting chain.
   - Limit: RAPID says Agree roles are "assigned sparingly", because they multiply.

6. **A veto carries a reason and gets answered, not outvoted.**
   - Why: "A veto without a justification is invalid" (Apache). "It's the existence of the unaddressed open issue, not the number of people" (RFC 7282).
   - Loop: "changes requested" names a defect and its evidence. A finding closes by fix or written answer. After two bounces, escalate: otherwise "the default dispute resolution mechanism… is exhaustion".
   - Limit: this needs a competent judge, and a model can be argued out of a correct finding.

7. **Silence may authorise only what can be undone.**
   - Why: lazy consensus works because the notice is public and the wait is long enough.
   - Loop: announced intent with a deadline, for two-way doors. Before a one-way door, run a final comment period that cancels on substantial new argument.
   - Limit: with the owner away, silence is guaranteed. Label it delegated authority, never assent. Apache bars lazy consensus for review-then-commit code.

8. **Filter at every level; let alarms bypass.**
   - Why: the top sees little (Linux, section 2), but "the person with greatest knowledge… might not be the person with the highest status".
   - Loop:
     - The owner writes a closed "tell me if" list, each item tied to a decision he would make (CCIR).
     - An escalation goes one level up, with options, a recommendation, a default and a deadline. Coordinators resolve or batch.
     - Any agent may file a stop signal directly; a signal is not a decision.
     - Measure the share of decisions that reach the owner.
   - Limit: filtering hides weak signals, so near misses go up as aggregates.

9. **Add layers only when span fails, and keep chains short.**
   - Why: ICS organisations grow modularly. Unassigned functions default to "the next higher supervisory position".
   - Loop: start near 1:5, measured in reports the supervisor can actually read within its context. Keep to two or three levels.
   - Limit: 1:5 is a human guideline, and NIMS says practice "frequently" differs.

10. **Separate roles; one writer per system.**
    - Why: "a clear separation of responsibilities allows individuals more autonomy". The cautionary case is freelancing, a well-meant uncoordinated change.
    - Loop: only the merger writes the target branch, and only the jarl records rulings.
    - Limit: each split adds a handoff. In a one-agent loop the roles stay with one holder, and the record should say so.

11. **Handover is a procedure with a read-back and a named instant.**
    - Why: FEMA requires a complete briefing, face to face where possible, and the effective time told to all. SRE: "You're now the incident commander, okay?", then stay until firm acknowledgment.
    - Loop:
      - Generate a brief from the record using ICS 201 blocks: situation and hazards, objectives, current and planned actions, organisation (leases), resources on order.
      - Add contingencies and open promises.
      - The incoming agent synthesises it back, and the record logs "command passed at T, acknowledged".
      - Until then, the role sits with the next level up.
      - Trigger before context runs out.
    - Limit: a dead agent cannot brief. Keep the record living, as in the SRE incident document, and reconcile it against the repository. A better agent arriving is no reason by itself to transfer (FEMA).

12. **Be preoccupied with failure.**
    - Why: failures are "easier to recover from if they are spotted early". Plans "create the illusion that the plan grasps everything". HRO workers go behind the blueprints, and newcomers catch what old-timers miss.
    - Loop: file near misses (false green, late escalation, a review miss). Check code against the record. Ask each fresh agent what looks wrong.
    - Limit: "few studies report the impact" of HRO principles (AHRQ), and Weick admits these places can be unpleasant.

13. **Redundant checks count only if independent.**
    - Why: Sagan names common-mode error, social shirking and overcompensation.
    - Loop: reviewer of another model, deciding from evidence rather than the worker's conclusion; a machine check at merge; record which layer caught what.
    - Limit: each layer invites the previous one to relax, so test by removing one.

14. **Fast action needs shared orientation and shared words.**
    - Why: Boyd favoured the implicit link from orientation to action; NIMS mandates common terminology.
    - Loop: a fixed status vocabulary across repositories and humans.
    - Limit: fresh agents share no experience, so orientation exists only as injected text.

**Decision rights**

| Holder | Decides | Never |
|---|---|---|
| Owner | Purpose, end state, mandate table, one-way list, whole-type rules, acceptance | Two-way doors inside the mandate |
| Jarl | Priorities, splitting, assignment, cross-slice conflicts, mandate decisions (filing ratify items) | Act on his reserved list; do hands-on work |
| Coordinator | Sequence and allocation inside its slice | Change slice boundary or goal |
| Worker | Method inside scope; files new issues; stops on a stated limit | Touch others' branches, widen scope |
| Reviewer | Approve or reject against the brief, with reasons | Merge, set scope |
| Merger | Merge order; runs the check | Override the check, judge content |

## 2. Numbers

| Finding | Denominator | Source |
|---|---|---|
| Responses matched intent: 34% by researchers' count, 53% by battalion commanders' own | 11 and 17 of 32 episodes, four battalions (researchers reclassified six) | Shattuck and Woods |
| Purpose present in 19% of intent statements; length 21 to 484 words | 35 statements per Rolls; another source says 97 | Klein via Rolls |
| Patches chosen directly by Linus: 112, about 1.3% | Over 9,500 patches, kernel 2.6.38 | kernel docs |
| Kernel chain length "rarely exceeds two or three links" | About 2,000 developers a year; about 13,000 changesets a release | kernel docs |
| Medical errors 24.5 to 18.8 (−23%); preventable adverse events 4.7 to 3.3 (−30%) | Per 100 admissions; 10,740 admissions, 9 hospitals; pre-post design; significant at 6 of 9 sites | I-PASS |
| Oral handoff time 2.4 to 2.5 minutes | Per patient, P=0.55, no significant change | I-PASS |
| Optimal span 1:5, a guideline; 3 to 7 in FEMA course pages | No denominator | NIMS; FEMA pages (not opened) |
| Lazy consensus usually 72 hours; a release needs at least three binding +1 and more + than − | Per vote | Apache |
| Final comment period 10 calendar days, at least 5 business days; all subteam members sign off | Per RFC | Rust |
| Decide at about 70% of the information you wish you had | Heuristic, no data | Bezos 2016 |
| Top-quintile decision scores: 5 to 6 points better returns and growth | 760 executives, self-reported, halo risk | CFO on Bain |
| Declare an incident if a second team is needed, customers see it, or it is unsolved after an hour's analysis | Rule, no data | SRE |

## 3. Anti-patterns

- Using the one-way-door process for everything ("slowness, unthoughtful risk aversion"), or two-way treatment of irreversible steps.
- Intent restating the task list ("a statement, not a format"), or paraphrased at each level.
- Fixation on the technical problem while nobody holds the whole picture.
- Heroic freelancing outside the coordinator's knowledge.
- Holding a plan so detailed that agents wait for instructions when reality departs from it, as the operators did in Weick's control room.
- Multiple deciders, too many consulted, matrices never revisited. For RACI I found practitioner guides only, no primary research.
- Disagreement settled by stamina or by counting reviewers.
- Requirements nobody can meet, which breed false reporting: "much of the deception… is actually encouraged" (Wong and Gerras). The loop equivalent is evidence fabricated to clear a gate.
- Adding reviewers as a cure, which invites shirking.
- Bare status updates sent upward without a recommendation.
- Handover by summary with no read-back, and no moment when command visibly passes.

## 4. Sources

- https://www.army.mil/article/225414/combined_arms_center_launches_new_mission_command_doctrine — 2019 mission command definition
- https://en.wikipedia.org/wiki/Intent_(military) — JP 3-0 and FM definitions, two echelons down, static intent
- https://www.mca-marines.org/gazette/commanders-intent-defined/ — two levels up; "a statement, not a format"
- https://archive.smallwarsjournal.com/node/125618 — Moltke quote; vagueness
- https://coloradofirecamp.com/safety-drill/commanders-intent-study.htm — Shattuck design and results
- https://www.canada.ca/en/army/services/canadian-army-journal/articles/2025/short-bursts-rolls-commanders-intent-redux.html — Klein and Shattuck figures
- https://www.fema.gov/sites/default/files/2020-07/fema_nims_doctrine-2017.pdf — NIMS characteristics, 1:5, default upward
- https://training.fema.gov/emiweb/is/icsresource/assets/Transfer%20of%20Command.pdf — transfer procedure
- https://training.fema.gov/EMIWeb/IS/ICSResource/assets/ICS%20Forms//ICS%20Form%20201,%20Incident%20Briefing%20(v3).pdf — ICS 201 blocks
- https://emilms.fema.gov/is_0230e/groups/165.html — span 3 to 7 (page now returns not found; snippet only)
- https://sre.google/sre-book/managing-incidents/ — roles, handoff, living document, freelancing
- https://pubmed.ncbi.nlm.nih.gov/25372088/ — I-PASS (read through the PubMed API)
- https://www.publichealth.hscni.net/sites/default/files/directorates/files/Sense%20and%20reliability%20Karl%20E%20Weick.pdf — Weick on failure and plans
- https://psnet.ahrq.gov/primer/high-reliability — five HRO characteristics, evidence limits
- https://www.bain.com/insights/rapid-decision-making/ — RAPID roles
- https://cfo.com/news/how-well-do-you-decide/669022/ — Bain survey, halo caveat
- https://www.atlassian.com/team-playbook/plays/daci — one approver
- https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm — Type 1 and Type 2 decisions
- https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders — 70%, disagree and commit, escalation
- https://management30.com/practice/delegation-poker/ — seven levels, delegation board
- https://www.apache.org/foundation/voting.html — vetoes, votes
- https://community.apache.org/committers/lazyConsensus.html — lazy consensus
- https://github.com/rust-lang/rfcs/blob/master/README.md — final comment period
- https://www.rfc-editor.org/rfc/rfc7282.html — rough consensus
- https://docs.kernel.org/process/2.Process.html — chain of trust, 1.3%
- https://docs.kernel.org/process/submitting-patches.html — reviewer's statement
- https://press.armywarcollege.edu/monographs/466/ — Wong and Gerras abstract
- https://slightlyeastofnew.com/2012/04/13/boyds-really-real-ooda-loop/ — implicit over explicit
- https://econpapers.repec.org/RePEc:wly:riskan:v:24:y:2004:i:4:p:935-946 — Sagan's three problems (not opened; abstract fragment from search)
- https://www.jcs.mil/Portals/36/Documents/Doctrine/fp/ccir_fp.pdf — CCIR (not opened, refused; definition from search result)
