---
id: p43-is-generic-type
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §12.12.12 (the is operator with a type: `e is T`)"
---

## Rule

`o is IEnumerable<Order>` and `o is Box<Item>` name `Order`, `Box` and `Item`.

## Files

```csharp path=src/models/Models.cs
namespace App.Models;
public class Order { }
public class Box<T> { }
public class Item { }
```

```csharp path=src/web/Check.cs
using App.Models;
namespace App.Web;
public class Check {
  public bool A(object o) => o is System.Collections.Generic.IEnumerable<Order>;
  public bool B(object o) => o is Box<Item>;
}
```

## Expect

- src/web/Check.cs:4 -> node:models
- src/web/Check.cs:5 -> node:models

## Why

Probe.
