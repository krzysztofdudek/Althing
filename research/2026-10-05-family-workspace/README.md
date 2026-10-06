# The family workspace: the earlier design

**Question:** How should the family verify that its tools work together at exact commits, and where should that live?

**Method:** A read-only design pass over the release record and plans of the time, the tools' CI workflows, vendoring pins and operating docs, and the hand-built gate environment it would replace.

**Status:** concluded

**Conclusion:** A public repository with a registry, one manifest per release, four modes and the cross-tool checks, named Althing; on the same day the owner made Althing the whole family layer, which superseded its recommendations on the record, the canon and the thesis, and its workspace part was carried into `workspace/`.

## What is here

- [design.md](design.md): the design

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. Its links into the private repository became plain references, and private details were removed.
