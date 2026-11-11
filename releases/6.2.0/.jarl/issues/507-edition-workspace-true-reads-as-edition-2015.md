# 507 · edition = { workspace = true } reads as edition 2015

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-xqia
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/resolve-path.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-edinline
**Where:** src/relations/resolve-path.mts:735
**Branch:** jarl/507-rust-roots
**Worker:** w-507-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 09:35

## What
Claim: parseCargoManifest reads [package].edition only as a string, so the inline-table spelling edition = { workspace = true } leaves the edition unknown and editionInherited false, and isEdition2015 then defaults to 2015. In such a member every bare use path is taken as crate-relative and a declared target turns its kind's discovery off. Regression: v1.0.0 has no edition 2015 path rules and gives neither effect.

p10: app/src/api/client.rs:1 -> node:config (false; the workspace edition is 2021, so `config` is the registry crate). p51: app/src/jobs/mod.rs:1 -> node:root, a false edge into the root that closes a cycle with the root's `mod jobs;`, because the root has `pub use tokio;`. p40: silence where v1.0.0 and Cargo give app/src/bin/worker/main.rs:1 and :2 -> node:jobs, since 2015 discovery rules drop src/bin/worker/main.rs once a [[bin]] is declared. Control p11 with edition.workspace = true is correct. Cargo Book, The [workspace] section; TOML: a dotted key and an inline table name the same key.

## Why


## Acceptance
- edition = { workspace = true } reads the workspace's edition exactly as edition.workspace = true does, with the audit's probe and the sceptic's bench probe as catalogue cases, red before and green after
- The Rust tests are unchanged apart from the new cases, and the corpus goldens do not change

## Changelog
- A Cargo package that writes `edition = { workspace = true }` now takes the workspace edition, so its bare `use` paths name registry crates and its auto-discovered binaries and benches keep their edges; a library whose `[lib]` path lies in a subdirectory of `src/` resolves `crate::` paths against that subdirectory. A consumer's graph can show edges it did not show before and lose edges it showed wrongly.

## Evidence

### Notes

Assumed: the audit's p10 and p51 probes become edge cases, not silence cases, because the runner requires every edge a case's files emit to be listed and the root files give edges of their own (the root's own mod lines); the file under test still gives no edge, which the runner asserts. The sceptic's bench probe (s40) is the bench catalogue case, and p40 the declared-bin one.

The examiner was killed when the machine ran out of memory before recording a verdict; a new examiner is raised.

