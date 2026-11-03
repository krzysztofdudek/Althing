---
id: p09-attribute-written-name-not-an-attribute
language: csharp
category: attribute
expectation: edge
cites: "C# spec §23.3 (attribute specification: of the readings `Required` and `RequiredAttribute`, the one that is an attribute class is the result; both being attribute classes is an error)"
---

## Rule

`[Required]` with `App.Domain.Required` (an entity, not an attribute, node domain) and `App.Validation.RequiredAttribute` (an attribute, node val) both imported: only the suffixed reading is an attribute class, so C# binds node val.

## Files

```csharp path=src/domain/Required.cs
namespace App.Domain;
public class Required { }
```

```csharp path=src/val/RequiredAttribute.cs
namespace App.Validation;
public class RequiredAttribute : System.Attribute { }
```

```csharp path=src/web/Dto.cs
using App.Domain;
using App.Validation;
namespace App.Web;
public class Dto {
  [Required] public string Name { get; set; }
}
```

## Expect

- src/web/Dto.cs:5 -> node:val

## Why

Probe.
