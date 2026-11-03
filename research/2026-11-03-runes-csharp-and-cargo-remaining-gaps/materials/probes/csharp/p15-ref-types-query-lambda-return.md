---
id: p15-ref-types-query-lambda-return
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §15.6.1 (ref returns), §13.6.2 (ref locals), §12.20 (query expressions: an explicitly typed range variable), §12.19 (lambda with an explicit return type, C# 10)"
---

## Rule

Each line names a type of node models in a type position.

## Files

```csharp path=src/models/Models.cs
namespace App.Models;
public class Order { }
public class Item { }
public class Line { }
public class Row { }
public class Cell { }
```

```csharp path=src/web/Store.cs
using App.Models;
namespace App.Web;
public class Store {
  public ref Order First() => throw null;
  public ref readonly Item Second() => throw null;
  void M() { ref Line l = ref Get(); }
  object Q(System.Collections.IEnumerable xs) => from Row r in xs select r;
  object F() => Cell () => null;
}
```

## Expect

- src/web/Store.cs:4 -> node:models
- src/web/Store.cs:5 -> node:models
- src/web/Store.cs:6 -> node:models
- src/web/Store.cs:7 -> node:models
- src/web/Store.cs:8 -> node:models

## Why

Probe.
