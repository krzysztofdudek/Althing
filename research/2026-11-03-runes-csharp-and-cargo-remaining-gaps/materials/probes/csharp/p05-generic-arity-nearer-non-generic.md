---
id: p05-generic-arity-nearer-non-generic
language: csharp
category: generics
expectation: edge
cites: "C# spec §7.6.1 (a namespace-or-type-name with K type arguments binds only a type with K type parameters)"
---

## Rule

`Result<int>` needs a type with one type parameter. `App.Result` (node core) has none, so C# reads on and binds `Lib.Result<T>` (node lib) through the using.

## Files

```csharp path=src/core/Result.cs
namespace App;
public class Result { }
```

```csharp path=src/lib/Result.cs
namespace Lib;
public class Result<T> { }
```

```csharp path=src/web/Api.cs
using Lib;
namespace App.Web;
public class Api {
  public Result<int> Get() => null;
}
```

## Expect

- src/web/Api.cs:4 -> node:lib

## Why

Probe.
