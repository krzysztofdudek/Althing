---
id: p12-using-static-nested-type
language: csharp
category: using
expectation: edge
cites: "C# spec §14.5.4 (using static directive: imports the nested types and static members of the type)"
---

## Rule

`using static App.Core.Shapes;` imports the nested type `Shapes.Circle`; the bare `Circle` on line 4 binds it.

## Files

```csharp path=src/core/Shapes.cs
namespace App.Core;
public static class Shapes { public class Circle { } }
```

```csharp path=src/web/Draw.cs
using static App.Core.Shapes;
namespace App.Web;
public class Draw {
  Circle c;
}
```

## Expect

- src/web/Draw.cs:1 -> node:core      # the directive's target
- src/web/Draw.cs:4 -> node:core      # Shapes+Circle

## Why

Probe.
