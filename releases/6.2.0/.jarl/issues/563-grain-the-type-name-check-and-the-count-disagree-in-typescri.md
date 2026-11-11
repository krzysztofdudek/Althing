# 563 · Grain: the type-name check and the count disagree in TypeScript on the release branch already: an a…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1206-cuok
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-294-fable
**Where:** the review of 294, 299, 300
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain: the type-name check and the count disagree in TypeScript on the release branch already: an abstract class and a namespace are counted and never refused, a type alias is refused and not counted (probe: abstract class Ab {} counts Ab, refuses nothing; type Alias = {} counts nothing, refuses Alias)

## Why


## Acceptance


[test] In TypeScript the type-name check and the count agree: an abstract class, a namespace and a type alias are each both counted and checked the same way, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: a type-name rule for TypeScript now checks the same declarations Grain counted it over: an abstract class and a namespace are checked, and a type alias, which Grain does not count, is no longer refused. Can turn a repository red: an abstract class or namespace whose name breaks a proposed type-name rule is now reported.

## Evidence

### Proof

- **ran (line 1ca25ee14c26):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/name-shape-type-check-names-what-grain-counts.test.mjs tests/name-shape-*.test.mjs tests/subgate-name-shape-*.test.mjs tests/propose.test.mjs tests/propose-check-units.test.mjs (before the fix 3 of 4 new tests failed: the check refused Alias, En, Iface, Plain while grain counted Ab, En, Iface, Ns, Plain) · **saw:** name-shape set: tests 56, pass 53, fail 0; propose set: tests 52, pass 48, fail 0 (skips are Yggdrasil-only tests)

### Notes

Assumed: a type alias is neither counted nor checked. The check now reads the node types the rule was counted over, as the method rule does, so the abstract class and the namespace (counted) are refused and the type alias (not counted) is not. Counting aliases instead would change what every TypeScript repository's type convention is measured over.

