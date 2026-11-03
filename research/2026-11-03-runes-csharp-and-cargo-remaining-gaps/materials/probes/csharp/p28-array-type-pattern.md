---
id: p28-array-type-pattern
language: csharp
category: usage-site
expectation: edge
cites: "C# spec §11.2.5 (type pattern: an array type)"
---

## Rule

`o is Note[]` names `Note`.

## Files

```csharp path=src/models/Note.cs
namespace App.Models;
public class Note { }
```

```csharp path=src/web/Check.cs
using App.Models;
namespace App.Web;
public class Check {
  public bool E(object o) => o is Note[];
}
```

## Expect

- src/web/Check.cs:4 -> node:models

## Why

Probe.
