# 677 · Runes and Yggdrasil: a Cargo manifest without edition (edition 2015) gives no cross-crate Rust edge without extern crate; correct for the language, but older crates that omit the key lose edges they had

**Status:** in-progress
**Kind:** research
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2329-ydof
**Tags:** runes, rust, relations
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-530-sonnet, Runes 1.1.0 adoption report
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
Cargo reads a missing edition as 2015, where a dependency needs extern crate; Runes 1.1.0 follows that, so a repository whose manifests omit the key sees cross-crate edges vanish on upgrade. It is true to the compiler, but adopters must learn it before the upgrade.

## Acceptance
[read] Measured on the Rust repositories of the corpus how many manifests omit edition and how many edges change, and either the CHANGELOG's Before you upgrade names it or the behaviour is changed with a test

## Evidence

### Notes

Measured on the Rust repositories of the corpus (ripgrep, react's compiler, zed, next-intl's one manifest; 293 package manifests in 4 repositories): 0 omit edition. 260 of zed's, 12 of react's and 10 of ripgrep's inherit it with edition.workspace = true from a workspace.package edition 2024; the others write 2021 or 2024. So no edge changes on the corpus and the CHANGELOG's Before you upgrade needs no line from this measurement; a repository whose manifests omit the key still reads edition 2015, as Cargo does.

