# 188 · Runes: leftovers after 168/178/181 (slow tree-sitter parsing of garbage input; the tsconfig field in package.json and <sub>/tsconfig.json without exports; S::Gen<T> and S::A.Foo in C# type positions; autobins and the edition 2015 rule in Cargo; other extractors still use .parent/closest)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, 1.1.0
**Files:** Runes/src/relations
**Repo:** ../../../Runes
**After:** 168, 178, 181
**Found by:** runes-168
**Where:**
**Branch:** jarl/177-csharp-forms
**Worker:** runes-177
**Worktree:** /Users/me/.jarl-wt/Runes-177
**Since:** 2026-10-05 16:22

## What
Collected by the worker of package 168: tree-sitter parses garbage at 13–16 s/MB; tsconfig: the tsconfig field in package.json and <sub>/tsconfig.json without exports are not read; C#: S::Gen<T> and S::A.Foo in type positions are silent; Cargo: autobins and the edition 2015 rule are not read; the remaining extractors still walk .parent/closest (a quadratic risk like 168).

## Why
Silent edges and potential performance costs on large files.

## Acceptance
Each point resolved or described as a silence with a test; extractor passes linear.

## Evidence

jarl: per the 6.2.0 plan, 188 stays with the C# part (package R3); the TS extends part split off into 236, Cargo into 237, the linear passes into 238; the cost of parsing garbage input: ruling plan-6-2-0 D10 (described in CHANGELOG and README).

