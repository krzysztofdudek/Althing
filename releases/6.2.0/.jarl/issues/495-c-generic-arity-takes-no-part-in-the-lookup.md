# 495 · C#: generic arity takes no part in the lookup

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-alfe
**Tags:** 1.1.0, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-arityign
**Where:** src/relations/extractors/csharp.mts:429
**Branch:** jarl/492-csharp-member-and-arity-lookup
**Merged:** 6f3df1b in ../../../Runes
**CI:** pending

## What
Claim: Keys carry no arity, so a nearer App.Result binds Result<int>, a nearer App.Envelope<T> binds a bare Envelope, and Result and Result<T> in two nodes of one namespace silence both. C# matches the arity (spec 7.6.1). Pre-existing, except the alias-target form (using R = Result<int>), which v1.0.0 left silent and 5227538 binds to the non-generic type.

probes/csharp p05 (Api.cs:4->core, expected lib), p06 (Api.cs:4->core, expected lib), p17 (silence, expected a and b), p40 (Api.cs:2->core at 5227538, silence at v1.0.0, expected gen)

## Why


## Acceptance
- Generic arity takes part in C# lookup: Result binds no Result<T>, Result<int> binds no Result, and Result and Result<T> declared in two nodes each keep their edge, including through an alias target, with the audit's probes as catalogue cases, red before and green after
- The C# matrix and parity tests are unchanged apart from the new cases, and the corpus goldens change only by explained lines

## Changelog
- Fixed: C#: a type name with type arguments binds only a type with that many type parameters, and a bare name only a non-generic type: `Result<int>` no longer binds a nearer non-generic `Result`, and `Result` and `Result<T>` in two components each keep their edge. C# declaration keys of generic types now carry their arity (`Result`1`).

## Evidence

- **ran (history):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (five new cases, src held at 4939332) · **saw:** tests 172, pass 167, fail 5: Api.cs:4->core (expected lib) twice, Uses.cs:3 none (expected a), Api.cs:2->core (expected gen), Setup.cs:3 none (expected pair)
- **ran (history):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (after 7c21f2c) · **saw:** tests 172, pass 172, fail 0; corpus jellyfin: 101 references change file (generic uses bind the generic file; one new true edge, two false edges gone), all explained
- **ran (history):** npm run check; npm run coverage; node scripts/corpus.mjs verify --tier all (on 7c21f2c) · **saw:** check exit 0, 2094 pass, dist fresh; coverage exit 0, all files 99.05 lines, 95.11 branches, 98.97 functions; corpus verify passed, 33 repositories
- **ran (history):** nice -n 15 timeout 1800 npm run check; npm run corpus -- --tier routine; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 2101, pass 2100, fail 0, dist/ is fresh; corpus gate passed on the routine tier; edges verified on all tiers (merge 6f3df1b on release/1.1.0)

