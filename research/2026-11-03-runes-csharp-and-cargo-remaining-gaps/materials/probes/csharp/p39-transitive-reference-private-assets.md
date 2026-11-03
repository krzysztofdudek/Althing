---
id: p39-transitive-reference-private-assets
language: csharp
category: project
expectation: edge
cites: "NuGet/MSBuild: PrivateAssets=\"all\" on a ProjectReference keeps it from flowing to the consumers of the referencing project; C# spec §7.6.1 (CS0104 only among the types the compilation sees)"
---

## Rule

Web references Core; Core references Shared with `PrivateAssets="all"`, so Web does not see Shared. Web imports `App.Shared` and `App.Lib`; only `App.Lib.Order` (Lib, referenced by Web) is visible, so `Order` binds Lib.

## Files

```xml path=src/Shared/Shared.csproj
<Project Sdk="Microsoft.NET.Sdk"></Project>
```

```csharp path=src/Shared/Order.cs
namespace App.Shared;
public class Order { }
```

```xml path=src/Lib/Lib.csproj
<Project Sdk="Microsoft.NET.Sdk"></Project>
```

```csharp path=src/Lib/Order.cs
namespace App.Lib;
public class Order { }
```

```xml path=src/Core/Core.csproj
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup><ProjectReference Include="..\Shared\Shared.csproj" PrivateAssets="all" /></ItemGroup>
</Project>
```

```xml path=src/Web/Web.csproj
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <ProjectReference Include="..\Core\Core.csproj" />
    <ProjectReference Include="..\Lib\Lib.csproj" />
  </ItemGroup>
</Project>
```

```csharp path=src/Web/Api.cs
using App.Shared;
using App.Lib;
namespace App.Web;
public class Api {
  Order _o;
}
```

## Expect

- src/Web/Api.cs:5 -> node:Lib

## Why

Probe.
