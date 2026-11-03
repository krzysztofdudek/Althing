---
id: p34-function-pointer-type
language: csharp
category: usage-site
expectation: edge
cites: "C# spec, function pointers (C# 9): `delegate*<T, void>` names its parameter and return types"
---

## Rule

`delegate*<Order, void>` names `Order`.

## Files

```csharp path=src/models/Order.cs
namespace App.Models;
public struct Order { }
```

```csharp path=src/web/Native.cs
using App.Models;
namespace App.Web;
public unsafe class Native {
  delegate*<Order, void> _cb;
}
```

## Expect

- src/web/Native.cs:4 -> node:models

## Why

Probe.
