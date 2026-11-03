---
id: p21-project-reference-without-output-assembly
language: csharp
category: project
expectation: edge
cites: "MSBuild ProjectReference metadata ReferenceOutputAssembly=false (a build-order dependency: the referenced assembly is not passed to the compiler, so its types are invisible); C# spec §7.6.1"
---

## Rule

Tests references Api (types visible) and Worker with `ReferenceOutputAssembly="false"` (built first, types invisible). Both Api and Worker are top-level-statement programs. `Factory<Program>` binds Api's `Program`.

## Files

```xml path=src/Api/Api.csproj
<Project Sdk="Microsoft.NET.Sdk.Web"></Project>
```

```csharp path=src/Api/Program.cs
var app = 1;
System.Console.WriteLine(app);
```

```xml path=src/Worker/Worker.csproj
<Project Sdk="Microsoft.NET.Sdk.Worker"></Project>
```

```csharp path=src/Worker/Program.cs
var w = 2;
System.Console.WriteLine(w);
```

```xml path=src/Tests/Tests.csproj
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <ProjectReference Include="..\Api\Api.csproj" />
    <ProjectReference Include="..\Worker\Worker.csproj" ReferenceOutputAssembly="false" />
  </ItemGroup>
</Project>
```

```csharp path=src/Tests/ApiTests.cs
namespace Tests;
public class Factory<T> { }
public class ApiTests {
  Factory<Program> _f;
}
```

## Expect

- src/Tests/ApiTests.cs:4 -> node:Api

## Why

Probe.
