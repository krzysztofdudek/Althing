---
id: p40-alias-target-generic-arity
language: csharp
category: generics
expectation: edge
cites: "C# spec §14.5.2 (the alias target is a namespace-or-type-name resolved where the directive stands), §7.6.1 (arity is part of the lookup)"
---

## Rule

`using R = Result<int>;` inside `namespace App.Web { }`: `App.Result` (node core) is not generic, so the target binds the global `Result<T>` of node gen.

## Files

```csharp path=src/core/Result.cs
namespace App;
public class Result { }
```

```csharp path=src/gen/Result.cs
public class Result<T> { }
```

```csharp path=src/web/Api.cs
namespace App.Web {
  using R = Result<int>;
  public class Api { }
}
```

## Expect

- src/web/Api.cs:2 -> node:gen

## Why

Probe.
