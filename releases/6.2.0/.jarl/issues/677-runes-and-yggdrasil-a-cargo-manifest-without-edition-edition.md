# 677 · Runes and Yggdrasil: a Cargo manifest without edition (edition 2015) gives no cross-crate Rust edge without extern crate; correct for the language, but older crates that omit the key lose edges they had

**Status:** open
**Kind:** research
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2329-ydof
**Tags:** runes, rust, relations
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-530-sonnet, Runes 1.1.0 adoption report

## What


## Why
Cargo reads a missing edition as 2015, where a dependency needs extern crate; Runes 1.1.0 follows that, so a repository whose manifests omit the key sees cross-crate edges vanish on upgrade. It is true to the compiler, but adopters must learn it before the upgrade.

## Acceptance
[read] Measured on the Rust repositories of the corpus how many manifests omit edition and how many edges change, and either the CHANGELOG's Before you upgrade names it or the behaviour is changed with a test

## Evidence

