# The vision

*Trust is the bottleneck. Proof is the unlock.*

This is the thesis of the Yggdrasil family. Every repository of the family (**Jarl, Yggdrasil, Grain, Horde, Ratatoskr, Urd, Researcher**, and Runes, the code they share), and the public face that tells its story (the website chrisdudek.com and the GitHub profile), derives from what is written here. The tools are downstream. This is the source they all point back to.

---

## The barrier was never code. It was trust.

For the entire history of software, the price of contributing was the same: you had to be able to read the code. We treated that as a law of nature — of course you must understand the machine to change the machine.

It was never the real barrier. The real barrier was **trust**. You don't let someone who can't read code contribute, because you cannot verify what they — or an agent acting for them — produced. Code-literacy was just the cheapest proxy we had for "I can trust this change": if you can read it, you can review it, so you can be accountable for it.

So the fix is not a smarter agent or a better editor. The fix is to **replace trust with proof** — at every stage, in a form the agent cannot skip. Once correctness is proven continuously and mechanically, the requirement "you must understand the code to contribute" simply dissolves. It was a proxy for trust, and we no longer need the proxy.

## The inversion: intent becomes canonical, code becomes a projection

Normally the **code** is the source of truth, and the *why* — the intent — rots in comments and stale specs. This vision inverts that.

The canonical artifact becomes the **confirmed intent**: what a person wants to be true, read back to them in their own words and agreed. The code becomes a *derived, re-provable projection* of that intent — kept faithful to it by enforced rules, not by someone reading it.

- The human brings **intent and judgment**.
- The agent brings **the code**.
- The rails bring **the proof** that the code still says what the intent meant.

Code stops being the thing you must read in order to trust it. It becomes **proven, not read**.

## Proof, stage by stage

No single gate can carry this. Trust is rebuilt as a chain of independent proofs, each catching a different way an agent quietly ships the wrong thing. The tools are the embodiments:

| Stage | What gets proven | Embodiment |
|---|---|---|
| before there is any law | What a repository already keeps is read off its own code and history, every rule carrying the evidence that produced it and the count of places that already break it, so the first law is mined from proof instead of typed from memory; that law is soft and never blocks, and the rules the code already holds are the argument for hardening some of them. | **Grain** |
| request → intent | The agent understood what you actually asked, in your words; nothing destructive happens without conscious consent. | **Ratatoskr** |
| intent → code | When the spec runs out, the agent asks or consults the source instead of guessing. | **Urd** |
| code → architecture | Every change satisfies the rules that govern it, checked before the agent moves on. | **Yggdrasil** |
| code → measured result | Claims are settled by experiment, not by assertion. | **Researcher** |
| issues → merged work | Everything seen becomes an issue, each issue gets one worker in its own worktree, nothing closes without evidence and a review, and no code closes without a fresh reviewer's word; where the repository has a check, the check decides what lands, and where it has none, the loop says it lands on testimony alone. | **Jarl** |
| mission → work | A mission too big for one head to plan up front is planned onto the law before anyone writes, by an architect who measures with Grain, then worked on Jarl's loop, with agents raised and retired and no standing seats; every change lands through a gate no agent can argue with, and what the mission learned becomes law. | **Horde** |

Said in one breath: Jarl is the loop. Yggdrasil is the law. Grain is the survey. Horde plans the mission onto the law before anyone writes, lands every change through a gate no agent can argue with, and turns what the mission learned into law — on Jarl's loop, with Grain in the architect's hands. As a firm, Yggdrasil is the law, Grain surveys the terrain that law will stand on, Jarl is the foreman — a list of jobs, one pair of hands per job, proof before anything is signed off — and Horde is the software house that runs its jobs through him. Ratatoskr is the account manager, Urd is professional discipline, Researcher is the lab. The client is the one who hires the firm, and the only human in it.

## The core and the add-ons

