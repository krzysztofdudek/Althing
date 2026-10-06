# Critique of design v1 (issue 459): the economics of one-person maintenance and product coherence
*Translated from Polish for Althing on 2026-10-06. Paths and references to private material were rewritten neutrally; the original is not public.*

The design is intellectually sound. In many places it is right against the rulings, for example in rejecting ports 442–444, in deferring Horde's MCP and in making Grain conditional. Its flaw is the opposite of the one it cures: instead of a rebuild in 6.1.0 it proposes two parallel rebuilds in 7.0 (Runes and Horde's convergence). Along the way it introduces so many new maintenance surfaces that the 7.0 plan is bigger than the one that was stopped in 6.1.0.

## 1. Cost against capacity

**1.1. Critical, §12.2 (the whole 7.0 plan). The 7.0 plan does not fit what one person can do.**
- **Problem.** I count on the design's own scale: S is about 0.5 days, M about 3 days, L about 7 days.
  - Phase A: about 3.5 days.
  - Phase B: about 18 days.
  - Phase C: about 9.5 days.
  - Phase D: about 19 days.
  - Phase E: about 2 days.
  - In total about 52 working days of pure work. That leaves out reviews, ratifications and the 11 decisions in §14.
  - The 6.1.0 loop showed how such estimates grow. "A few weeks" for 441–449 ended with the number of issues doubling in 11 days. Realistically 7.0 is 3–5 months. For all that time the public family stands on 6.1.0.
  - On top of that come the fixed costs: a fifth repository with CI, a Node 18/22/24 matrix, npm publishing and a smoke job across repositories.
- **Fix.** 7.0 gets a hard scope budget, written down as a closed list of item IDs at the start of the loop. Everything off the list lands in 7.x. One family number (D6) makes 7.1 and 7.2 cheap, so the design should use that instead of loading everything into 7.0.

**1.2. Critical, §5 and B1–B6 (Runes). Runes is the most expensive and least urgent item, and the design presents it as a "net gain".**
- **Problem.** The arithmetic in §5.7 is inflated.
  - The copies do not disappear. One unguarded copy becomes five places holding the same code: the TS source in Runes, the committed `dist`, the vendored copy in Grain, the vendored copy in Jarl and the vendored copy in Horde, while Yggdrasil gets it from npm. "−284K of unguarded copies" means "guarded copies" in practice, not removal.
  - There are two distribution mechanisms (npm and vendoring), and so two paths to maintain.
  - The `fs`, `cli`, `mcp` and `testkit` modules rewrite the working MCP servers of Jarl and Grain, which already have parity tests. That is pure maintenance economics, with no value for the user.
  - The real pain, that is, the invisible relations race and the duplicated catalogue of 460 cases, is already closed by the S item in §5.9: a resync plus `git diff --exit-code` in Grain's seam job.
- **Fix.** Cut Runes from 7.0.
  - Yggdrasil stays the source of truth for relations.
  - Grain generates its copy from a pinned Yggdrasil commit, and the seam job checks the diff. That is the precursor gate from §5.9, made permanent.
  - Grain runs the catalogue of 460 cases from a Yggdrasil checkout in the seam job, instead of keeping its own copy.
  - The 6k MCP budget (B6) can be done without the adapter.
  - Runes comes back when a third consumer of relations or of MCP appears (the "two consumers" rule applied to Runes itself).

