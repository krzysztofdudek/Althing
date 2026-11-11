# 594 · Runes, C#: this._config.Get(key) keeps an extension edge when _config is declared in another part o…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1429-obkr
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-494-opus
**Where:** the review of 493, 494, 497, 498

## What
Runes, C#: this._config.Get(key) keeps an extension edge when _config is declared in another part of the partial class, while _config.Get(key) on the same field is silenced by issue 493's member reading. The receiver type of this.<field> is read only from the calling file. Probe: IConfig declares Get(string) in node core, an extension Get(this IConfig, string) sits in node ext, the field is in Page.cs and the call in Page.Render.cs; the this. form gives the extension edge on a1ef8c4 and on 68bf674.

## Why


## Acceptance


## Evidence

