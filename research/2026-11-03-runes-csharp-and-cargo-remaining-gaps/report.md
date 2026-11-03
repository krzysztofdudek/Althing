# Report: the gaps left in Runes' C# and Rust passes at release/1.1.0 5227538

Two independent audits on Opus probed the C# extractor (43 probes) and the Rust resolver (53 probes) on built scratch trees of release/1.1.0 at 5227538 and of the v1.0.0 tag. A fresh Opus sceptic per audit re-ran every probe on both trees, checked each claim against the C# specification or Cargo's targets.rs at tag 0.85.0, and tried to refute it. The audit records, the probes and their outputs are in materials/.

## Counts

None of the 34 findings was refuted. The counts below are after the sceptics' severity changes, and exclude every issue already filed in the 6.2.0 loop.

| Language | High | Medium | Low | Total | Regressions of the 1.1.0 work |
|---|---|---|---|---|---|
| C# | 2 | 3 | 10 | 15 | 2 (csharp-1-compremv, the alias-target form of csharp-1-arityign) |
| Rust | 1 | 8 | 10 | 19 | 1 (rust-1-edinline) |
| Both | 3 | 11 | 20 | 34 | 3 |

The sceptics also found one gap the C# audit missed (an explicit lambda return type gives no edge, low, also in v1.0.0) and corrected the probes p21, p39 (C#) and p10, p13 to p17 (Rust), which would not compile as written; every finding held with the corrected probes.

## The findings that matter most

- csharp-1-nestencl (high, pre-existing): a bare name never reads the nested types of its enclosing types, so a nested Command, Result or Status binds a same-named type elsewhere.
- csharp-1-inhermem (high, pre-existing): a member declared outside the file, inherited or in another partial part, is read as a type (User.FindFirst in an ASP.NET controller binds a domain User).
- rust-1-edinline (high, regression): edition = { workspace = true } reads as edition 2015, which gives a false edge that forms a cycle and turns bin and bench discovery off.
- csharp-1-compremv (low, regression): a file excluded by Compile Remove now wins through the own-project preference added in 1.1.0.
- csharp-1-arityign (medium, regression in its alias-target form): generic arity takes no part in the lookup.

## What this says about the trend

The audits were asked for the most important forty or so probes per language, not every corner, so the counts are a floor for each language, not a census. Three of 34 are regressions; the other 31 are gaps Runes 1.0.0 already had. The severity is a judgment of how common each layout is (testimony), not a measurement on the corpus.

## The full lists

materials/csharp-audit.md, materials/csharp-sceptic.md, materials/rust-audit.md and materials/rust-sceptic.md, with the findings in materials/csharp-findings.json and materials/rust-findings.json.