Yggdrasil is the heart of this: the graph a repository declares, the law it declares over that graph, and the rails that hold its code to both. The core is four tools — Jarl, Yggdrasil, Grain and Horde — and the order you meet them in is decided by what hurts, so you start at the step where it hurts. More issues than one agent can hold in its head: Jarl. An agent that keeps breaking what was agreed: Yggdrasil. Nobody knows what was agreed: Grain, which earns its keep the moment you are about to write law, since it reads the terrain, argues from evidence, and never blocks a change. A task too big for one head to plan up front, in a repository that already has law: Horde, which takes any order and lets the planning decide whether it is one worker and a gate or a dozen territories, so nobody has to size a job before placing it. Entry is not rank: whichever tool comes first, Yggdrasil stays the law.

Trust between the tools follows one rule. Where the repository has a check, the check decides what lands, in both Horde and Jarl. A fresh reviewer can only stop a change, never make a failing check pass; its word is recorded as testimony. A Jarl loop in a repository with no check lands on testimony alone, and says so. How much Horde's planning and gate add over a Jarl loop with a check on the same work has not been measured yet; the comparison is planned, and until it runs, nothing here claims a number.

The dependency graph is small and every edge points one way. Horde requires Yggdrasil 6.1.0 or newer and Grain 6.1.0 or newer, and refuses an older one of either, because a mission layer with no law under it has nothing to hold anyone to, and an architect who cannot measure plans blind; it carries Jarl's record inside it, so a mission is a Jarl loop with nothing more to install. Grain talks to Yggdrasil when it is present and works perfectly well when it is not. Jarl works alone, and where the repository has a graph it touches Yggdrasil only to record what the client ratified in Yggdrasil's own logs and to merge Yggdrasil's files with Yggdrasil's own drivers. Yggdrasil depends on none of them. The add-ons, Ratatoskr, Urd and Researcher, depend on nothing and carry their own versions. The core four share one version number, deliberately, because they are one product built and tested together and any drift between them is paid for by whoever installed them; the add-ons keep their own. The code the core tools share lives in Runes, which is infrastructure, not a member: nobody installs it to get work done, and it adds no edge. Installing the whole family is the recommendation, never the requirement.

Two earlier embodiments framed the same two ends as *install a harness* and *fork a template*: an integrator arming any existing repository, and a private counterpart for the greenfield side, a governed environment per company built by it. Neither was published, and both have been dormant since mid-2026; the brownfield entry is now mined from evidence rather than installed. Running the loop end to end on a real, existing estate of code is what produced Grain and Horde.

## Who does what

The vision is a division of labor, not the removal of anyone:

- **The client** is the one human in it. The word is chosen on purpose: a client orders an outcome, is the final decision-maker on what gets built and on whether it turned out right, and does not run the process. Meaning is theirs. Technology enables what they want; they decide if it's ok. No person carries messages between agents, because that channel is a tool of its own: Ratatoskr sits in the session and speaks plain words at both ends. The client becomes an engineer for exactly one moment, and only that moment: when they write a rule themselves, or when they lower the law.
- **The legislator lays the rails, once.** Not by writing the thousandth endpoint, but by writing the rule that governs all thousand: encode judgment once, have it enforced infinitely. Alone with the law, the legislator is a person, deciding what is worth enforcing stays theirs, and this is still the highest-leverage position engineering has ever offered. Inside the family the seat moves, and that is a change in the thesis, not a footnote to it. Consent follows reach. Within its territory, law is raised freely by the agent working it, because that agent is the one with the code in front of it; the agent that owns a territory answers for that territory's law and for the quality the law exists to raise. Law or decisions that reach a whole type are shared vocabulary: the agent proposes them and they run as advice at once; the client admits them, in one batch, when the work closes. In a graph made mostly of types, that is most of the law. What stays irreplaceably human is admitting what reaches everyone, and the other direction: lowering the law, and vetoing it. Nothing is enforced that the client has not seen stated in one plain sentence, and the client does not have to read everything in order to strike it.
- **The agent** writes the code, and proves it against the rails.

The human stands at **both ends**: confirming intent going in, and giving the final yes on the rendered result coming out. The machine proves everything in between. Fidelity to intent is anchored by people; everything between them is anchored by proof.

## What it unlocks

1. **Authorship expands.** Who can contribute to a codebase grows from "engineers" to "anyone who understands the problem." This is the visible consequence — and the smallest one.

