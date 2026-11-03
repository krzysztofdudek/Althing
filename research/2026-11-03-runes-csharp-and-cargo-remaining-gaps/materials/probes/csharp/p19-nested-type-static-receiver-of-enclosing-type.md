---
id: p19-nested-type-static-receiver-of-enclosing-type
language: csharp
category: nested
expectation: silence
cites: "C# spec §12.8.4 (simple names: a nested type of an enclosing type is a member found before any namespace member)"
---

## Rule

Inside `Order`, `Status.Paid` reads the nested enum `Order.Status`, not the global `Status` of node codes.

## Files

```csharp path=src/core/Order.cs
namespace App.Core;
public class Order {
  public enum Status { New, Paid }
  public Status S = Status.Paid;
}
```

```csharp path=src/codes/Status.cs
public static class Status { public static int Paid = 1; }
```

## Expect

- silence

## Why

Probe.
