# 23 · Runes, Rust: a module of one of two [[bin]] targets that share a directory outside src/ gives no cr…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1509-pkiw
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-700-opus
**Where:** the review of 700

## What
Runes, Rust: a module of one of two [[bin]] targets that share a directory outside src/ gives no crate:: edge even where a plain mod chain reaches it from one root only. With tools/a.rs declaring mod cmd; and tools/cmd/mod.rs declaring mod run;, rustc 1.99.1 builds crate::Opts in tools/cmd/run.rs against tools/a.rs, and the resolver stays silent: a lost edge, never a false one. Found while reviewing 700 (rust-several-bins-one-dir-silence with its mod line moved to a); the resolver code is unchanged on that branch.

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: a gap v1.1.0 already had, or a reach the new reader does not claim, not a false edge or a regression (ruling runes-1-2-0-cut-for-new-findings)

