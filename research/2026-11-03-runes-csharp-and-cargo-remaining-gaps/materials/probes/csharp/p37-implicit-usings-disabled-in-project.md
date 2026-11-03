---
id: p37-implicit-usings-disabled-in-project
language: csharp
category: project
expectation: silence
cites: "MSBuild property evaluation (the project file's value is evaluated after Directory.Build.props and wins); MS Learn, implicit using directives"
---

## Rule

Control. `Directory.Build.props` enables implicit usings, the project disables them; `services.AddInfra()` has no extension in scope.

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
  <PropertyGroup><ImplicitUsings>disable</ImplicitUsings></PropertyGroup>
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

- silence

## Why

Probe.
