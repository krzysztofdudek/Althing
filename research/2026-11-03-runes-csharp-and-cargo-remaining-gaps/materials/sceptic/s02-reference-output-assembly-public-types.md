---
id: s02-reference-output-assembly-public-types
language: csharp
category: project
expectation: edge
cites: "MSBuild ProjectReference metadata ReferenceOutputAssembly=false: the referenced assembly is not passed to the compiler"
---

## Rule

Sceptic probe. p21 used two implicit `Program` classes, which are internal, so it mixed this rule with issue 489. Here both types are public: Tests sees only Api's `App.Clock`.

## Files

```xml path=src/Api/Api.csproj
<Project Sdk="Microsoft.NET.Sdk"></Project>
```

```csharp path=src/Api/Clock.cs
namespace App;
public class Clock { }
```

```xml path=src/Worker/Worker.csproj
<Project Sdk="Microsoft.NET.Sdk"></Project>
```

```csharp path=src/Worker/Clock.cs
namespace App;
public class Clock { }
```

```xml path=src/Tests/Tests.csproj
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <ProjectReference Include="..\Api\Api.csproj" />
    <ProjectReference Include="..\Worker\Worker.csproj" ReferenceOutputAssembly="false" />
  </ItemGroup>
</Project>
```

```csharp path=src/Tests/ClockTests.cs
namespace App.Tests;
public class ClockTests {
  Clock _c;
}
```

## Expect

- src/Tests/ClockTests.cs:3 -> node:Api

## Why

Probe.
