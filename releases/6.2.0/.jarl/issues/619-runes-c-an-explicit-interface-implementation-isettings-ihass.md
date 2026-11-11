# 619 · Runes, C#: an explicit interface implementation (ISettings IHasSettings.Settings => ...) counts as …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1611-tkuy
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-494b-opus
**Where:** the review of 493, 494, 497, 498

## What
Runes, C#: an explicit interface implementation (ISettings IHasSettings.Settings => ...) counts as a name the file declares, so Settings.Get() in the same class gives no edge to a static class Settings, though C# finds no member of that name in the class (an explicit implementation is reached through the interface alone) and binds the type. The same on 28e52cf and 520a82d. Probe: IHasSettings with a property Settings in node core, a static class Settings in node legacy, and class C : IHasSettings in node web implementing it explicitly and calling Settings.Get().

## Why


## Acceptance


## Evidence

