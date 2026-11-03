---
id: s03-attribute-external-suffixed-vs-domain-class
language: csharp
category: attribute
expectation: silence
cites: "C# spec §23.3 (attribute names: of the two readings, the one that is an attribute class is the result)"
---

## Rule

Sceptic probe, the common form of p09. A logistics domain has a class `Route`; the controller imports the domain and uses ASP.NET's `[Route]`, which is `RouteAttribute` of the framework. In-repo, only the non-attribute `App.Domain.Route` exists, so no edge is due for line 5.

## Files

```csharp path=src/domain/Route.cs
namespace App.Domain;
public class Route { }
```

```csharp path=src/web/RoutesController.cs
using App.Domain;
using Microsoft.AspNetCore.Mvc;
namespace App.Web;
public class RoutesController {
  [Route("api/routes")] public void Get() { }
}
```

## Expect

- silence

## Why

Probe.
