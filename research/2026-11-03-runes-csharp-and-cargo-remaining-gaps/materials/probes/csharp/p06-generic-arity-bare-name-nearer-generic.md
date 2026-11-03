---
id: p06-generic-arity-bare-name-nearer-generic
language: csharp
category: generics
expectation: edge
cites: "C# spec §7.6.1 (a name with no type arguments binds only a type with no type parameters)"
---

## Rule

The bare `Envelope` needs a non-generic type. `App.Envelope<T>` (node core) is generic, so C# binds `Lib.Envelope` (node lib) through the using.

## Files

```csharp path=src/core/Envelope.cs
namespace App;
public class Envelope<T> { }
```

```csharp path=src/lib/Envelope.cs
namespace Lib;
public class Envelope { }
```

```csharp path=src/web/Api.cs
using Lib;
namespace App.Web;
public class Api {
  public Envelope Get() => null;
}
```

## Expect

- src/web/Api.cs:4 -> node:lib

## Why

Probe.
