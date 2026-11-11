# 507 · edition = { workspace = true } reads as edition 2015

**Status:** done
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
**Merged:** 616751af8520ca224363828f4b608cffee5dad5c in Runes
**Merge check:** npm run check · saw tests 2107, pass 2106, fail 0, skipped 1; dist/ is fresh

## What
Claim: parseCargoManifest reads [package].edition only as a string, so the inline-table spelling edition = { workspace = true } leaves the edition unknown and editionInherited false, and isEdition2015 then defaults to 2015. In such a member every bare use path is taken as crate-relative and a declared target turns its kind's discovery off. Regression: v1.0.0 has no edition 2015 path rules and gives neither effect.

p10: app/src/api/client.rs:1 -> node:config (false; the workspace edition is 2021, so `config` is the registry crate). p51: app/src/jobs/mod.rs:1 -> node:root, a false edge into the root that closes a cycle with the root's `mod jobs;`, because the root has `pub use tokio;`. p40: silence where v1.0.0 and Cargo give app/src/bin/worker/main.rs:1 and :2 -> node:jobs, since 2015 discovery rules drop src/bin/worker/main.rs once a [[bin]] is declared. Control p11 with edition.workspace = true is correct. Cargo Book, The [workspace] section; TOML: a dotted key and an inline table name the same key.

## Why


## Acceptance
- edition = { workspace = true } reads the workspace's edition exactly as edition.workspace = true does, with the audit's probe and the sceptic's bench probe as catalogue cases, red before and green after
- The Rust tests are unchanged apart from the new cases, and the corpus goldens do not change

## Changelog
- A Cargo package that writes `edition = { workspace = true }` now takes the workspace edition, so its bare `use` paths name registry crates and its auto-discovered binaries and benches keep their edges; a library whose `[lib]` path lies in a subdirectory of `src/` resolves `crate::` paths against that subdirectory. A consumer's graph can show edges it did not show before and lose edges it showed wrongly.

## Reviews
- **approve** · by rev-507b-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T0951-juaj
  Minor: Runes src/relations/resolve-path.mts:393, the doc comment of rustTargetFor still says a file under src/ keeps the auto-discovered targets and does not say that a library whose path lies in a subdirectory of src/ now takes the files below that subdirectory alone (the rule is only in the inline comment at :463). Minor: commit 84fbd46 carries both fixes, for 507 and 508, so neither can be reverted alone; the lease is joint and the hunks touch one file, so this is no reason for a round. 507 line 1 [read] 'edition = { workspace = true } reads the workspace's edition exactly as edition.workspace = true does, with the audit's probe and the sceptic's bench probe as catalogue cases, red before and green after': met. The inline spelling gives the same edges as the dotted one with a 2021 workspace (probes: [package] inline, compact with a trailing comma, with a trailing comment, the whole package written as one inline table, the workspace edition written as an inline package table) and with a 2015 workspace (both spellings give the crate-relative edge, so the value is read, not only 'not 2015'). p10, p51, p40 and the bench probe s40 are the four edition cases; on the base code with the final cases all four fail for the issue's reasons (client.rs:1->config, jobs/mod.rs:1->root, no edge from the worker bin and the render bench) and pass on 84fbd46. 507 line 2 [read] 'The Rust tests are unchanged apart from the new cases, and the corpus goldens do not change': met; only the six runCase lines and the catalogue count 675 -> 681 changed, no corpus file moved. 508 lines 1 and 2 re-run (rows recorded): 2106 pass, 0 fail; both library cases red on base code, green after; rebuilt dist identical to the committed one. Extra probes: a library at ./src/core/lib.rs and at src/a/b/lib.rs with a decoy util in src/a/ resolve against the library's directory; a module of src/main.rs outside the library's directory keeps the binary's tree. Not a guard change, so nothing to attack.

## Evidence

### Notes

Assumed: the audit's p10 and p51 probes become edge cases, not silence cases, because the runner requires every edge a case's files emit to be listed and the root files give edges of their own (the root's own mod lines); the file under test still gives no edge, which the runner asserts. The sceptic's bench probe (s40) is the bench catalogue case, and p40 the declared-bin one.

The examiner was killed when the machine ran out of memory before recording a verdict; a new examiner is raised.

Examiner's minors left as they are: the doc comment of rustTargetFor (resolve-path.mts:393) does not mention the library-subdirectory rule stated inline at :463; both fixes share one commit.

