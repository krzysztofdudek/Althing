# 003 · Grain: 7 advisory rules on the shape of method names count a different set of declarations than check

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261002T0655-cgap
**Tags:** grain, minor
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-6.1.1-patch
**Where:**
**Branch:** jarl/003-check-populations
**Merged:** c638feb3072d032d1ed6da49565072327572e72f in ../../../Grain
**CI:** pending

## What
On koa, petclinic and Yggdrasil, 7 advisory rules on method names still differ in count from yg check: Grain's set of methods (e.g. constructors in Java) is not the same set of declarations that the name-shape check reads.

## Why
The 'N break it today' number is meant to agree with what yg check shows afterwards; for enforced rules this already works (6.1.1), for advisory ones it does not.

## Acceptance
Node types for the check derived from Grain's bindings per grammar; advisory counts agree with yg check --full on the corpus. Scope: a minor release, not a patch.

## Changelog
- Fixed: name-shape rules on methods, enforced and advisory alike, now count the same declarations the check reads: a constructor or destructor, a name its language fixes (PHP every name starting with __, Python __x__, Ruby initialize and operator methods such as == and <=>, Scala def this), the variable of a catch clause or a for-each loop, a call with a closure (Groovy) and a Rust struct literal are no names a project chose, so they are neither counted nor refused; a function bound to a name (const f = () => {}) is checked under that name. A name is shaped without the marker its language owns (PHP leading $, Ruby trailing ?, ! or =). A name-shape rule may therefore refuse bound functions it did not refuse before.

## Evidence

grain-200: not fixed, per grain-scope (003 minor). Probe on HEAD: Grain's method population counts Java constructor_declaration (PascalCase, a camelCase deviant) and TS/JS arrow_function bindings; the rendered name-shape check reads only NT.funcDecl nodes with a name field, so it skips both. Aligning means choosing a direction: (a) Grain leaves language-fixed names (constructors) out of the method name-shape count, or (b) the check reads the node types Grain counted (export applicableNodeTypes, as returns does) — (b) alone would make yg refuse every Java constructor under a camelCase rule.
- **ran (history):** node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs (before the fix, from plugins/grain) · **saw:** not ok: Grain counts named functions, methods and bindings: actual includes 'outer' (missing from expected list); not ok: Java constructor: names actual ['Foo','doThing'] expected ['doThing']; tests 2, fail 2
- **ran (history):** node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs (after the fix, commit fba84ee) · **saw:** tests 2, pass 2, fail 0: the check refuses [1, 4, 8, 12, 15, 16], the same declarations Grain counts; the Java constructor is not counted and not refused

docs: plugins/grain/docs/reference.md:629-633: the sentence that a Java constructor is one of grain's methods and not one the name-shape template reads no longer describes the code; constructors are outside the name-shape count and the check reads the same node set, so the caveat stays for any other gap but the constructor example goes
- **ran (history):** full-gate.sh on the worktree at fba84ee and 1ec8011 (timeout 1200) · **saw:** tests 2303, pass 2302, fail 0; exit 0

round 2 (b),(c): commit 4a7a2bc. ran: node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs before the fix (from plugins/grain) · saw: tests 6, fail 4 (TS, JS, PHP, Python constructor counted and refused: actual 2 expected 1); after: tests 6, pass 6. Language-fixed names (constructor, __construct, __init__) are keyed by grammar in engine/config.mjs and skipped by extraction and by the rendered check by file extension. docs: docs/reference.md (repository root, not plugins/grain/docs) updated in the same commit

