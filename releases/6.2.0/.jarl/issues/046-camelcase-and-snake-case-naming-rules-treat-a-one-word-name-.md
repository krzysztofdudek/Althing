# 046 · camelCase and snake_case naming rules treat a one-word name as a violation: the enforced rule rejects test/helper.rb (rack), and the camelCase rule flags equals, read and clone (jsoup)

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0737-chos
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/parse.mjs, Grain/plugins/grain/engine/propose-lattice.mjs, Grain/plugins/grain/engine/propose-checks.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/parse.mjs:449-472 nameShape() (SHAPE_UNITS :452; units are joined only from token pairs, a lone lowercase word stays 'a'); propose-lattice.mjs:234-248 shapeToRegex (`a(Ua)+` → ^[a-z0-9]+(?:[A-Z]+[a-z0-9]+)+$, `a(_a)+` → ^[a-z0-9]+(?:_[a-z0-9]+)+$, the trailing '+' requires two words); propose-checks.mjs:97 (nameshape) and :114 (filenameshape); categorical values scopes.mjs:412/457/683 and lexical.mjs:192
**Branch:** jarl/046-one-word-name-shapes
**Merged:** 5c4c799
**CI:** none

## What
Unit test (Grain ae6152f): nameShape('get') = 'a', nameShape('getUser') = 'a(Ua)+', nameShape('helper') = 'a', nameShape('base_test') = 'a(_a)+', and for PascalCase Crlf and BaseDto both give '(Ua)+'. The compiled camelCase and snake_case expressions reject get, helper, gemloader and equals; the PascalCase expression accepts Crlf. rack @a9833c8: `YG_BIN=<yg 6.1.0> node grain.mjs propose` gives exactly one enforced rule, grain/test/partition-filenameshape 'Every file under `test/**` must be named snake_case', 'holds for 34 of 36 files; 2 break it today'; those 2 are test/gemloader.rb and test/helper.rb, and the drill corpus ('caught 2 of 2 planted violations') that made it enforced is exactly these false hits. After `yg adopt`, `yg check --no-approve --full --aspect grain/test/partition-filenameshape` shows both as errors with '(a(_a)+)'. After the adoption is committed, a new test/support.rb is an ERROR ('file name support.rb does not follow the shape this rule proposes (a(_a)+)'), while test/spec_support.rb passes, so a correct snake_case name is blocked. jsoup @088614f: advisory 'Every method under `src/**` must be named camelCase' ('3419 of 4969 methods; 1550 break it today'); after adopt, yg check gives 1068 violations, of which 1022 (96%) are single lowercase words: read (93), matches (49), head (34), cost (34), tail (33), process (26), parse (25), append (25), data (24), reset (18), clone (18), including overrides of JDK methods. Alongside: camelCase ending in an acronym (isEOF, isPI, supportsUTF8BOM, selfClosingOK) gives 'a(Ua)+U' and is rejected too, and a lone URL is 'U'. On rack, about 28 of the 32 errors of the known count mismatch are also one-word stems. This is different from issue 003 (the declaration set). The fix cannot simply fold 'a' in nameShape, because a lone lowercase word fits camelCase, snake_case and kebab-case equally: 'a' has to count as conforming when the rule's shape is a(Xa)+, both in the counting (share, deviations, drill cases) and in the expression ('*' instead of '+' in the tail). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-13/01-nameshape-unit.log, 02-04 rack, 10b and 11 new file after adoption, 05-08 jsoup.

## Why
The nameShape comment (parse.mjs:448-451) says 'A single word and many words are the SAME style … a word-count-sensitive shape flagged every one-word class name as a deviation'; that holds for PascalCase, not for camelCase and snake_case. On a real Ruby repository Grain's only enforced rule is a false alarm that breaks its own `errs: under` contract and blocks correct new files, and on jsoup 96% of the camelCase rule's findings are noise.

## Acceptance
- A name of one lowercase word conforms to a camelCase and snake_case rule (shape a(Xa)+) in counting the share, deviants and drill cases, and in the check expression (tail '*' instead of '+'); a test in tests/ for get, helper and equals.
- rack @a9833c8: the rule grain/test/partition-filenameshape lists neither test/helper.rb nor test/gemloader.rb; jsoup @088614f: the camelCase rule does not flag read, equals or clone.

## Changelog
- Fixed: a one-word name such as `helper` or `equals` now fits a camelCase, snake_case or kebab-case naming rule: it no longer counts against the rule, shows up as a violation, or fails the check a proposed rule ships with.

## Evidence

docs: README.md and docs/results.md: numbers that count enforced/advisory rules or name-shape deviants move (rack loses its only enforced rule; jsoup's camelCase advisory becomes a certified draft at 4695 of 4993) — re-measure in the final pass / 131

docs: docs/validation.md:197 (typeorm, 11 one-word `connection` accessors made camelCase 'fading' per birth): since 6.1.1 a one-word name counts as camelCase, so this example no longer arises at all; reword it as historical
- **ran (history):** YG_BIN=<ci yg 6.1.0> node --test tests/one-word-name-shapes.test.mjs on release/6.1.1 (engine copied via git archive) vs on jarl/046 0bf6e6c · **saw:** before: pass 1 fail 10 (shapeToRegex '+', mine: no camelCase fact at 30/43, helper.rb+gemloader.rb deviants, rejectedValues {v:'a',tried:6}, trend share 0.33, grain check flags support.rb, yg check refuses BadName/SpecLegacy/gemloader/helper/support); after: pass 11 fail 0 skipped 0
- **ran (history):** grain propose on rack @a9833c8 (YG_BIN, model re-learned), before vs after · **saw:** before: grain/test/partition-filenameshape enforced, 'caught 2 of 2', violates-test-gemloader + violates-test-helper, SHAPE /^[a-z0-9]+(?:_[a-z0-9]+)+$/; after: 0 enforced, rule draft (no-catch), drills satisfies-test-gemloader + satisfies-test-helper, SHAPE /^[a-z0-9]+(?:_[a-z0-9]+)*$/, fact counts {a(_a)+:35.65} deviants []
- **ran (history):** grain propose on jsoup @088614f before vs after; after: yg adopt, camelCase aspect set advisory, yg check --approve --only-deterministic --full, then yg check --no-approve --full --aspect grain/src/partition-nameshape · **saw:** before: advisory 'camelCase … 3419 of 4969; 1550 break it' and (verifier log 07) 1068 flagged, 122 read/equals/clone; after: certified 'holds for 4695 of 4993; 298 break it' (259 are constructors), yg check flags 46 names, 0 one-word, 0 read/equals/clone
- **ran (history):** scratch rack-shaped repo (39 spec_*.rb + helper.rb + gemloader.rb + SpecLegacy.rb), grain propose with YG_BIN, yg adopt, add test/support.rb + test/BadName.rb, yg check --aspect grain/test/partition-filenameshape · **saw:** before: enforced, refuses BadName.rb, SpecLegacy.rb, gemloader.rb, helper.rb, support.rb; after: enforced ('caught 1 of 1'), refuses only BadName.rb and SpecLegacy.rb
- **ran (history):** nice -n 15 npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES on jarl/046 549ede1 (release/6.1.1 merged in) · **saw:** tests 1926, pass 1925, fail 0, skipped 1
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1962, pass 1961, fail 0, skipped 1, merge 5c4c799

