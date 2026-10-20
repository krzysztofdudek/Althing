# The family as blocks and a composer: the design, its critiques and its revision

**Question:** How should the family be built as blocks (Yggdrasil, Grain, Jarl) and a composer (Horde), with shared code in Runes, and what should 6.1.0 deliver?

**Method:** A first design checked against the code on the release branches, three independent critiques of it (fidelity to the owner, technical soundness, the cost of maintenance), and a version 2 that answers every finding.

**Status:** concluded

**Conclusion:** Version 2 (`design.md`), the one accepted, rebuilds Horde on Jarl's record module and a data profile, puts the shared code in Runes and uses merge drivers instead of a landing block, delivered in dependency-ordered phases; it is the clearest worked example of a design and its critics.

## What is here

- [design-v1.md](design-v1.md): the first design
- [critique-a-fidelity.md](critique-a-fidelity.md): critique A: fidelity to the owner's intent
- [critique-b-technical.md](critique-b-technical.md): critique B: technical soundness
- [critique-c-maintenance.md](critique-c-maintenance.md): critique C: the cost of maintenance
- [design.md](design.md): version 2, answering the critiques

## Provenance

Moved into Althing on 2026-10-06. Absolute paths became repository-relative or neutral, and references to private material say what they were without a path. All five files were Polish and are translated. Rulings of the 6.1.0 loop that have no English slug yet are described in words.
