---
id: p18-partial-class-property-receiver
language: csharp
category: usage-site
expectation: silence
cites: "C# spec §12.8.4 (simple names: the members of the enclosing type, from every part of a partial type, are read before any namespace member); §15.2.7 (partial types)"
---

## Rule

One part of `partial class OrderService` declares the property `Cache`; the other part calls `Cache.Get(1)`, which reads that property, not the static class `App.Cache` of node legacy.

## Files

```csharp path=src/web/OrderService.cs
namespace App.Web;
public partial class OrderService { private CacheClient Cache { get; } = new(); }
public class CacheClient { public int Get(int k) => k; }
```

```csharp path=src/web/OrderService.Get.cs
namespace App.Web;
public partial class OrderService {
  public int M() => Cache.Get(1);
}
```

```csharp path=src/legacy/Cache.cs
namespace App;
public static class Cache { public static int Get(int k) => k; }
```

## Expect

- silence

## Why

Probe.
