---
id: p07-delegate-type-declared
language: csharp
category: declaration
expectation: edge
cites: "C# spec §21 (delegates: a delegate declaration declares a type); §7.6.1"
---

## Rule

A delegate declaration declares a type. A field of that type in another node depends on it.

## Files

```csharp path=src/core/OrderHandler.cs
namespace App.Core;
public delegate void OrderHandler(int id);
```

```csharp path=src/web/Bus.cs
using App.Core;
namespace App.Web;
public class Bus {
  OrderHandler _h;
}
```

## Expect

- src/web/Bus.cs:4 -> node:core

## Why

Probe.
