---
id: p13-using-static-extension-method
language: csharp
category: extension
expectation: edge
cites: "C# spec §14.5.4 (using static imports the extension methods of the type for extension invocation); §12.8.10.3"
---

## Rule

`using static App.Ext.StringExt;` makes `Shout` an extension method in scope; `s.Shout()` binds it.

## Files

```csharp path=src/ext/StringExt.cs
namespace App.Ext;
public static class StringExt { public static string Shout(this string s) => s; }
```

```csharp path=src/web/A.cs
using static App.Ext.StringExt;
namespace App.Web;
public class A {
  public string M(string s) => s.Shout();
}
```

## Expect

- src/web/A.cs:1 -> node:ext
- src/web/A.cs:4 -> node:ext

## Why

Probe.
