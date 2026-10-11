# Jarl: model calibration, and fourteen notes from a coordinator

**Question:** What must Jarl record and derive so that it can suggest which model of any provider fits which kind of task, from measured results rather than rules (issue 287, ruling `model-calibration-in-6-2-0`), kept small enough for 6.2.0; and which of fourteen notes from a coordinator of a loop in another project should change Jarl's skill or Althing's briefs?

**Method:** Read JarlSkill at `2c12aa3` (6.1.0, the driver this loop pins), Horde at `b1e7607`, Althing at `95a08e6` (its rules, method, skills and the 6.2.0 briefs), the 6.2.0 loop through `ws jarl` (issues 241, 244 to 253, 280, 287 and the rulings in force), and the two earlier Jarl designs it builds on; run Jarl 6.1.0 on a scratch loop for every claim about behaviour and about the proposed line formats (`materials/probe.mjs`); compute the proposed metrics read-only on the real 6.2.0 record (`materials/retro.mjs`); check the metrics against a private deployment's field comparison of three models, distilled in `source.md`.

**Status:** concluded

**Conclusion:** The model is the one fact the record lacks: 287 records it on the lease and on the verdict (`--model`, with `@<effort>`, and `--relayed` for a verdict someone else recorded), adds a `light` tier and per-tier `Model (<tier>):` lines in `goal.md`, and derives per model and `Kind · Tier` the existing kinds of fact (clean first pass, changes, rounds, red after approve, evidence before review; for reviewers, checked approves and misses) in a read-only `models` view and in suggestions on `next`, with shares only from n ≥ 5 and no refusal anywhere; all of it reads safely under Jarl 6.1.0, so it needs no format change, and its recording is the part that cannot slip. Of the fourteen notes, ten amend 287 or 250, two are done, two are rejected, and two new issues follow, with two more from the calibration design.

## What is here

- [source.md](source.md): the fourteen notes as relayed, and the field comparison of three models, distilled
- [design.md](design.md): the calibration design (part A), the triage of the notes (part B), the proposed changes and the limits of this pass
- [findings.json](findings.json): the new issues, in the shape `import` reads (Jarl's and Althing's, told apart by their ids)
- [materials/probe.mjs](materials/probe.mjs) and [materials/probe-output.txt](materials/probe-output.txt): Jarl 6.1.0 on a scratch loop, the cases cited as "probe M1" to "probe F4"
- [materials/retro.mjs](materials/retro.mjs) and [materials/retro-output.txt](materials/retro-output.txt): the proposed metrics on the 6.2.0 record, grouped by tier

## Provenance

Both inputs come from a private deployment; its origin is not named here. The notes reached the architect already translated and abridged; the field comparison was distilled for this study with no project, company, product, person, file or issue number kept. The main document is `design.md` rather than `report.md`, as in the earlier Jarl study. No critics were raised in this pass (design.md, "Limits of this pass").
