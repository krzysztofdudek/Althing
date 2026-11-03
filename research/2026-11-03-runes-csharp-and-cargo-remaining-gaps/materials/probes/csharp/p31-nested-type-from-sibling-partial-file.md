---
id: p31-nested-type-from-sibling-partial-file
language: csharp
category: nested
expectation: silence
cites: "C# spec §7.6.1 (the nested types of the enclosing type, from every part of a partial type, come before any namespace member); §15.2.7"
---

## Rule

One part of `partial class Importer` nests `Row`; the other part uses the bare `Row`, which is `Importer.Row`, never the global `Row` of node grid.

## Files

```csharp path=src/etl/Importer.cs
namespace App.Etl;
public partial class Importer { public class Row { } }
```

```csharp path=src/etl/Importer.Run.cs
namespace App.Etl;
public partial class Importer {
  public void Run(Row r) { }
}
```

```csharp path=src/grid/Row.cs
public class Row { }
```

## Expect

- silence

## Why

Probe.
