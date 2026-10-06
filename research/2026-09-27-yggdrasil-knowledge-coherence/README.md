# Yggdrasil 6.1.0: knowledge and schemas

**Question:** Are Yggdrasil's knowledge topics, schemas and issue-code registry coherent with each other and with the parser?

**Method:** A read of every knowledge topic, schema and registry string on `release/6.1.0` `b428ccfa9`, with the schema examples run against the real parser.

**Status:** concluded

**Conclusion:** A usable foundation but not yet coherent: several topics contradict each other, several schemas contradict their own examples, and the gaps sit where two rules meet; behaviour conflicts went to decision briefs rather than fixes.

## What is here

- [report.md](report.md): the verdict, the plain fixes and the decision briefs

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path.
