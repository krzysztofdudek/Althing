---
id: s01-lambda-return-type-alone
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §12.19.1 (anonymous functions: an explicit return type of a lambda, C# 10)"
---

## Rule

Sceptic probe. `Cell () => null` with no other mention of `Cell` on the line: p26 passed only because its `System.Func<Cell>` return type already names `Cell` on the same line.

## Files

```csharp path=src/models/Cell.cs
namespace App.Models;
public class Cell { }
```

```csharp path=src/web/F.cs
using App.Models;
namespace App.Web;
public class F {
  System.Delegate M() => Cell () => null;
}
```

## Expect

- src/web/F.cs:4 -> node:models

## Why

Probe.
