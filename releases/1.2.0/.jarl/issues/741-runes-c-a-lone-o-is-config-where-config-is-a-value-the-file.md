# 741 · Runes, C#: a lone o is Config, where Config is a value the file declares, is still read as a type

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-imsh
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** w-696-opus
**Where:** jarl/696-csharp at 7693a11, the C# is-pattern reading

## What
After 708, a dotted head of an is chain that the file declares as a value reads nothing. A lone o is Config, where Config is a field, a property or a local the file declares, is still read as the type Config, which can give an edge to a file that declares a type of that name.

Moved from issue 741 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
An edge to a type named like a value of the file is a false edge where such a type exists elsewhere in the repository.

## Acceptance
[test] A lone o is Config where Config is a value the file declares gives no edge, while a type Config the file does not shadow keeps its edge; a catalogue case red before and green after · by: npm run check

## Evidence

