# The request

The session that directs Jarl's design relayed the owner's request on 2026-11-08. This file keeps it as it arrived, before anything else was written. The owner's words are translated from Polish by that session; the rest is that session's wording, which the owner agreed to where it says so.

## The owner's words

Krzysztof, 2026-11-08 (translated from Polish, as relayed): "Jarl is dedicated to agents, but what has been built until now was, in my view, primitive. Jarl is to be a machine for a project of any scale. Yggdrasil gives the structure. Jarl gives the organisation of work."

The relaying session adds that he wants Jarl 6.3.0 to be world class, and the work loop it runs to be better than anything built so far for organising the work of agents or of people.

## What "perfect" means

The owner agreed to these seven marks. The wording is the relaying session's.

1. The loop does not stand when the owner is away: he is asked only what is his, and nothing else blocks.
2. Any agent can be replaced at any moment (compaction, crash, restart) from the record alone.
3. Nothing lands without evidence and a fresh reviewer, and defects surface as early and as cheaply as possible.
4. Cost fits the work: light models in packages for small things, the strongest only where a mistake is expensive, few wasted rounds.
5. An agent reads little, briefs come complete from the tool, every refusal ends with a form that can be executed, and a wrong guess after a refusal is a defect.
6. The record tells the truth and every view agrees.
7. It is measurable: calls, refusals, rounds and cost per issue come out of the record, so improvement is shown by numbers.

Not "perfect": zero friction everywhere; mechanisms that change nothing (the owner's rule: no creeping overengineering, and always say what exactly is lost by not doing a thing); a new record format in every release.

## Decision rights

The owner added a point: who decides what, at every level (the owner, the jarl, a coordinator, a worker, a reviewer, the merger, and a lone agent that holds every role). It was designed before but is scattered across the research of 2026-11-03 (report sections 2 and 3), the skill's rules that never bend, the jarl reference, the ledger of rulings and AGENTS.md sections 6 and 7. The design chose on purpose to have no permission table by level, because Jarl cannot verify who an agent is, so protection sits in the done gate, the fresh review and the owner-only lines. The request: judge whether the model is complete, consistent and cheap for an agent to apply; say where a real loop would get stuck or decide something that was not its to decide; propose one table of who decides what, built on what is already decided; and say what the tool must enforce and what is only guided.

## Scale and the family

The loop must work for one agent on one repository, for a team of dozens of agents on many repositories over weeks, and for a human organisation using the same record. Yggdrasil provides the architecture graph and the rules of a codebase; Jarl provides the organisation of work. The request asks what Jarl needs from Yggdrasil and from the other family tools (Grain, Ratatoskr, Urd, Researcher), and what it must not take over.

## What to deliver

A concept for the owner to approve before any task is written: the principles drawn from the world's best practice and which of them 6.3.0 already honours; the model of the loop end to end (roles, decision rights, the flow of an issue from filing to merge to release, how it scales, how it recovers, how it is measured); the list of what is to be done beyond the backlog, each item with what it is, why, what is lost by not doing it, whether it needs a new record format and a recommended label (6.3.0, next version, or do not do), ranked by how much it improves a real loop; the places where this disagrees with 6.3.0 or the backlog; and a critic's strongest objections with their answers. No task is filed until the owner approves.
