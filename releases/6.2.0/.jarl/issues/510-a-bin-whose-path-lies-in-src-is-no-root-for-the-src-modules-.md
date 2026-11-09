# 510 · A [[bin]] whose path lies in src/ is no root for the src/ modules it declares

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-qgqk
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-binpthsr
**Where:** src/relations/resolve-path.mts:453

## What
Claim: A [[bin]] with path src/cli.rs is a crate root, but a module it declares under src/ still gets root files [src/lib.rs, src/main.rs]. crate::X there binds the library root when it has an X, and never the binary root.

p06: src/args/mod.rs:1 -> node:lib for `use crate::Opts;`, where src/cli.rs (owner cli) declares `mod args;` and `struct Opts`; Rust gives node:cli. Cargo targets.rs target_path: a declared path is the target's root. v1.0.0 gives the same false edge.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Include declared target paths that lie directly in src/ among the candidate root files of src/ modules, and choose among the roots by which one declares the module (see rust-1-libfirst); with no unique root, stay silent for root items.

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Dropped: Merged into 509: one fix, picking the crate root by the module chain. Ruling backlog-tidy-for-the-three-tools.

