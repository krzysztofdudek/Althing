---
id: p22-compile-remove-excluded-file
language: csharp
category: project
expectation: edge
cites: "MSBuild: `<Compile Remove>` takes a file out of the compilation, so its declarations do not exist for the compiler; C# spec §7.6.1"
---

## Rule

Web removes `Old/**` from its compilation. `Old/Order.cs` declares `App.Order`, as does the referenced Core project. `Order` in Web binds Core's.

## Files

```xml path=src/Core/Core.csproj
<Project Sdk="Microsoft.NET.Sdk"></Project>
```

```csharp path=src/Core/Order.cs
namespace App;
public class Order { }
```

```xml path=src/Web/Web.csproj
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <Compile Remove="Old/**" />
    <ProjectReference Include="..\Core\Core.csproj" />
  </ItemGroup>
</Project>
```

```csharp path=src/Web/Old/Order.cs
namespace App;
public class Order { }
```

```csharp path=src/Web/Api.cs
namespace App;
public class Api {
  Order _o;
}
```

## Expect

- src/Web/Api.cs:3 -> node:Core

## Why

Probe.
