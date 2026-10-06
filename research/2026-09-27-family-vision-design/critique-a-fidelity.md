# Critique of design v1 for fidelity to the owner's intent
*Translated from Polish for Althing on 2026-10-06. Paths and references to private material were rewritten neutrally; the original is not public.*

**Verdict:** the design adopts the owner's direction. Its structure (blocks, Runes, the data profile) is good. Most of its disagreements, though, are the old "let's not do this" under a new name. The biggest of them is not named a disagreement: fully rewiring Horde onto Jarl depends on a benchmark, and an inconclusive result means giving up the rewiring.

---

**1. Critical · §12.2 (A2, phase D), §13 R5, §0 D17: the benchmark decides "whether", not "how", and it is not on the list of disagreements.**
- **What is wrong:**
  - The owner set the direction: "Horde is the composer", "every block builds on another" (both translated from Polish). In the ruling that the vision is thought through first, he paused the rebuild only until he had read the design himself.
  - The design makes D2 (the rebuild) depend on the threshold "≥30% at ≤1.5× the cost". It admits itself that the threshold is "mine and arbitrary", and the trial has n=1. R5 adds that an "inconclusive" result means 7.0 without D2.
  - This is the coherence review's veto, only with the off switch set by default to "don't do it".
  - On top of that, A2 compares Horde with Jarl, and that is a question about the value of the Horde product. The rebuild is justified by something else: the duplicated loop record (§4.2 says that `handoff`, `decide` and half of `tk` disappear). That gain does not depend on whether Horde beats Jarl. So the benchmark measures something other than what it is meant to decide.
  - §0 lists five disagreements. This one, the biggest, is not on the list.
- **Fix:**
  - D2 is unconditional in 7.0.
  - A2 stays as a measurement of Horde's value and a reference point for D2.
  - The stop criterion is regression-only: D2 is rolled back if Horde on Jarl does worse than Horde 6.1.0 on metrics registered before the start. An inconclusive result means the rebuild goes ahead.
  - Add this as the sixth disagreement in §0 and as a separate item in §14.

**2. Critical · §12.1: the stop rule replaces the whole ruling that everything goes into 6.1.0 without asking, not just the rebuild.**
- **What is wrong:**
  - The owner paused only the rebuild, that is, 442–449, 431 and 436 (the ruling that paused the rebuild). The rest of the mandate stands.
  - The design proposes that the whole triage of 62 open and 17 started issues pass through four narrow conditions. That pushes into 7.0 things the owner himself wrote into 6.1.0:
    - "Fix everything in 6.1.0" (translated from Polish) (150–162);
    - the ruling that the architecture work belongs in 6.1.0 (372–382).
  - It also adds "two days of growth, so ask", against "stop asking" (translated from Polish).
  - Nobody asked for a stop rule. It is a change of scope smuggled into a design of the vision.
- **Fix:**
  - Separate two matters:
    - (a) the timing of the rebuild and its dependencies, which is the actual subject;
    - (b) the discipline for closing 6.1.0, as a separate proposal with an explicit list of exceptions: issues declared by the owner's rulings are exempt from triage.
  - In §14, give the two separately and add which of the owner's rulings each of them overrides.

**3. Important · §11.2 item 7, §3.3, §14 item 4: Grain conditional. The argument is weak and rests on older numbers.**
- **What is wrong:**
  - The owner said outright: "Horde's architect would have Grain for measurements too" (translated from Polish).
  - The design cites "0.254 versus 0.184" and "on files no better than popularity". These numbers come from the mapping report, which took them from `validation.md`.
  - Today's evaluation (`2026-09-27-grain-coupling-evaluation/report.md:16`) says something else:
    - a certified, undeclared partner: 0.262 versus 0.194, 31 directions won and 7 lost;
    - all certified pairs: 0.299 versus 0.135.
  - The same mapping report (line 239) says outright that co-change belongs to the architect's cut at planning time. That is an argument for the owner's words, not against them.
  - Grain's measurement also covers conventions, boundaries and completeness, not only co-change.
  - The dependency is circular, too: the condition of decision 7 measures D4, and D4 itself sits in the conditional phase D.
- **Fix:**
  - Grain required for Horde from 7.0, because the architect always measures.
  - Limit the risk like this: signals with weak evidence (file-level co-change) enter the verdict as advisory, with a denominator, and the benchmark weighs the signals, not whether Grain is present.
  - Correct the numbers to today's.

**4. Important · §11.2 item 8, §14 item 5: Jarl in the core only in 7.0. The design contradicts itself.**
- **What is wrong:**
  - The reason in the design: "the canon should describe what the release ships".
  - Yet §9 claims that the new message ("Jarl is the loop…") is "true today". Jarl as a standalone block exists in 6.1.0: 441, 424 and archive are merged.
  - A family number on the manifest is a cheap commit. The owner's precedents are the ruling that promises ride on the family number and the ruling on the numbers of Grain and the add-ons ("Krzysztof can change this").
  - In 6.1.0 the only untrue sentence would be "Horde stands on Jarl", and that sentence does not have to be written.
- **Fix:**
  - Jarl enters the core with the number 6.1.0 and with the "blocks and the composer" canon.
  - Mark the sentence about Horde on Jarl as **[proposed, 7.0]**.
  - E1 splits into a 6.1.0 part (blocks, the message, Jarl in the core) and a 7.0 part (the composer on Jarl).

