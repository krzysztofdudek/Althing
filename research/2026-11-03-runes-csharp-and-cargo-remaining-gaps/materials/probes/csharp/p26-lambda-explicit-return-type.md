---
id: p26-lambda-explicit-return-type
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §12.19.1 (C# 10: a lambda may declare its return type)"
---

## Rule

`Cell () => null` names `Cell`.

## Files

```csharp path=src/models/Cell.cs
namespace App.Models;
public class Cell { }
```

```csharp path=src/web/F.cs
using App.Models;
namespace App.Web;
public class F {
  System.Func<Cell> M() => Cell () => null;
}
```

## Expect

- src/web/F.cs:4 -> node:models

## Why

Probe.
