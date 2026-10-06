# 184 · Family: a gate with a corpus of real repositories (pinned commits as fixtures, heavy smoke tests of the whole stack) before every tag

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** harness, process
**Files:** Althing/.claude/skills/releasing-the-family/SKILL.md
**Repo:** ../../../Runes, ../../../Grain, ../../../Yggdrasil
**Found by:** owner
**Where:**

## What
The owner, 2026-10-02: “external repositories locked at a specific commit could simply be a fixture […] heavy smoke tests like that for the whole stack […] scenarios that concretely do concrete things” (translated from Polish); “I used to do it this way” (translated from Polish). Build a corpus: public repositories at fixed commits for each language of the family (TS/JS, Python, Go, Java, Kotlin, C#, PHP, Ruby, Rust, C, C++) plus the layouts from the bug hunt (Next.js app/[locale], npm/pnpm/uv monorepos, Cargo with [[bin]], solution-style tsconfig, ASP.NET with a top-level Program). Scenarios: (1) Runes edges vs a golden snapshot in the repo, (2) grain propose → a real yg adopt → yg check --full, (3) comparison with the language's own resolver (tsc, npm/pnpm, a TOML parser). Where the harness lives (Runes for edges, Grain already has GRAIN_CORPUS_CLONES, a cross-cutting scenario) — to be settled in the design. Starting material: the reviewers' scripts from the 6.1.1 loop (session scratchpad patch-611/review-*).

## Why
The 6.1.1 bug hunt found 180+ defects in real layouts that the tools' own test suites did not know; regressions of the fixes themselves were caught only by comparison with the real tools on real repos.

## Acceptance
One command runs the corpus locally and in CI; the golden edge snapshot is in the repo; an unexplained edge change, a false edge, a rejected adoption or a discrepancy with the real tool turns the gate red; the releasing-the-family skill points to the command.

## Evidence

jarl: per the 6.2.0 plan (section 6, D11), 184 is the Runes part (edges and oracles, package C1); the stack scenario and the parity in Grain split off into 239; the releasing-the-family skill will be corrected in the same work.