2. **Trust becomes manufacturable and transferable.** Trust was always earned person by person, review by review, by reputation. A governed environment makes it a property of the *box*: you can accept the work of a stranger — or of an agent — as if it were your own, because both are proven the same way. "Non-technical" is just the most dramatic case of *someone you cannot verify by reading their code*. The real unlock is **delegation you don't have to inspect**: swarms of agents, open contribution, work handed to people you don't know. That is what scales.

3. **Code becomes substrate-independent.** If the asset is intent + rules and not the code, the code is disposable — regenerable onto a new stack, a new framework, a new runtime, because what's canonical is "what the person experiences and the rules it must satisfy," not any particular implementation. Software, which normally dies of technology churn, becomes able to survive it.

4. **Software is the beachhead, not the territory.** The loop — confirm intent → agent produces → prove against enforced rules → human gives the final yes on rendered proof — is domain-agnostic. It is a general protocol for **trustworthy delegation to an autonomous agent**. Code is simply where it gets proven first. The territory is anything an agent can make.

## One line

> I am not building a tool that lets non-coders write apps. I am building the way humanity will delegate creation to machines without losing control over whether what was meant is what got made. Code is just the first proof that it works.
>
> — Krzysztof Dudek

---

## Built today, and the frontier (what is not yet anchored)

Built today, as of release 6.1.0: the seven tools of the table, each a public repository, with the core released on one version number. What is not built yet is below.

A vision is a direction, and the honest part of a direction is saying where it has not arrived. The chain proves its middle. Three things are what it is still reaching for, and naming them is what keeps them from being mistaken for solved:

- **The rails must not rot.** Everything downstream inherits the correctness of the rules. Yet the rules are the one artifact the vision has not turned on itself. As a product evolves, rules written once go stale, and a green check against a stale rule is *worse* than no check, because it manufactures false confidence. This is the keystone gap, and it closes by turning the inversion on the rules themselves: stop *trusting* the rails and start *proving* them. Each rule is measured — does it catch anything, what does it cost, whom does it harm — and the measurements stand as a permanent evidence base beside the law. So the question "what is neglected, what can be improved today?" is answered from that base — instantly, every item carrying its proof and where it came from — not from a fresh scan that evaporates when the session ends. Confirmed answers materialize back into enforced rules, and the problem class then disappears from every future answer: the list of what to fix consumes itself.

  Aiming at that forces an honesty a looser telling would blur. Proof is only fully proof where it is *deterministic* — a check whose reasoning is code a person can read. Where a rule is *judged* by a model, the verdict is a testimony at one point in time, and models drift; that judged layer is exactly where false confidence hides, so it is calibrated and measured, never trusted. And above a certain floor, verification stops being proof at all and becomes experiment — a laboratory and a court, not a checker. Rice's theorem rules out a general checker for semantic properties of programs, and Gödel's incompleteness results set a similar limit on what a formal system can prove about itself, so some verification will always be experiment and judgement rather than proof; a system that knows what it does not know is safer than one that claims to know everything. That boundary is a property to preserve, not a defect to close.

- **The loop must reach lived outcomes, not just production-readiness.** Production-*readiness* the rails do reach: when the law is calibrated toward what production actually demands — rate limits, audit trails, error handling, input validation, compliance, performance budgets — the proof extends all the way to "fit to ship," enforced continuously and in CI, not merely "green on the workbench." What is still unanchored is the step *after* shipping: whether it actually worked for real people once it was live. That post-ship signal — real usage, telemetry, consequences — closing back to the original intent is the missing downstream anchor. The shape it wants is already visible: an incident registry that closes what escaped to production back into the law, with reality acting as the one external oracle.

- **The signal from production has no owner.** Everything in the family answers for something: the law for what must hold, the terrain for what the code already keeps, the mission for the work it was given, the disciplines for how an agent conducts itself. From the moment a change is live, nothing does. Usage, telemetry, the consequence a person actually lived: that signal arrives at no seat. Reality is the one oracle none of the rails can stand in for, and a family that claims the whole loop has to grow a seat for it to arrive at. Until it does, the last step of the loop is a human happening to notice.

These are not flaws in the idea. They are where it points next.

---

## Where this is developed

The family is developed in the open, here in Althing: every release loop with its rulings, the research, and the method that runs it ([the method](method/INDEX.md)). Every public sentence about the family follows the register written in the canon, `family/canon.md`.
