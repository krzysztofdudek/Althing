---
id: p36-implicit-usings-web-sdk-extension
language: csharp
category: project
expectation: edge
cites: "MS Learn, implicit using directives (Microsoft.NET.Sdk.Web adds Microsoft.Extensions.DependencyInjection); C# spec §12.8.10.3"
---

## Rule

Control. Api uses the Web SDK with `ImplicitUsings` set in `Directory.Build.props`; an extension in `Microsoft.Extensions.DependencyInjection` declared by the referenced Infra project binds `services.AddInfra()`.

## Files

```xml path=src/Directory.Build.props
<Project><PropertyGroup><ImplicitUsings>enable</ImplicitUsings></PropertyGroup></Project>
```

```xml path=src/Infra/Infra.csproj
<Project Sdk="Microsoft.NET.Sdk"></Project>
```

```csharp path=src/Infra/InfraExtensions.cs
namespace Microsoft.Extensions.DependencyInjection;
public static class InfraExtensions { public static object AddInfra(this object services) => services; }
```

```xml path=src/Api/Api.csproj
<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup><ProjectReference Include="..\Infra\Infra.csproj" /></ItemGroup>
</Project>
```

```csharp path=src/Api/Startup.cs
namespace Api;
public class Startup {
  public void Configure(object services) {
    services.AddInfra();
  }
}
```

## Expect

- src/Api/Startup.cs:4 -> node:Infra

## Why

Probe.
