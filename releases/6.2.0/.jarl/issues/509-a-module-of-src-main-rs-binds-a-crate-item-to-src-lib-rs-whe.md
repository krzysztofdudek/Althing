# 509 · Rust: a module binds a crate:: item to the wrong crate root when a package has more than one root in src/

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-fikt
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-libfirst
**Where:** src/relations/resolve-path.mts:453
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
A file under src/ gets root files [src/lib.rs, src/main.rs] in that order, and resolveFromModuleDir binds the first root that declares the item. So a module that only src/main.rs declares binds crate::X to the library root whenever the library has an X too (p46, p54). A [[bin]] with a path in src/, such as src/cli.rs, is a crate root as well, but a module it declares still gets the same two root files, so crate::X never binds that binary (p06). Rust resolves crate to the root of the current crate. Both already exist in v1.0.0. The fix picks the root by the module chain: the root file that declares the first module segment of the importing file. Issue 510 was merged into this one.

## Why


## Acceptance
- [test] In a package with src/lib.rs and src/main.rs, crate::X in a module that only src/main.rs declares binds the binary root, with p46 and p54 as catalogue cases, red before and green after · by: npm run check
- [test] A module declared by a [[bin]] whose path lies in src/ binds crate::X to that binary root, with p06 as a catalogue case, red before and green after · by: npm run check
- [test] When both roots or neither declare the module, a root item gives no edge, with a case · by: npm run check

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

