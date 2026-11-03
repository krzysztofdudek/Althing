---
id: p27-qualified-type-pattern
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §11.2.5 (type pattern), §12.12.12 (the is operator with a type)"
---

## Rule

`o is App.Models.Order` and `o is Models.Order` name `Order` by a qualified name.

## Files

```csharp path=src/models/Order.cs
namespace App.Models;
public class Order { }
```

```csharp path=src/web/Check.cs
namespace App.Web;
public class Check {
  public bool A(object o) => o is App.Models.Order;
  public bool B(object o) => o is Models.Order m;
  public bool C(object o) => o switch { Models.Order => true, _ => false };
}
```

## Expect

- src/web/Check.cs:3 -> node:models
- src/web/Check.cs:4 -> node:models
- src/web/Check.cs:5 -> node:models

## Why

Probe.
