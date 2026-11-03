# How many gaps are left in Runes' C# and Rust relation passes

**Question:** At Runes release/1.1.0 commit 5227538, how many places remain where the C# extractor's name lookup or the Rust resolver's reading of Cargo targets gives an edge the real tool would not give, or misses one it would, beyond the issues already filed in the 6.2.0 loop, and how severe is each?
**Method:** Two independent audits on a scratch tree of release/1.1.0 at 5227538 under Althing's .cache/: one of C# name lookup against the C# specification (sections 7.6, 7.8, 12.8.10.3, 14.5) and Roslyn's documented errors, one of Rust crate roots and use paths against Cargo's src/cargo/util/toml/targets.rs at a released tag and the Rust reference for editions 2015 and 2018. Each audit lists the rules of its language that bear on edges, probes each with a small source tree run through the built package, and records every probe and its output in materials/. Each finding then meets a fresh sceptic, who tries to refute it against the code and the specification. The count is reported per severity, with the issues already filed in the loop subtracted.
**Status:** concluded
**Conclusion:** At 5227538, 34 further gaps remain beyond the filed issues, none refuted by the sceptics: C# 15 (2 high, 3 medium, 10 low) and Rust 19 (1 high, 8 medium, 10 low). Three are regressions of the 1.1.0 work (two in C#, one in Rust); the other 31 already existed in Runes 1.0.0. The audits covered the most important rules, not every corner, so the counts are a floor.

## Why this question

The owner, 2026-11-03 (translated from Polish): "Let us do it differently. An independent review of both, we will see how much of it there still is, and then we decide. For now you keep working." During the night every fresh review of a C# or Rust package found one to three further gaps that already existed in Runes 1.0, so the rule that Runes ships when all its issues are closed has no visible end. This investigation measures how much is left, so the owner can decide whether Runes 1.1.0 closes everything or cuts at what is filed.

## Scope

- In: the C# extractor and resolver (src/relations/extractors/csharp*.mts, src/relations/resolver.mts, src/relations/symbol-table.mts) and the Rust resolver and extractor (src/relations/extractors/rust*.mts, src/relations/resolve-path.mts as far as Rust uses it).
- Out: other languages, performance, the corpus harness, and the open issues of the loop that already name a gap (they are listed in each audit and not counted again).
- Each finding is labelled as a regression of the 1.1.0 work or as a gap that also exists in Runes 1.0.0, by running the same probe on the v1.0.0 tag.
