# First principles, written before any reading

This note was written before any source was opened. It is kept unedited as the record of what the author believed at the start, so that the README can show what the research changed. Everything here is judgement.

## What organising work is for

Organising work exists because one mind cannot hold the whole of a job, and because the job changes as it is done. If a single reliable participant with unlimited memory could do everything, there would be nothing to organise. Every mechanism of organisation is a payment for one of a few limits. A mechanism that does not pay for one of them is waste.

## The fundamental problems

1. **Nobody knows exactly what is wanted.** The person who owns the outcome holds most of their wishes tacitly and discovers them on seeing results. A specification is a guess at those wishes. Any system that treats the written request as the truth will faithfully build the wrong thing.

2. **Plans are hypotheses.** What needs doing is discovered by doing it. A plan that cannot change cheaply becomes a lie that people keep reporting against.

3. **Dividing work creates seams, and seams are where the work fails.** Every cut makes two things that must later fit. The cost of a cut is the information that must cross it. Cuts are good when little must cross and bad when much must cross. Most of the cost in large work is here, and it is mostly invisible.

4. **Nobody's word about their own work can be trusted, and this is not a moral problem.** People and agents see what they intended, not what they did. Agents add a new failure: they produce fluent assertions of success regardless of whether they succeeded. So a report of "done" carries almost no information. What carries information is something another party can repeat.

5. **Checking can fail silently.** A checker that passes everything looks exactly like a checker working on good work. Most organisations therefore do not know how good their checking is. This is the deepest measurement gap I can think of.

6. **Beliefs go stale.** "This works" was true of some exact state of the world. The world moves. Most records of status keep saying "done" long after the thing they describe has changed underneath them.

7. **Parallel work collides.** Shared state means conflict. There is a limit to how much concurrency a given degree of coupling allows, and past that limit, adding participants makes things slower.

8. **The scarcest resource is the owner's attention, and it arrives in bursts with long gaps.** The owner is a very slow, very expensive, intermittently available server. Each question costs them, each unasked question risks a wrong direction, and work that stops while they are away is waste.

9. **Participants vanish, and with them whatever was only in their heads.** For agents this is the normal case: every session is a new hire on their first day. Whatever must survive must be outside any head.

10. **The organisation itself drifts.** Rules accumulate, each from a real scar, and are never removed. Measures get gamed. Ceremony grows until the ceremony is the job.

## What is different when the workers are AI agents

- **Producing has become cheap and believing has become expensive.** Human organisations were built around the scarcity of doing. If doing costs little, the bottleneck moves to knowing what is wanted, checking what came back and fitting it together. A system optimised for dispatching work is optimising the wrong thing.
- **Attempts can be thrown away.** Humans cannot be asked to redo a week's work from scratch for a slightly better result, but an agent can. Restarting from clean with what was learned may often beat repairing. Running several attempts and keeping one is possible. No human organisation had this tool.
- **Agents can be cloned but their errors are probably correlated.** Three copies of one model are not three opinions.
- **Agents hold no reputation unless the system gives them one**, have no fatigue, do not save face, but do please whoever is asking.
- **Every restart is a handover.** So handover is not an edge case. It is the central operation, and its quality can be tested: start a fresh agent with only the record and see what it can do.

## What any solution must get right

1. **Track what is true and how we know, not what is being done.** I suspect the primary object should not be a task (an activity) but a statement about the product that someone wants to be true, along with what would demonstrate it. Activity is then derived from the gap between what is wanted and what is shown. Tasks become disposable.

2. **Make "done" a repeatable result tied to an exact state**, so it can be recomputed and so it expires when what it depended on changes. Status should behave like a build cache: valid only for those exact inputs.

3. **Keep track of why each belief is held**, so that when an assumption falls, everything resting on it is flagged. Status systems record conclusions and throw away the reasons.

4. **Separate who does from who judges, and limit what the judge is told** so it is not anchored by the doer's story. Better still, fix the test of success before the work starts, in hands other than the doer's.

5. **Measure the checkers by feeding them known faults.** Do it all the time, in the normal stream, without telling them. The result is the only honest figure for how much a "pass" is worth.

6. **Treat the owner's attention as a budget.** Every question must compete for it. Rank by what the answer would change, per minute of their time. Each question carries a default that takes effect if unanswered. Learn from every answer so the same question is not asked again.

7. **Give authority according to reversibility and blast radius, not rank.** Then actively manufacture reversibility so that fewer decisions need a human.

8. **Pace the starting of work to the rate at which work can be believed and joined**, not to the rate at which it can be produced.

9. **Assume crash, make everything restartable**, keep no state in any participant and let every claim on work expire by itself.

10. **Cut along the lines where little must cross.** Keep each piece small enough for one participant to hold in mind and cheap enough to verify. If you cannot say how a piece would be checked, it is not yet a piece of work. It is a question.

11. **Make ceremony proportional to risk, and zero when risk is zero.** A one-line fix must not pay for a platform.

12. **Treat every mechanism as a hypothesis with a price.** Each one states what it is supposed to catch and earns its keep or expires.

## How anyone could tell

The measure that matters is not throughput. It is the outcome as the owner would judge it with hindsight, per unit of the owner's attention and of money. A system is better only if it wins against a plain baseline, one strong agent with a good description of the job and continuous integration, on seeded and real work, with known faults injected, and with participants killed at random. If it does not beat the baseline, then it is ceremony.

## Hypotheses I expect the research to attack

- Several attempts and picking one might waste money, because picking well requires the very checking capacity that is scarce.
- Seeding faults may only test for faults like the seeds.
- Rich records of reasons might cost more to keep than they ever return.
- "Claims rather than tasks" may be a change of vocabulary with no measurable effect.
- Asking agents for confidence may yield noise.
- Multi-agent structure may be worse than one good agent for most work; the correct design may be mostly "don't".