**5. Important · §8, §14 item 8: Horde's MCP in 7.0. Option (b) is presented unfairly.**
- **What is wrong:**
  - The owner himself deferred 431, because the "scope depends on the rebuild" (translated from Polish). So the move itself partly agrees with his words.
  - The design, however, describes the 6.1.0 variant as "a hand-written server to throw away". Meanwhile:
    - according to §4.2, `land`, `refine`, `node`, `law`, `audit`, `drill`, `retro`, `escalate`, `wave`, `blame`, `brief` and `report` stay in Horde, which is most of the surface;
    - the pattern of a generator from a command table already exists in Jarl (424 done, `f4e5c55`).
  - The command table for those scripts survives the rebuild. Only the generator changes: from a copy of Jarl's pattern to the Runes adapter.
- **Fix:**
  - In 6.1.0: Horde's command table and a server generated on the 424 pattern for the commands that stay in Horde. The record commands (`tk`, `decide`, `handoff`, `status`) are excluded from parity, with the annotation "moves to Jarl in 7.0".
  - In 7.0, D1 comes down to swapping the generator.
  - This delivers `mcp-horde` within the limits of what can be done.

**6. Important · §4.1, §14 item 1: ports 442–444 were not the owner's words, yet the design presents them as his plan.**
- **What is wrong:**
  - Ports as profile commands are a coordinator ruling (`blocks-and-composer`, By: coordinator).
  - The owner said "blocks", "composer" and "every block builds on another" (all translated from Polish). The library model meets that sentence at least as well as the ports do.
  - So rejecting 442–444 is justified, and the "no second consumer" argument is strong. The label "Disagreement with the owner", however, misleads and inflates the cost of this decision in his eyes.
- **Fix:** rewrite the block as "a change against a coordinator ruling". In §14, mark at every item whether it overrides the owner's words or the coordinator's.

**7. Important · §3.3, §6.4: "Jarl → anything: none" clashes with the ruling on the type log and its context, and with "every block builds on another" (translated from Polish).**
- **What is wrong:**
  - The owner: "Jarl and Horde could write such decisions to the log explicitly" (translated from Polish), Jarl only when the repository has Yggdrasil. That is an optional edge Jarl → Yggdrasil.
  - The design turns it into prose in the skill and bans `yg` in Jarl's code (§3.2). Accepting 436 required a write and a test on Jarl's side.
  - On top of that, Horde's half of 436 (D5) lands in the conditional phase D, so it may never get built.
- **Fix:**
  - Add to §3.3 the edge "Jarl → Yggdrasil: optional, only `yg log add` after ratification, when a graph is detected", with an entry in `words.allow`. Or name it outright as a disagreement and add it to §14.
  - Take D5 out of phase D, because it does not depend on rewiring the record.

**8. Important · §5 (all of it): "vendored skills" is missing.**
- **What is wrong:**
  - The owner: "Yggdrasil can have things installed but skills vendored" (translated from Polish). So Runes was meant to cover shared skill content and prose too, not only code.
  - The design does not touch this at all. §5.1 and §5.5 know only `dist/` with JS.
- **Fix:** add a subsection on shared skill fragments, for example the protocol for working with Yggdrasil in the skills of Horde, Jarl and Grain. Describe how they are vendored (`paths` in the pin covers `skills/**`) and how the gate compares them.

**9. Minor · §5.5, §14 item 6: the gate in CI is an interpretation rather than a disagreement.**
- **What is wrong:** "only within development" (translated from Polish) stands in contrast to going through the private practice repository and to run time, not to CI. CI is part of development.
- **Fix:** record it as a reading ("CI is development; the private practice repository takes no part") with a request for confirmation, not as a disagreement.

**10. Minor · §5.9, §14 item 7: bootstrapping Runes "after the release" for no real reason.**
- **What is wrong:** the design itself admits that the bootstrap touches only the Runes repository. "As far as possible" (translated from Polish) argues for working in parallel.
- **Fix:** recommend (b), that is, in parallel, with a ban on touching `release/6.1.0`.

**11. Important · §14: the list is incomplete and badly ordered.**
- **Missing:**
  - D2 unconditional or behind the benchmark, with a threshold (point 1 here);
  - creating Runes: the name, TS and a committed `dist`, npm (D9);
  - one family number from 7.0 (D6);
  - "we do not combine them" and promoting `boundary` to a rule (D3);
  - merge drivers instead of a landing block (D4);
  - changing the paragraph "the profile is data only" (§2.3);
  - Grain's gaps and 447 moved from 6.1.0 to 7.0, which overrides a coordinator ruling (11);
  - the text of the trust doctrine for VISION.md (§4.3);
  - D5 and 436.
- **Order:** items 4, 5 and 8 depend on the time frame, that is, on what is in 6.1.0 and what is in 7.0.
- **Fix:**
  - Order the list: (1) the time frame and any condition on the rebuild; (2) the Horde–Jarl model; (3) Runes: whether, what, how; then the rest.
  - At every item add the columns "overrides the owner's words / the coordinator's / nothing" and "the variant that keeps the owner's words, with a risk limit". Today (b) is usually the variant without a risk limit, so the choice is only apparent.

**12. Minor · end of the document: "---END---", with an untitled list of uncertainties under it.**
- **Fix:** give that list the heading "15. What I am not sure of". Move the uncertainty about the threshold from point 1 into §14.
