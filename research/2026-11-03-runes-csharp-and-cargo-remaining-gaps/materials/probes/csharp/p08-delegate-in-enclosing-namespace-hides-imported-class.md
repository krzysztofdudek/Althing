---
id: p08-delegate-in-enclosing-namespace-hides-imported-class
language: csharp
category: declaration
expectation: silence
cites: "C# spec §21 (a delegate is a type); §7.6.1 (an enclosing namespace's member is read before the using directives of the compilation unit)"
---

## Rule

`App.Web.Handler` is a delegate of node web. Inside `App.Web`, the bare `Handler` names it, never `App.Core.Handler` of node core that the using imports.

## Files

```csharp path=src/web/Handler.cs
namespace App.Web;
public delegate void Handler(int id);
```

```csharp path=src/web/Bus.cs
using App.Core;
namespace App.Web;
public class Bus {
  Handler _h;
}
```

```csharp path=src/core/Handler.cs
namespace App.Core;
public class Handler { }
```

## Expect

- silence

## Why

Probe.
