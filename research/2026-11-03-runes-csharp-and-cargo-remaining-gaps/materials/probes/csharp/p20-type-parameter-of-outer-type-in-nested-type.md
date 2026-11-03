---
id: p20-type-parameter-of-outer-type-in-nested-type
language: csharp
category: generics
expectation: silence
cites: "C# spec §7.6.1 (a type parameter of an enclosing type declaration is in scope in its nested types)"
---

## Rule

Control: inside `Outer<T>.Inner`, `T` names the outer type parameter, never the global type `T` of node t.

## Files

```csharp path=src/a/Outer.cs
namespace App;
public class Outer<T> { public class Inner { T x; } }
```

```csharp path=src/t/T.cs
public class T { }
```

## Expect

- silence

## Why

Probe.
