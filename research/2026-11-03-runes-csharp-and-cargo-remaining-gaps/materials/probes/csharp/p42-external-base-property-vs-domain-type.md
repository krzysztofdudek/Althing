---
id: p42-external-base-property-vs-domain-type
language: csharp
category: usage-site
expectation: silence
cites: "C# spec §12.8.4 (simple names: an inherited member of the enclosing type, from a base class in a referenced assembly too, is read before any namespace member); ASP.NET Core ControllerBase.User"
---

## Rule

An ASP.NET controller derives from the framework's `ControllerBase`, which has the property `User`. `User.FindFirst("sub")` reads that property, never the domain class `App.Domain.User` of node domain that the using imports.

## Files

```csharp path=src/domain/User.cs
namespace App.Domain;
public class User { public static object FindFirst(string t) => t; }
```

```csharp path=src/web/OrdersController.cs
using App.Domain;
using Microsoft.AspNetCore.Mvc;
namespace App.Web;
public class OrdersController : ControllerBase {
  public object Me() => User.FindFirst("sub");
}
```

## Expect

- silence

## Why

Probe.
