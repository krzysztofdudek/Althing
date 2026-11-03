---
id: p33-delegate-nested-in-class
language: csharp
category: declaration
expectation: edge
cites: "C# spec §21.2 (a delegate declared in a class is a nested type); §7.6.1"
---

## Rule

`Pipeline.Step` is a delegate nested in a class of node core; `Pipeline.Step s` in node web depends on it.

## Files

```csharp path=src/core/Pipeline.cs
namespace App.Core;
public class Pipeline { public delegate int Step(int x); }
```

```csharp path=src/web/Use.cs
using App.Core;
namespace App.Web;
public class Use {
  Pipeline.Step _s;
}
```

## Expect

- src/web/Use.cs:4 -> node:core

## Why

Probe.