round 2 (a) found a real gap: the 7 advisory rules are sub-gate rows and their branch passed no node types to renderCheck, so the first fix never reached them. Commit bc7c261, test tests/subgate-name-shape-reads-counted-nodes.test.mjs: before the fix tests 1, fail 1 (no APPLICABLE set in the rendered check); after pass. Corpus (grain at bc7c261, gate YG_BIN, propose, yg adopt, yg check --no-approve --full): koa: before, lib/candidate-auto-nameshape announced 22, yg refused 18; after 22 and 22. petclinic: 0 advisory rules in the proposal (10 draft), nothing to compare. Yggdrasil (clone of release/6.2.0 at 5fa8acce, adopt --replace): the advisory method name-shape rule on tests/fixtures announces 72, yg refuses 4; the other 68 sit in fixture trees that carry their own .yggdrasil (43 of 49 fixture directories), which yg treats as nested projects and does not check while grain counts them (same gap on the advisory filename-shape rule there, 67 vs 2); OPEN, a population-scope cause, not a node-type one. Full gate at bc7c261: tests 2308, pass 2307, skipped 1, fail 0, exit 0

follow-up: the Yggdrasil corpus line (advisory name-shape counts on fixture folders carrying their own .yggdrasil, 72 vs 4 and 67 vs 2) is issue 294.

round 3 (b0fabe7, 8e454d3). ran: node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs with the engine files at bc7c261 (from plugins/grain) · saw: tests 15, pass 8, fail 7 (PHP catch, Java and Groovy for-each, nested Java for-each, Python and PHP special methods, binding named constructor all counted and refused); with the fix: tests 14, pass 14. C++ for_range_loop and expansion_statement never reach a named method scope in the probe (the range-for gets no name), so the rule covers them defensively and no C++ case is claimed; C# local_function_statement is function-like and stays (case). Rule: a method-kind scope whose node type matches statement|clause|loop and is not function-like is out of the name-shape and name-suffix count; reserved special names (PHP magic methods, Python __x__) join the language-fixed table in engine/config.mjs with the constructor names; a binding named as a fixed name is left out too. Lattice: tests/subgate-name-shape-lattice-fills-nodes.test.mjs runs a real propose on a scratch repository and asserts partitionLattice's row carries nnt (arrow_function, function_declaration) and the check built from it reads them; with the nnt line nulled it fails. Koa lib (corpus repo at 824c1cf, grain at 96907db, propose, yg adopt, yg check --no-approve --full): lib/candidate-auto-nameshape announced 22, yg refused 22; filename-shape rules 4 and 2 agree too. Full gate at 8e454d3: tests 2323, pass 2322, skipped 1, fail 0, exit 0 (a first run at 96907db failed the engine-module-size budget by 461 characters in scopes.mjs, fixed by shortening comments in 8e454d3). The Yggdrasil corpus line of this issue (72 vs 4, nested .yggdrasil file population) moves to its own issue, per the reviewer's ruling; it is not fixed here. docs: docs/reference.md name-shape paragraph already updated in b0fabe7 (reserved special methods and statement scopes); the final pass must not apply it again. Needs: EXTR_V and MODEL_V, named in the body of b0fabe7.
- **ran (history):** node --import ./tests/git-env.mjs --test tests/name-shape-declaration-population.test.mjs and tests/name-shape-rust-struct-literal-end-to-end.test.mjs, engine files at 8e454d3 then at 8ad627b (from plugins/grain); full-gate.sh at 8ad627b · **saw:** round 4 (8ad627b). Before: population tests 19, pass 14, fail 5 (Rust struct literal, Groovy closure call, Ruby marked and operator names, PHP closure variable and __myHook, Scala def this and C# destructor counted and refused); end-to-end test fail 1 (nnt [function_item, struct_expression]). After: 19/19 and 1/1. Predicate moved to nameFacts in engine/extract.mjs, fixed names and marker stripping in engine/config.mjs, rendered check strips the marker; scopes.mjs 48712 characters. Full gate: tests 2329, pass 2328, skipped 1, fail 0, exit 0. Needs: EXTR_V and MODEL_V (commit body). docs: docs/reference.md name-shape paragraph: add that call, struct-literal and language-fixed names (Ruby operators, initialize, PHP __ names, Scala this, destructors) are outside the count and that PHP $ and Ruby ?/!/= are read without the marker
- **ran (history):** cd plugins/grain && npm test (full gate) · **saw:** tests 2329, pass 2328, fail 0, skipped 1, exit 0, merge c638feb

