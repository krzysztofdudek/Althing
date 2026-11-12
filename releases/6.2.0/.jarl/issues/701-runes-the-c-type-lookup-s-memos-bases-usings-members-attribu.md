# 701 · Runes: the C# type lookup's memos (bases, usings, members, attribute classes, methods, ancestry, sh…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0305-blkn
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-686c-opus
**Where:** the review of 686

## What
Runes: the C# type lookup's memos (bases, usings, members, attribute classes, methods, ancestry, shapes) and the resolver's answers to C# conditions are kept for the resolver's life and are not renewed when the symbol table takes a declaration, so a resolver whose table takes declarations after its first lookups gives other C# edges than a fresh resolver over the whole table. Found in the round-3 review of 686: on random multi-project repositories declared in two halves around a resolution, 302 of 3000 runs differ from a resolver that met the whole table, the same on the release before 686 and on 686's fix; dropping both together with 686's kept readings gives 0 differences. Today's consumers fill the table before resolving, so no edge is lost in their output; what breaks is any consumer that declares after resolving, and 686's split-run test could not be widened to base lists or using directives without turning red on the release too.

## Why


## Acceptance


## Evidence

