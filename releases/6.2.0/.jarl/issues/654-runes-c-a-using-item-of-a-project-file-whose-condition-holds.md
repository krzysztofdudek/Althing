# 654 · Runes, C#: a Using item of a project file whose Condition holds a raw > before its Include is not r…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2018-zbqe
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-549-opus
**Where:** the review of 549, 552, 555, 559, 577, 584, 594, 595, 619, 628, 636

## What
Runes, C#: a Using item of a project file whose Condition holds a raw > before its Include is not read (src/relations/extractors/csharp-project.mts:102 still reads the tag up to the first >; the property readers at csharp-msbuild.mts:26 and csharp-reach.mts:181, and the HintPath and _Parameter1 child elements, read a start tag the same way): <Using Condition="'$(LangVersion)' > '10'" Include="App.Core" /> in Web.csproj gives no edge from Order _o in src/Web/Api.cs, where the &gt; spelling gives src/Web/Api.cs:3->Core. The same on the base; the readers 552 fixed use the quoted-value text (ATTRS) and these do not.

## Why


## Acceptance


## Evidence

