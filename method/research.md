# Research

How investigations of the family are run, and where what they find goes. Research covers every review, audit, design, critique, measurement and bug hunt about a family tool or the family as a whole. Built today: this document. Where it is going: the skill `researching-the-family`, which will hold the procedure; until it is written, this is the whole of it.

## The folder

Each investigation is one folder, `research/YYYY-MM-DD-<slug>/`. Its `README.md` opens with four lines, in this order: `**Question:**`, `**Method:**`, `**Status:**` (`open`, `concluded` or `superseded by <slug>`) and `**Conclusion:**`. Beside it go `report.md`, `findings.json` when the findings are structured, and `materials/`. The rail `layout/research` checks the shape.

Raw input the owner did not write (a report, a list) goes in first, as `source.md`: verbatim if it is English, translated and marked if it is not ([language](language.md)).

## Method

- **The question first**, written before the work starts. A study without a question finds whatever it finds and concludes nothing.
- **Cite the code.** Read it and cite `file:line`. A claim without a citation is an opinion.
- **Run the tools on exact builds**: the workspace's builds of named commits, never a development checkout that workers are patching ([the workspace](../workspace/README.md)).
- **Use real repositories** from the corpus at pinned commits, so that anyone can rerun the result.
- **Measure what can be measured.** A measurable claim is settled by an experiment (that is what Researcher is for), not by argument.
- **Put a design to critics.** Before a design is accepted, three independent critiques attack it, one each on fidelity to the owner's intent, technical soundness and the cost of maintaining it, and a revision answers every point. The family's own vision design was confronted with critics this way before the owner decided on it (`shared-code-vendored`).
- **Record what did not work** with the same care as what did. A negative result saves the next study from repeating it.

## Where conclusions land

A research folder keeps the reasoning, not the rule.

- A finding becomes an issue in the open loop (`findings-become-issues`), imported from `findings.json` when there is one.
- A conclusion that changes how the family works goes to its home: the canon, the method or the ledger.
- A folder that has been cited is frozen (`ws freeze research/<folder>`), and the rail `freeze/holds` keeps it byte for byte, so that a citation keeps pointing at what it cited.

## What never enters

Nothing private ([the boundary](boundary.md)). A study that ran a tool on a private repository keeps its numbers and loses that repository's identity. Material from private work arrives only as a field report, distilled before it comes.