**1.3. Important, §4.1 and D2 (`done-gate`, the format marker, vendoring Jarl's record).**
- **Problem.** D2 (L) means rewriting the setup of Horde's 721 tests and recording the drill afresh, with a new vendor edge Horde → Jarl and a second pin. The value for the user: no duplicated record and an end to the lock races. Those races, however, are already due to be fixed by 450 in 6.1.0.
- **Fix.** D2 goes to 7.x and is conditional (as in the design), but the condition should be twofold: A2 wins, and the convergence has a budget. `done-gate` does not go into Jarl until D2 starts, because without D2 nobody uses it.

**1.4. Important, the question from the brief: what is the minimal 7.0?**
- **Proposal.** The minimal 7.0 that still delivers "blocks and the composer" is:
  - A1, that is, the loop metrics;
  - A2 in a better version (point 4.1 below);
  - C1, that is, merge drivers, without `union` on structured files (point 6.2);
  - C3, that is, `decide --area` and the list at close;
  - C4, that is, `yg owner --files`;
  - the relations gate through the seam job instead of Runes;
  - E, that is, the canon: Jarl in the core at 7.0.0, the "will not grow" lists, the new message, the trust doctrine.

  In this release Horde stays the composer with its own record, because the composer does not have to stand on a vendored Jarl to be the composer. Estimate: about 12–15 days instead of about 52.

## 2. The product story

**2.1. Important, §9 (the "doors" sentence). The sentence is neat, but it raises a question to which the design itself answers "unmeasured".**
- **Problem.** The sentence reads: *"Horde is the loop with the law switched on"*.
  - The 6.1.0 coordinator had exactly this setup: Jarl plus `yg check` in the `repo-check` hook plus CI. A newcomer reads the sentence as "Jarl + a Yggdrasil hook = Horde" and concludes that Horde is redundant.
  - The sentence does not say what Horde actually does: it lays the mission out onto the graph before the work, lands through a gate and turns what the mission learned into law.
  - The claim "true today and under every variant" does not hold literally, because today Horde is not a Jarl loop.
  - The sentence also diverges from the company metaphor in VISION.md (Horde is the software house, Jarl the foreman). Two metaphors on one page are drift.
- **Fix.** Name what Jarl with a hook does not have: *"Horde plans the mission onto the law before anyone writes, lands every change through a gate no agent can argue with, and turns what the mission learned into law."* Keep the company metaphor in VISION.md as the only one.

**2.2. Minor, §9 (the "entry by pain" table).**
- **Problem.** The row "a mission that has to stay in the law" describes a solution, not a pain.
- **Fix.** Write it as a pain: "a task too big for one head to lay out up front, in a repository that already has law". The rest of the table is good, and more honest than "Grain first".

**2.3. Important, §12.2 (no plan for the story in case Horde loses).**
- **Problem.** VISION.md gives Horde the row "mission → work". If A2 comes out badly or inconclusive, the design shrinks only the code (no D2). It does not say what then happens to the canon and the thesis.
- **Fix.** Write down in advance a variant of the canon for every outcome of A2. If it loses, Horde stays "an experimental composer" and Jarl takes over the stage row. The honesty of VISION.md ("built today vs where it's going") requires it.

**2.4. Minor, §2.5 and §5.8 ("Runes is not a family member").**
- **Problem.** For the user this is true. For the owner, Runes is a member in every respect: it has CI, releases, pins, a step in the release skill, and it shows up in Yggdrasil's `dependencies`, visible on npm.
- **Fix.** If Runes stays, write in the tool map (`family/map.md`): "not a family member for users; a sixth repository for the maintainer".

## 3. The trust doctrine and the consent-by-reach rule

**3.1. Critical, §4.3 (the proposed sentence for VISION.md). The sentence is false for Jarl in a repository with no check.**
- **Problem.**
  - The canon says outright today that Jarl runs "with no law and no landing gate". The "mechanical gate" of Jarl's merger is *the repository's check, if there is one*. In a repository with no tests and no Yggdrasil the only threshold is the approve, that is, testimony.
  - So the sentence *"decided by a mechanical gate in both doors"* promises something the lighter door does not guarantee.
  - The 6.1.0 data (17 fresh reviews out of 221, and 119 self-reviews) show that even "freshness" has so far been a declaration.
- **Fix.** A conditional sentence: *"Where the repository has a check, it decides what lands, in both doors; a fresh reviewer can only stop a change, and its word is recorded as testimony. A Jarl loop in a repository with no check lands on testimony alone, and says so."* A1 has to count the share of fresh reviews mechanically. Without that the doctrine is a declaration.

**3.2. Critical, §6.2 (the rule "type: client, node: agent"). The rule is coherent, but in the owner's practice it voids the main thesis of VISION.md.**
- **Problem.**
  - The owner works almost exclusively on types, so the agent raises almost no law "freely". The rewritten text of VISION.md ("within its territory, law is raised freely") stays formally, but in reality it applies to a unit the author does not use. The design admits this in one sentence and moves on, yet it is a change of thesis, not a footnote.
  - Fact 11 is prose in prime ("Changes require user confirmation"), not a mechanism. The rule is an instruction to the agent, not a behaviour of the tool.
  - §6.2 resolves only a type's *decisions* (the log). It does not say what happens to a type's *rule*, that is, an aspect in `yg-architecture.yaml`. If the agent writes it in at once, the rule is enforced without consent. If it does not, the loop does not enforce it, because a ruling is not enforced.
- **Fix.**
  - Add a rule for type rules: until ratification they live as an aspect in advisory status (`advisory`), and ratification hardens them. This is acceptable in an autonomous loop, because nothing blocks and the law works at once.
  - In VISION.md, write honestly that in a graph made mostly of types the agent *proposes* and the client *accepts in a batch*.

**3.3. Important, §6.2 and §6.4 (ratification in a batch). "One list, one yes" with a loop the size of 6.1.0 becomes a rubber stamp.**
- **Problem.** Consent given by rubber stamp is theatre. The design also does not say what happens when the owner does not ratify. Does closing the loop stall then?
- **Fix.**
  - The batch has a limit, for example 10 items, ordered by reach (the number of the type's files).
  - Every item can be rejected cheaply.
  - A missing ratification never blocks `close`: unratified rulings stay in `decisions.md` and do not enter the vocabulary.
  - Everything above the limit drops out by default.

## 4. The A2 benchmark

**4.1. Critical, §12.2 (A2). In its current shape it is theatre: n=1, a biased baseline and a threshold on single-digit numbers.**
- **Problem.**
  - The baseline is different tasks (Yggdrasil packages from 6.1.0), from a different period, possibly on a different model, in a tired loop.
  - The operator is Horde's author, who knows what is being tested.
  - "Rework within 7 days" over 8–15 tickets is a difference like 3 versus 2, so the "≥30%" threshold is noise.
  - "Cost ≤1.5×" has no defined unit.
- **Fix.** A minimal but real design:
  1. **Replay with known ground truth.** Take 8–10 Yggdrasil tickets from 6.1.0 that have *known* later defects (follow-ups or reopenings). Replay them with Horde from the same base sha. Metric: whether the gate or the architect caught the known defect before landing. That gives ground truth without waiting 7 days.
  2. **Pairs on new work.** Match the 7.0 items into pairs by size and area, and assign them at random to Horde or Jarl. Both loops run at the same time, on the same model and repository.
  3. **Main metric: owner minutes per ticket.** That is the scarce resource. Secondary metrics: red CI after merge, and a blind assessment of the diffs by a fresh reviewer (Opus) who does not know where a diff came from.
  4. Write down in advance that an "inconclusive" result means no D2.

## 5. The 6.1.0 stop rule

**5.1. Critical, §12.1. The rule will not force convergence, because it leaves four loopholes.**
- **Loophole 1: condition 3.** "Text contradicting behaviour", given the acknowledged drift between knowledge and code (`code-docs-conflicts`), is a bottomless source.
- **Loophole 2: condition 2.** "Wrong result" lets a feature be dressed up as a bug.
- **Loophole 3: priorities.** P1–P2 are assigned by the coordinator alone, so it steers its own exit condition.
- **Loophole 4: the metric.** A drop in the number of open issues can be achieved by pushing issues over to 7.0. "Two days of growth, so the coordinator asks" contradicts the "stop asking" (translated from Polish) mandate and stops nothing.
- **Gap in the rule: work in progress.** The rule does not say what happens to the 17 in-progress items that do not meet the criteria (the risk of "since it's started, we'll finish it"). Nor does it say what happens to the reviewers' follow-ups (for example 456–458), which are the main source of growth.
- **Fix.**
  - **A frozen list.** After triage the list of IDs is closed. Every *new* issue in 6.1.0 needs the owner's word per issue, which reverses the default answer.
  - **Condition 3 narrowed** to README, prime and SKILL. Drift in internal knowledge goes to 7.0.
  - **Follow-ups** go to 7.0 by default.
  - **In-progress items that do not meet the criteria** are dropped or deferred, not finished.
  - **A cut-off date.** After it, class-2 bugs go to 6.1.1 instead of blocking the release.

## 6. The owner's daily life

**6.1. Important, §5.5, §4.2 and §3.2 (more pins and more places to check).**
- **Problem.**
  - Five pins: `runes.pin.json` in Grain, Jarl and Horde, `jarl.pin.json` in Horde and an exact npm version in Yggdrasil, plus an assertion at release time. Every fix in Runes means one tag, four bump commits and four CI runs.
  - On top of that, `words.allow` files in five repositories, `.runes/` directories, `FORMAT`, `done-gate` in the profile and the local `merge.<name>.driver` configuration in every clone. Fresh clones and CI do not have it.
  - The 6k limit in CI will block adding a tool at the least convenient moment.
- **Fix.** Cutting Runes (point 1.2) removes four of the five pins. Make the MCP budget a warning in CI, not a block.

**6.2. Important, §2.7 and C1 (`merge=union`).**
- **Problem.** `union` on Jarl's `decisions.md`, where rulings are blocks with supersession, produces no conflict but a *silent wrong result*: the interleaved lines of two blocks. That is exactly the failure §2.7 wants to avoid. The same can happen with `CHANGELOG.md` around version headings.
- **Fix.** `union` only for files in which every line is a separate entry, that is, append-only logs. `decisions.md` needs its own driver or a plain conflict. Before C1, count what share of the manual conflicts in 6.1.0 concern these files at all. The design itself admits that "80% is a hope".

**6.3. Important, §14 (eleven decisions at once).**
- **Problem.** The design alone runs to 678 lines and eleven owner decisions. That is a decision load in the same week in which the owner wants to finish the release.
- **Fix.** Take three now: the stop rule, cutting or deferring Runes, and the design of the benchmark. The other eight at the boundaries of the 7.0 phases, each one when it blocks work.

**6.4. Minor, §3.4 (one number).**
- **Problem.** A standalone Jarl user will jump from 0.2.0 to 7.0.0, and then see bumps with no changes in Jarl.
- **Fix.** Acceptable, but for such releases Jarl's CHANGELOG has to say outright "no changes in Jarl", so as not to generate questions.

## The three most valuable cuts or changes

1. **Cut Runes from 7.0.** The relations gate stays as Grain's seam job with a diff against a pinned Yggdrasil commit, and Grain runs the catalogue of 460 cases from a Yggdrasil checkout. That takes off about 18 days, the fifth repository and four of the five pins, without losing any real value.
2. **Tighten the 6.1.0 stop rule.** A frozen list of IDs, every new issue on the owner's word, condition 3 narrowed to README, prime and SKILL, follow-ups and non-fitting in-progress items to 7.0, a cut-off date and a 6.1.1 path. Without this the loop will not converge a second time.
3. **Rebuild A2 as a replay with known ground truth plus pairs on new work, with owner minutes as the main metric.** Write down in advance the variant of the canon and of VISION.md for every outcome. Move Horde's convergence (D2) to 7.x regardless of the outcome, so that the minimal 7.0 has about 12–15 days of work and actually ships.
