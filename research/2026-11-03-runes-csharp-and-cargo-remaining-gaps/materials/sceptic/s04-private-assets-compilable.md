---
id: s04-private-assets-compilable
language: csharp
category: project
expectation: edge
cites: "NuGet/MSBuild PrivateAssets=all on a ProjectReference: the reference does not flow to consumers"
---

## Rule

Sceptic probe. p39 imports `App.Shared` in Web, a namespace Web cannot see, so it does not compile. Here the namespace `App.Shared` exists in Web's view through Lib, and Shared's `Order` is hidden by PrivateAssets.

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

```csharp path=src/Lib/Marker.cs
namespace App.Shared;
public class Marker { }
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
