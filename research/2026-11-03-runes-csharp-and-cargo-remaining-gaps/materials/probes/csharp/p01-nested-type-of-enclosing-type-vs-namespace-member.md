---
id: p01-nested-type-of-enclosing-type-vs-namespace-member
language: csharp
category: nested
expectation: silence
cites: "C# spec §7.6.1 (namespace and type names: the nested types of each enclosing type are read before any namespace member)"
---

## Rule

Inside `CreateOrder.Handler`, the bare `Command` names the nested type `CreateOrder.Command` of the enclosing type, which C# finds before the member `App.Command` of an enclosing namespace. The vertical-slice layout (a static class per feature with a nested `Command`, `Query`, `Handler`, `Result`).

## Files

```csharp path=src/web/CreateOrder.cs
namespace App.Web;
public static class CreateOrder {
  public record Command(int Id);
  public class Handler { public void Handle(Command c) { } }
}
```

```csharp path=src/shared/Command.cs
namespace App;
public class Command { }
```

## Expect

- silence      # Command binds CreateOrder+Command in node web

## Why

Probe.
