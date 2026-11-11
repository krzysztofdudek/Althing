# 668 · Grain: the type-name count takes a C# enum member (enum_member_declaration) and a Rust enum variant…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2225-luco
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-557b-opus
**Where:** the review of 231, 557, 563, 564, 567, 637, 640, 643, 644, 652, 664, 665
**Branch:** jarl/557-grain-rest
**Merged:** 0f1cdb9b in Grain
**Merge check:** cd plugins/grain && npm test · saw tests 2361, pass 2354, fail 0, skipped 7

## What
Grain: the type-name count takes a C# enum member (enum_member_declaration) and a Rust enum variant (enum_variant) for a type, the defect 665 removed for the Java enum constant, on release/6.2.0 and on jarl/557-grain-rest alike; since 563 the rendered type check refuses them too, so count and check agree but both measure values as type names (probe: enum Color { Red } in .cs and .rs counts and refuses Red)

## Why


## Acceptance


[test] The type-name count takes neither a C# enum member nor a Rust enum variant for a type, and check refuses only what the count measured, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: a type-name rule no longer counts or checks a C# enum member or a Rust enum variant, which are values of an enum and not types. Grain reads the sources again once after you upgrade.

## Reviews
- **approve** · by rev-557c-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T2302-bndb
  Minor 1 (563 changelog): the entry lists the newly checked declarations, but the tip type check also newly refuses a Ruby class and module (release counted them and its rendered check refused none, so a proposed type rule over Ruby goes from refusing nothing to refusing), a Java annotation type (@interface), and a Rust and a C++ union; none is named under Newly checked or Can turn a repository red. Probe: renderCheck with a shape no checked name fits, applicable set to the counted node types, on release/6.2.0 (dc31b968) and 703c5afe: rb counted Inner, Outer, Plain, refused nothing then all three; java Ann refused only on the tip; rs and cpp union Un refused only on the tip. On the tip count and check now agree in TypeScript, C#, Rust, PHP, Scala, Java, Kotlin, Python, C++ and Ruby. | Closed from round 2, red on 60343e6f and green on 703c5afe: Important 1 (231, type-covered declarer) and Important 2 (665, backticked names) by the three new tests; Minor 3 (grain-context.mjs:250 now says a graph edit rebuilds the index). The 664 entry now names Go; 665 and 668 entries are true. | 231 against Yggdrasil: yg decides covered in source/cli/src/core/type-coverage.ts:107-116 (classifySingleFile: any strict match gives the strict bucket, exactly one match covered, two or more ambiguous), sorted at :173-193, seeded in core/check.ts:280-285 and :304, read as an ownerless declarer at relations/pass.ts:508. Grain mirrors it at engine/grain-advise.mjs:104-116 (type_level true, unmapped and not excluded, exactly one non-strict match) and engine/arch.mjs:246-249. Probes against the gate yg check --full --no-approve, each with Late committed (yg, grain measure) and written after the commit (yg, grain check), C#, Java and Kotlin, one type, two types, one strict type, a strict plus a loose type, a content-predicate type, no type: all 18 agree (one or content: nothing; two, strict, strict plus loose, none: Late -> core). Java source-root layouts (src/main/java/com/x): core at the package path with the type-covered copy under a second source root or in a misc folder, single and wildcard import, all six arch variants: yg refuses -> core and Grain agrees in measure and check. Core in a folder off the package path and the copy at the package path: yg nothing, measure 0; grain check prints its own folder-level first-edge note toward the unmapped file in the uncovered variants, the same on release/6.2.0 and 60343e6f, not a node edge and not an issue of 231. type_level edited and not committed, both directions: grain check agrees with yg check; Grain reads only yg-config.yaml, as Yggdrasil reads type_level only from the committed config, never an overlay. | 665 and 668 end to end on a Kotlin and a Rust fixture (16 files each): Grain lattice row and buildAspects, rule installed as an enforced aspect on the node, real yg check --approve --only-deterministic. release/6.2.0: Kotlin method share 0.52 over 33 names and the forced rule refuses all 17 backticked tests; Rust type count 64 with 32 SCREAMING variants at share 0.5. Tip: Kotlin method share 1 over 17 and type share 1 over 16 (the backticked class left out), Rust type share 1 over 32 (enum_item, struct_item): 34 and 32 pairs pass, 0 refused; planted offenders are refused (Kotlin bad_name and Bad_Method, Rust plain_bad), the backticked test and the DARK_ONE variant beside them are not. No other language counts an enum value as a type (Kotlin, Scala, TypeScript, PHP, Python, C, C++ checked). | Checked and sound: suite 2361, 2354 pass, 0 fail, 7 skipped, exit 0 from a scratch clone; round 3 adds three tests, removes or edits none; each issue lands test then fix with its number; EXTR_V g39 -> g40; nothing on the branch tells an agent to call Grain; no AI attribution. Guards attacked: type coverage (two types, strict, strict plus loose, content predicate, type_level off and edited uncommitted: held); the name skip (backticked Kotlin method and class, quoted TS: held); enum values (C#, Rust: held). Not run: Windows, macOS.

## Evidence

### Proof

- **ran (line e6264f5fe93f):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/name-shape-type-count-excludes-enum-values.test.mjs (red on its test commit: Green and Red counted and refused in .cs and .rs), then the whole suite through full-gate.sh (tests 2361, pass 2354, fail 0, skipped 7) on 703c5afe · **saw:** all green; the count is Color and Plain, and the check refuses the same; EXTR_V is g40
- **ran (line e6264f5fe93f):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/name-shape-type-count-excludes-enum-values.test.mjs on scratch clones of 60343e6f (test copied in) and 703c5afe, then the full suite through full-gate.sh on 703c5afe · **saw:** 60343e6f: both tests fail (C# Red and Green, Rust Red and Green counted and refused); 703c5afe: 2 of 2 pass, count Color and Plain and the check refuses the same; full suite tests 2361, pass 2354, fail 0, skipped 7, exit 0

### Notes

Re-ran on scratch clones of 60343e6f (round 3 tests copied in) and 703c5afe, with YG_BIN from full-gate.sh: tests/ambiguous-symbol-type-covered-declarer, tests/name-shape-check-skips-what-the-count-skips, tests/name-shape-type-count-excludes-enum-values. 60343e6f: 2 of 8 pass (C#, Java, Kotlin type-covered fixtures give a dependency; the backticked Kotlin test, the C# enum member and the Rust variant fail). 703c5afe: 8 of 8 pass, and the yg check comparison agrees on all four fixtures.

Full suite once on a scratch clone of 703c5afe through full-gate.sh under MemoryMax=12G, nice 15, timeout 3000, npm test: tests 2361, pass 2354, fail 0, cancelled 0, skipped 7 (Windows-only, Runes 1.1.0-only and case-sensitive file system skips), exit 0, about 612 s; no 'Security violation' line.

