# 507 · edition = { workspace = true } reads as edition 2015

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-edinline
**Where:** src/relations/resolve-path.mts:735

## What
Claim: parseCargoManifest reads [package].edition only as a string, so the inline-table spelling edition = { workspace = true } leaves the edition unknown and editionInherited false, and isEdition2015 then defaults to 2015. In such a member every bare use path is taken as crate-relative and a declared target turns its kind's discovery off. Regression: v1.0.0 has no edition 2015 path rules and gives neither effect.

p10: app/src/api/client.rs:1 -> node:config (false; the workspace edition is 2021, so `config` is the registry crate). p51: app/src/jobs/mod.rs:1 -> node:root, a false edge into the root that closes a cycle with the root's `mod jobs;`, because the root has `pub use tokio;`. p40: silence where v1.0.0 and Cargo give app/src/bin/worker/main.rs:1 and :2 -> node:jobs, since 2015 discovery rules drop src/bin/worker/main.rs once a [[bin]] is declared. Control p11 with edition.workspace = true is correct. Cargo Book, The [workspace] section; TOML: a dotted key and an inline table name the same key.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: In assign, when keyPath is ['package','edition'] and the value is an inline table, read its members as dotted keys (as the `package = { … }` branch at :754 already does), so `workspace = true` sets editionInherited. Add p10, p40 and p51 to the catalogue.

## Evidence

