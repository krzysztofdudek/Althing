---
id: p17-generic-arity-split-across-nodes
language: csharp
category: generics
expectation: edge
cites: "C# spec §7.6.1 (the arity is part of the lookup: `Result` and `Result<T>` are two types, so neither name is ambiguous)"
---

## Rule

`Result` lives in node a and `Result<T>` in node b, one namespace. `Result` binds a, `Result<int>` binds b.

## Files

```csharp path=src/a/Result.cs
namespace Shop.Results;
public class Result { }
```

```csharp path=src/b/ResultOfT.cs
namespace Shop.Results;
public class Result<T> { }
```

```csharp path=src/app/Uses.cs
using Shop.Results;
class Uses {
  Result _r;
  Result<int> _ri;
}
```

## Expect

- src/app/Uses.cs:3 -> node:a
- src/app/Uses.cs:4 -> node:b

## Why

Probe.
