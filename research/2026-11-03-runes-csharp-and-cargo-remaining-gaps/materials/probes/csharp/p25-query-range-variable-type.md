---
id: p25-query-range-variable-type
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §12.20.3.2 (a from clause with an explicit range variable type: `from T x in e` is `e.Cast<T>()`)"
---

## Rule

`from Row r in xs` names `Row`.

## Files

```csharp path=src/models/Row.cs
namespace App.Models;
public class Row { }
```

```csharp path=src/web/Q.cs
using App.Models;
namespace App.Web;
public class Q {
  object M(System.Collections.IEnumerable xs) => from Row r in xs select r;
}
```

## Expect

- src/web/Q.cs:4 -> node:models

## Why

Probe.
