---
id: p04-inherited-property-as-receiver
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §12.8.4 (simple names: the members of the enclosing type, inherited ones included, are read before any namespace member); §12.8.7 (member access)"
---

## Rule

`Settings.Get("x")` in a class derived from `ApiBase` reads the inherited property `Settings`, not the static class `App.Settings` of another node.

## Files

```csharp path=src/core/ApiBase.cs
namespace App.Core;
public class AppSettings { public string Get(string k) => k; }
public abstract class ApiBase { protected AppSettings Settings { get; } = new(); }
```

```csharp path=src/legacy/Settings.cs
namespace App;
public static class Settings { public static string Get(string k) => k; }
```

```csharp path=src/web/OrdersController.cs
using App.Core;
namespace App.Web;
public class OrdersController : ApiBase {
  public string M() => Settings.Get("x");
}
```

## Expect

- src/web/OrdersController.cs:3 -> node:core      # the base class; line 4 reads a property

## Why

Probe.
