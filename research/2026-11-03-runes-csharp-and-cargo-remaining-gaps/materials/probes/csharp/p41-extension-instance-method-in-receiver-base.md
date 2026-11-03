---
id: p41-extension-instance-method-in-receiver-base
language: csharp
category: extension
expectation: silence
cites: "C# spec §12.8.10.3 (an applicable instance method, inherited ones included, wins over any extension method)"
---

## Rule

`this.Save()` in `OrderRepo` calls the inherited `RepoBase.Save`. The extension `Save(this Document)` of node docs, in scope through the enclosing namespace, is not considered.

## Files

```csharp path=src/data/RepoBase.cs
namespace App;
public abstract class RepoBase { public void Save() { } }
```

```csharp path=src/docs/DocumentExtensions.cs
namespace App;
public class Document { }
public static class DocumentExtensions { public static void Save(this Document d) { } }
```

```csharp path=src/web/OrderRepo.cs
namespace App;
public class OrderRepo : RepoBase {
  public void Commit() { this.Save(); }
}
```

## Expect

- src/web/OrderRepo.cs:2 -> node:data

## Why

Probe.
