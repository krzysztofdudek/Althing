---
id: p11-instance-method-in-other-file-beats-extension
language: csharp
category: extension
expectation: edge
cites: "C# spec §12.8.10.3 (an extension method is considered only when the normal processing of the invocation finds no applicable instance method)"
---

## Rule

`order.Validate()` calls the instance method `Order.Validate` declared in node core; the in-scope extension `Validate(this Customer)` of node ext is never considered.

## Files

```csharp path=src/core/Order.cs
namespace App.Core;
public class Order { public bool Validate() => true; }
```

```csharp path=src/ext/CustomerExtensions.cs
namespace App.Core;
public class Customer { }
public static class CustomerExtensions { public static bool Validate(this Customer c) => true; }
```

```csharp path=src/web/Checkout.cs
using App.Core;
namespace App.Web;
public class Checkout {
  public bool Run(Order order) {
    return order.Validate();
  }
}
```

## Expect

- src/web/Checkout.cs:4 -> node:core      # the parameter type; line 5 binds an instance method

## Why

Probe.
