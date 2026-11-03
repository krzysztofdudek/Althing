---
id: p35-using-static-nested-type-hides-global
language: csharp
category: using
expectation: edge
cites: "C# spec §14.5.4 (using static imports nested types); §7.6.1 (inside namespace App.Web, the using directives of the enclosing namespace declaration are read before the global namespace's members)"
---

## Rule

`using static App.Core.Shapes;` sits inside `namespace App.Web { }`. The bare `Circle` there binds `Shapes.Circle` (node core) at the level of App.Web, before the global `Circle` of node legacy.

## Files

```csharp path=src/core/Shapes.cs
namespace App.Core;
public static class Shapes { public class Circle { } }
```

```csharp path=src/web/Draw.cs
namespace App.Web {
  using static App.Core.Shapes;
  public class Draw {
    Circle c;
  }
}
```

```csharp path=src/legacy/Circle.cs
public class Circle { }
```

## Expect

- src/web/Draw.cs:2 -> node:core      # the directive's target
- src/web/Draw.cs:4 -> node:core      # Shapes+Circle

## Why

Probe.
