---
id: p29-extension-on-interface-instance-method-other-file
language: csharp
category: extension
expectation: edge
cites: "C# spec §12.8.10.3 (an extension method is considered only when no applicable instance method is found); §12.8.10.2"
---

## Rule

`_bus.Publish(e)` calls `IBus.Publish`, an interface method declared in node core. The extension `Publish(this OutboxContext, object)` of node outbox, in scope through the using, is not considered.

## Files

```csharp path=src/core/IBus.cs
namespace App.Messaging;
public interface IBus { void Publish(object e); }
```

```csharp path=src/outbox/OutboxExtensions.cs
namespace App.Messaging;
public class OutboxContext { }
public static class OutboxExtensions { public static void Publish(this OutboxContext c, object e) { } }
```

```csharp path=src/web/Handler.cs
using App.Messaging;
namespace App.Web;
public class Handler {
  private readonly IBus _bus;
  public void Run(object e) { _bus.Publish(e); }
}
```

## Expect

- src/web/Handler.cs:4 -> node:core      # the field type; line 5 calls an interface method

## Why

Probe.
