# Jarl: repository names, and a field report from a loop in another project

**Question:** How should a Jarl loop name the repositories its issues change, so that the record carries no machine's folder layout and every role still finds the real checkout and worktree; and which items of a coordinator's field report should change Jarl, in which release?

**Method:** Read JarlSkill at `2c12aa3` (6.1.0, the driver this loop pins), Althing at `0dbe5e3`, the 6.2.0 loop through `ws jarl` (every Jarl issue, the rulings `jarl-6-2-0-scope`, `jarl-pinned-in-loop`, `release-6-2-0`, `autonomy-quality`, the answer to a-002), and the previous architect's plan `releases/6.2.0/plans/jarl-architecture-6.2.0.md`; count what the record holds; run Jarl 6.1.0 on a scratch loop for every behavioural claim (`materials/probe.mjs`); three fresh critiques of the first design (fidelity, technical soundness with a sceptic of every code claim, maintenance cost), and a revision answering every finding.

**Status:** concluded

**Conclusion:** A loop names a sibling repository by the name `git clone` gives it, declared once by Jarl with its root commits and base and resolved on each machine beside the loop's checkout, while the record holds no worktree location at all; this lands as 247, with 246 reshaped into "a merge records the check that decided it", and this loop keeps its Repo paths but loses its worktree paths before Althing's first push. Of the field report, two defects go into 246, four items become new issues, four amend 244, 250 and 251, and seven requests are rejected with reasons.

## What is here

- [source.md](source.md): the field report as it arrived
- [design.md](design.md): the revised design for repository names, the triage of the field report, the proposed changes, and the answer to every critique finding
- [findings.json](findings.json): the new issues, in the shape `import` reads (Jarl's and Althing's, told apart by their ids)
- [materials/probe.mjs](materials/probe.mjs) and [materials/probe-output.txt](materials/probe-output.txt): Jarl 6.1.0 on a scratch loop, the cases cited as "probe A" to "probe I"
- [materials/design-v1.md](materials/design-v1.md): the first version, as the critics read it
- [materials/critique-a-fidelity.md](materials/critique-a-fidelity.md), [materials/critique-b-technical.md](materials/critique-b-technical.md), [materials/critique-c-maintenance.md](materials/critique-c-maintenance.md): the three critiques

## Provenance

The field report is from a private deployment; its origin is not named here. The main document is `design.md` rather than `report.md`: the session that wrote it could not create a file of that name, and the document is a design in the sense of `research/2026-09-27-family-vision-design/`.
