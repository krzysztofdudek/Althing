# 299 · Grain: methods counted for a name-shape rule that the rendered check cannot name (C and C++ functions and constructors named through a declarator, Lua functions bound by assignment)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2138-dcae
**Tags:** grain, check
**Files:** Grain/plugins/grain/engine/scopes.mjs, Grain/plugins/grain/engine/propose-checks.mjs
**Repo:** ../../../Grain
**Found by:** rev-grain-003-opus3
**Where:** plugins/grain/engine/scopes.mjs:547-570 (Lua), plugins/grain/engine/propose-checks.mjs:188-192 (the name lookup), C and C++ declarator-named functions
**After:** 003

## What


Grain counts some methods that the rendered name-shape check cannot name, so the rule announces N and the check refuses fewer (it only under-fires; nothing is refused that should not be). Lua functions bound by assignment are counted but the check looks for the name on the function's direct parent, which has none: a probe counted 4 and refused 2. C and C++ functions and constructors named through a declarator (including the constructors Foo and Foo::Foo) are counted but never refused: 4 counted, 0 refused. Consequences: the changelog of 003 overclaims (a constructor or destructor is neither counted nor refused is false for C++; a bound function is checked under its name is false for Lua): narrow those two clauses in the final pass until this issue lands. The reviewer also noted: the name-suffix population is controlled by the same facts (not said in the changelog); the fixed-name test runs for every kind of scope but the type-name check never applies it (a PHP type named __X leaves the count but would still be refused); the header comment of config.mjs still says the constructor rule lives in scopes.mjs and does not describe the new strip field; a named function expression used as a parameter default is refused but not counted (probe: 8 counted, 9 refused).

## Why


A rule that announces more than it enforces is a promise the check does not keep, and a C++ constructor counted as a method is a false deviant waiting for the next adopter.

## Acceptance


- On a C++ fixture and a Lua fixture the rule's announced N equals the check's refusals file by file, and a C++ constructor or destructor is outside the count.
- The fixed-name and marker rules are applied by the type-name check as well, with a PHP case; a named function expression in a parameter default is counted or not refused, with a case.
- The comments of config.mjs say where the constructor rule lives and what strip does; the 003 changelog clauses are corrected to what holds.

## Evidence

