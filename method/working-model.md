# The working model

How the family is developed: who does what, how far each is trusted, and what stays the owner's. The rules are in the operating doc, `AGENTS.md` (sections 6 to 9). This document holds their reasons and the rulings behind them, cited by slug ([the ledger](rulings.md)).

The family's thesis is that proof replaces trust. The way the family is built is held to the same line: work closes on evidence, never on an agent's word that it is done.

## Roles

| Role | Who | What it does |
|---|---|---|
| the owner | Krzysztof Dudek | decides what the family is and what ships, and is the only person in the loop. In the thesis's terms he is the client: he orders an outcome, judges whether it came out right, and does not run the process |
| the jarl | an agent | directs a release loop: files issues, raises workers, reviewers and the merger, records evidence and rulings, and talks to the owner |
| a worker | an agent, one per package | changes one tool repository on one branch, proves each change with a test that is red before and green after, and spawns nothing itself |
| a fresh reviewer | an agent that neither wrote the change nor runs the loop | reads the change and answers approve or changes, with findings graded Critical, Important or Minor |
| the merger | one agent per repository's merge queue | merges approved branches, runs the repository's check on the merged tip and records the result as evidence |
| a planner, an architect | an agent, read-only | writes a release's plan, or reviews a tool whose format or contract changes |
| a critic | an agent, read-only | attacks a design from one angle, so that its revision has to answer ([research](research.md)) |

## Trust

- **The check decides; a review is testimony** (`conditional-trust`). Where a repository has a check, it decides what lands. A reviewer can stop a change but never make a failing check pass, and its word is recorded as testimony. A loop in a repository with no check lands on testimony alone and says so.
- **A fresh reviewer for all code** (`fresh-reviewer-required`). The agent that wrote a change is the one least able to see what it missed, and the agent that runs the loop wants it closed. Only a reviewer who is neither clears code.
- **Evidence rows.** A piece of work is done when its evidence says what was run and what it printed. A sentence saying it works is not evidence.

## The mandate when the owner is away

The owner is often away. Asking him every question would stall the loop, and deciding silently would take choices that are his. The mandate settles which is which.

- **Quality first** (`autonomy-quality`, continuing `quality-first-mandate`). When he is away the jarl decides and records the decision. At every trade-off it chooses fewer false greens and false reds, fuller tests and a more honest message, even at the cost of a longer loop; the best and truest solution wins, not the cheapest one and not the one where nothing is red.
- **His choices wait for him.** A decision under the mandate that is really his is filed as a ratify item in the same move. It blocks nothing and waits for his word in one batch, the same consent by reach the family builds into its own tools (`consent-by-reach`).
- **Effort is never the reason** (`no-effort-estimates`). Agents do the work, so a cost in days measures nothing. Scope is cut only for quality, risk or truth, and nothing is estimated in days.
- **The way of working is free** (`free-way-of-working`) as long as the evidence, the green checks and the record hold.
- **Every finding becomes an issue** (`findings-become-issues`), filed at once and directly. A finding left in a conversation is gone when the session ends.
- **Neither code nor docs is assumed true** (`code-docs-conflicts`). Both were written by agents, and either can be wrong. A real choice of behaviour is his; an obvious error (a crash, a contradiction, an untrue message) is fixed.

## What stays the owner's word

The list is section 6 of `AGENTS.md`. An act is on it for one of three reasons:

- it cannot be undone, or it reaches the public: a publish, a tag, a push, a merge into a tool's `main`, a deleted remote branch, a GitHub setting, a public comment;
- it is consent that the tools' own law reserves for a person: ratifying a rule that reaches a type, a suppression, a `review_by` change, a change of architecture (`quality-first-mandate` names these as outside every mandate);
- it decides what the family is, or when a release ships (`release-last-on-owner-word`).

A standing permission for one of them is a ruling that names it, never a habit: `ask-012` names Althing's `main`, and a push to a tool repository needs a ruling that names the branch.

## Asking the owner

A question shown to him without being filed in the loop is invisible to the record: the next session cannot see that it was asked, and the loop reports no open questions while one waits. So every question is filed first. It is one topic per turn, in plain words, with two or three options and what each costs, because a question he cannot answer in one reading is a question that waits. While he is away, questions collect in the loop and the work goes on (`questions-wait-for-the-owner`).

His answers are recorded as he gave them, translated ([language](language.md)). When he picked an option, the record names it as a label, so that nobody later mistakes an agent's wording for his.

## Models

Every spawn names its model. A spawn without one inherits the session's model, which may be the wrong one, and nobody notices until the transcript is read. Opus does research, review, design, translation and every content task, because there the quality is the product. Sonnet does cheap mechanical work. An issue's `Tier:` is its model: `strong` is Opus, `standard` is Sonnet.

## Commits

- In a tool repository each issue is its own commit, and a fix a reviewer asks for is a further commit, never an amend. Any issue can then be reverted and bisected alone, and the review's history stays true.
- A worker commits after each stage (red test, green test, documentation), because only a commit survives losing a worktree (`worktrees-outside-tmp`).
- The identity is the owner's in every checkout. An address GitHub cannot link shows as an unknown author.
- A message ends with the harness's attribution line and nothing else. A link to an agent session in a public history points at private context.
- Prose is never hard-wrapped. A wrapped paragraph turns every later edit into a diff of unrelated lines.

## The repository is the memory

There is no agent memory store. A fact kept outside the repository cannot be reviewed, cannot be found by the next session, and drifts from what the repository says. Every durable fact goes to its one home here (`AGENTS.md` section 5 says where), and everything else links to it. Two copies of a fact drift apart, and drift is the failure the whole family exists to prevent.

## Built today, and where it is going

Every document here keeps the two apart. A sentence about something not yet built says so, and a claim nobody has measured says it is unmeasured. Honesty is cheaper than the trust a wrong claim costs.
