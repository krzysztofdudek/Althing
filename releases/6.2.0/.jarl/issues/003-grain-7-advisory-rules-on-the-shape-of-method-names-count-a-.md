# 003 · Grain: 7 advisory rules on the shape of method names count a different set of declarations than check

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, minor
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-6.1.1-patch
**Where:**
**Branch:** jarl/003-check-populations
**Worker:** grain-003
**Worktree:** /Users/me/.jarl-wt/Grain-003
**Since:** 2026-10-05 16:22

## What
On koa, petclinic and Yggdrasil, 7 advisory rules on method names still differ in count from yg check: Grain's set of methods (e.g. constructors in Java) is not the same set of declarations that the name-shape check reads.

## Why
The 'N break it today' number is meant to agree with what yg check shows afterwards; for enforced rules this already works (6.1.1), for advisory ones it does not.

## Acceptance
Node types for the check derived from Grain's bindings per grammar; advisory counts agree with yg check --full on the corpus. Scope: a minor release, not a patch.

## Changelog
- Fixed: name-shape rules on methods, enforced and advisory alike, now count the same declarations the check reads: a constructor, a reserved special method (PHP magic methods, Python __str__ and the like) and the variable of a catch clause or a for-each loop are no names a project chose, so they are neither counted nor refused (a constructor also leaves the name-suffix count), and a function bound to a name (const f = () => {}) is checked under that name. A name-shape rule may therefore refuse bound functions it did not refuse before.

## Evidence

grain-200: not fixed, per grain-scope (003 minor). Probe on HEAD: Grain's method population counts Java constructor_declaration (PascalCase, a camelCase deviant) and TS/JS arrow_function bindings; the rendered name-shape check reads only NT.funcDecl nodes with a name field, so it skips both. Aligning means choosing a direction: (a) Grain leaves language-fixed names (constructors) out of the method name-shape count, or (b) the check reads the node types Grain counted (export applicableNodeTypes, as returns does) — (b) alone would make yg refuse every Java constructor under a camelCase rule.
- **ran:** node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs (before the fix, from plugins/grain) · **saw:** not ok: Grain counts named functions, methods and bindings: actual includes 'outer' (missing from expected list); not ok: Java constructor: names actual ['Foo','doThing'] expected ['doThing']; tests 2, fail 2
- **ran:** node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs (after the fix, commit fba84ee) · **saw:** tests 2, pass 2, fail 0: the check refuses [1, 4, 8, 12, 15, 16], the same declarations Grain counts; the Java constructor is not counted and not refused

docs: plugins/grain/docs/reference.md:629-633: the sentence that a Java constructor is one of grain's methods and not one the name-shape template reads no longer describes the code; constructors are outside the name-shape count and the check reads the same node set, so the caveat stays for any other gap but the constructor example goes
- **ran:** full-gate.sh on the worktree at fba84ee and 1ec8011 (timeout 1200) · **saw:** tests 2303, pass 2302, fail 0; exit 0

round 2 (b),(c): commit 4a7a2bc. ran: node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs before the fix (from plugins/grain) · saw: tests 6, fail 4 (TS, JS, PHP, Python constructor counted and refused: actual 2 expected 1); after: tests 6, pass 6. Language-fixed names (constructor, __construct, __init__) are keyed by grammar in engine/config.mjs and skipped by extraction and by the rendered check by file extension. docs: docs/reference.md (repository root, not plugins/grain/docs) updated in the same commit

round 2 (a) found a real gap: the 7 advisory rules are sub-gate rows and their branch passed no node types to renderCheck, so the first fix never reached them. Commit bc7c261, test tests/subgate-name-shape-reads-counted-nodes.test.mjs: before the fix tests 1, fail 1 (no APPLICABLE set in the rendered check); after pass. Corpus (grain at bc7c261, gate YG_BIN, propose, yg adopt, yg check --no-approve --full): koa: before, lib/candidate-auto-nameshape announced 22, yg refused 18; after 22 and 22. petclinic: 0 advisory rules in the proposal (10 draft), nothing to compare. Yggdrasil (clone of release/6.2.0 at 5fa8acce, adopt --replace): the advisory method name-shape rule on tests/fixtures announces 72, yg refuses 4; the other 68 sit in fixture trees that carry their own .yggdrasil (43 of 49 fixture directories), which yg treats as nested projects and does not check while grain counts them (same gap on the advisory filename-shape rule there, 67 vs 2); OPEN, a population-scope cause, not a node-type one. Full gate at bc7c261: tests 2308, pass 2307, skipped 1, fail 0, exit 0

follow-up: the Yggdrasil corpus line (advisory name-shape counts on fixture folders carrying their own .yggdrasil, 72 vs 4 and 67 vs 2) is issue 294.

