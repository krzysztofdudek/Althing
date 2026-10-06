# Archgate: concepts worth porting into Yggdrasil

**Question:** Which ideas of archgate, another architecture-as-code tool, are good independent of who had them, and what would it cost to have them in Yggdrasil?

**Method:** A full read of `archgate/cli` at `9efeade` (v0.51.0: the docs, the rule API, the check engine, every command and its 35 ADRs) against Yggdrasil 5.7.0: its manual, knowledge topics, schemas and CLI source.

**Status:** concluded

**Conclusion:** Thirteen concepts in three tiers are worth having; the suggested order starts with the layer ladder (knowledge belongs in the most-validated layer that can reach it), then cheap authoring patterns, then shipping the prompt-headroom gauge as a `yg check` diagnostic.

## What is here

- [report.md](report.md): the concepts, each with its cost and value, what not to port, and the suggested order

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. One section that corrected a separate market study, which is not public, was left out with it.
