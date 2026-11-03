---
id: p30-extension-on-inherited-field-receiver
language: csharp
category: extension
expectation: edge
cites: "C# spec §12.8.10.3 (extension method invocation on any expression whose value is an instance)"
---

## Rule

`Services` is a property inherited from `ModuleBase` (node core); `Services.AddBilling()` calls the extension of node billing.

## Files

```csharp path=src/core/ModuleBase.cs
namespace App.Core;
public class ServiceSet { }
public abstract class ModuleBase { protected ServiceSet Services { get; } = new(); }
```

```csharp path=src/billing/BillingExtensions.cs
namespace App.Core;
public static class BillingExtensions { public static void AddBilling(this ServiceSet s) { } }
```

```csharp path=src/web/WebModule.cs
using App.Core;
namespace App.Web;
public class WebModule : ModuleBase {
  public void Configure() { Services.AddBilling(); }
}
```

## Expect

- src/web/WebModule.cs:3 -> node:core
- src/web/WebModule.cs:4 -> node:billing

## Why

Probe.
