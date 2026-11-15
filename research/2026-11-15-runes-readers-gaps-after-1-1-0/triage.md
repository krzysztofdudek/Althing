# Triage

Every run is on Runes v1.1.0 at 1f3476b0e49f982a0d7615acfdd29d279fe3c53a (branch release/1.1.0, tree clean, dist/ as committed). Paths are `Runes/<path>:<line>` at that commit.

## 1. The grammars are not in the package

Verdict: gap. It works as built (README.md says "the recipe and the pins, not the bytes"), but a consumer that parses anything has to run the build.

- `npm pack --dry-run --json` lists 162 files, 458,121 bytes packed, 1,588,189 unpacked, and none of them is a `.wasm` or a `node-types.json`. `package.json` `files` is `dist`, `grammars`, `skills`, `docs/api.md`, `CHANGELOG.md`; `grammars/` holds `manifest.json`, `manifest.schema.json` and four patches.
- `Runes/grammars/manifest.json` pins 23 grammars: 9 `npm`, 3 `github-release`, 11 `source` (typescript, tsx, java, csharp, cpp, php, ruby, json, kotlin, yaml, toml). A `source` pin is checked out at its commit, patched, generated and compiled by `tree-sitter build --wasm` (`Runes/src/grammars/build.mts:128-141`).
- That compile fetches its toolchain on first use. On this machine, after the first build: `du -sh ~/.cache/tree-sitter/*` printed 302M `binaryen` and 638M `wasi-sdk`, 940M in all. The built grammars themselves sit in `~/.cache/runes/grammars` and take 24M.
- A source build is refused on Windows (`Runes/src/grammars/build.mts:58`), so a Windows consumer has to bring a cache from another machine.
- The README names this ("a cold one downloads and builds from source"), so it is not a defect; it is what a new consumer pays before its first parse.

## 2. classifyUse gives no reason in C, C++ and Ruby

Verdict: gap, documented. `Runes/docs/api.md` says "in C, C++ and Ruby it is left out" and that those languages "may gain reasons".

- `node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/classify-use-c-ruby.mjs <Runes checkout>` printed, for path uses with no file in a listed view: `c missing.h`, `c stdio.h`, `cpp vector`, `cpp missing.hpp`, `ruby json`, `ruby ./missing`, each `{"kind":"absent"}`, and `python os` `{"kind":"absent","reason":"outside"}`.
- Cause: `explainMiss` in `Runes/src/relations/resolve-path.mts:221-228` answers for TypeScript, JavaScript, Python, Go, PHP and Rust and returns undefined for anything else; for a symbol hint (the form Ruby constants and C++ names take) `readingReason` returns undefined at `Runes/src/relations/resolver.mts:855` unless the language is C# or a JVM one. The final answer is then the bare absent at `Runes/src/relations/resolver.mts:900`.
- Effect: a consumer cannot stay quiet about `#include <stdio.h>` or `require 'json'` and still report `#include "missing.h"` or `require_relative './missing'`.

## 3. A nested type inherited from a library type reads unfollowed in Java

Verdict: defect of the reason, not of the edge: the use binds no file either way, but the answer says "a place of the repository the readers could not follow" for a name that leaves the repository.

- Minimal case (a git repository with `src/app/Tree.java`: `class Tree<K, V> extends AbstractMap<K, V>`, a field `Map.Entry<K, V> a;` and a field `Entry<K, V> b;`): `node research/2026-11-15-runes-readers-gaps-after-1-1-0/materials/java-inherited-nested-type.mjs <Runes checkout> <that repository>` printed `src/app/Tree.java:8	java.util.AbstractMap+Entry | app.Entry` as unfollowed and `uses 4 {"absent:outside":3,"absent:unfollowed":1}`. The written `Map.Entry` is answered outside; the bare `Entry`, which `AbstractMap` inherits from `Map`, is unfollowed.
- google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, the same script: 10,675 uses, `{"resolved":3092,"absent:outside":7563,"absent:unfollowed":20}`. Of the 20 unfollowed uses, 14 are this shape: 12 bare `Entry` in `gson/src/main/java/com/google/gson/internal/LinkedTreeMap.java` (a class that extends `AbstractMap` and implements `Serializable`; lines 220, 442, 459, 511, 512, 590, 597, 598, 600, 608, 613, 617), one bare `Entry` in `gson/src/test/java/com/google/gson/functional/MapTest.java:411` (an anonymous subclass of `AbstractMap`), and one `Context` in `proto/src/test/java/com/google/gson/protobuf/functional/LegacyProtoTypeAdapterFactoryTest.java:452` (inherited from the library class `TestParameterValuesProvider`). The other 6 are the generated protobuf types of 745's shape (no file in the repository).
- Cause: the candidates of such a use are the inherited reading (`java.util.AbstractMap+Entry`) and the same-package reading (`com.google.gson.internal.Entry`). `keyReason` returns `pass` for the first because its level is outside the repository and its separator is `+` (`Runes/src/relations/resolver.mts:814`), and `pass` for the second because the package is the repository's; `classifyUse` then falls to `readOn ? { kind: 'absent', reason: 'unfollowed' }` at `Runes/src/relations/resolver.mts:900`. The inherited reading cannot say outside because Runes does not know that `AbstractMap` has a member type `Entry`.
- This is related to 732 item 5 (a nested type of the same package written `Outer.Inner`) but is not covered by it: that item is about a nested type declared in the repository.

## Reply on GitHub

None: no public issue is involved.
