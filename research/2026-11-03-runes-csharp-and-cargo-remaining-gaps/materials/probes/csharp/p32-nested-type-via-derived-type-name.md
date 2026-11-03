---
id: p32-nested-type-via-derived-type-name
language: csharp
category: nested
expectation: edge
cites: "C# spec §7.6.1 (in `N.I` with N a type, I is an accessible nested type of N or of its base classes)"
---

## Rule

`Derived.Options` names `Base.Options` (node core), inherited through `Derived` (node mid).

## Files

```csharp path=src/core/Base.cs
namespace App;
public class Base { public class Options { } }
```

```csharp path=src/mid/Derived.cs
namespace App;
public class Derived : Base { }
```

```csharp path=src/web/Use.cs
namespace App.Web;
public class Use {
  Derived.Options _o;
}
```

## Expect

- src/web/Use.cs:3 -> node:core

## Why

Probe.
