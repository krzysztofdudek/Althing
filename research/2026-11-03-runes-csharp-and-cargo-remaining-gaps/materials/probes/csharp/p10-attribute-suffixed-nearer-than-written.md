---
id: p10-attribute-suffixed-nearer-than-written
language: csharp
category: attribute
expectation: edge
cites: "C# spec §23.3 (each of the two readings is resolved as a type name, §7.6.1; the attribute class among them is the result)"
---

## Rule

`[Audit]` inside `App.Web`: the suffixed reading `AuditAttribute` binds the enclosing-namespace member `App.Web.AuditAttribute` (node attrs), the written reading binds `Lib.Audit` (node lib, a plain class) only through a using. C# binds node attrs.

## Files

```csharp path=src/attrs/AuditAttribute.cs
namespace App.Web;
public class AuditAttribute : System.Attribute { }
```

```csharp path=src/lib/Audit.cs
namespace Lib;
public class Audit { }
```

```csharp path=src/web/Controller.cs
using Lib;
namespace App.Web;
public class Controller {
  [Audit] public void Get() { }
}
```

## Expect

- src/web/Controller.cs:4 -> node:attrs

## Why

Probe.
