---
id: p16-file-local-type-in-own-file
language: csharp
category: declaration
expectation: silence
cites: "C# 11 file-local types feature specification (a file-local type is in scope in its own file, and there it takes precedence over a type of the same name in the same namespace declared in another file)"
---

## Rule

`src/web/Use.cs` declares `file class Helper` and uses `Helper`. The public `App.Helper` of node util is another type of the same name, which the file-local one hides inside its file.

## Files

```csharp path=src/web/Use.cs
namespace App;
file class Helper { }
class C {
  Helper h;
}
```

```csharp path=src/util/Helper.cs
namespace App;
public class Helper { }
```

## Expect

- silence

## Why

Probe.
