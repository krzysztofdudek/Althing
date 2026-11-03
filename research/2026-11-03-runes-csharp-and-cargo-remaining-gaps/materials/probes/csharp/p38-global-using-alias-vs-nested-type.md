---
id: p38-global-using-alias-vs-nested-type
language: csharp
category: nested
expectation: silence
cites: "C# spec §7.6.1 (a nested type of an enclosing type is found before any namespace member and any using alias)"
---

## Rule

A project-wide `global using Result = Lib.Result;` and a nested `Handler.Result`: inside `Handler`, `Result` is the nested type.

## Files

```csharp path=src/web/GlobalUsings.cs
global using Result = Lib.Result;
```

```csharp path=src/web/Handler.cs
namespace App.Web;
public class Handler {
  public record Result(int Id);
  public Result Run() => new Result(1);
}
```

```csharp path=src/lib/Result.cs
namespace Lib;
public class Result { }
```

## Expect

- src/web/GlobalUsings.cs:1 -> node:lib      # the alias target

## Why

Probe.
