# 594 · Runes, C#: this._config.Get(key) keeps an extension edge when _config is declared in another part o…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1429-obkr
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-494-opus
**Where:** the review of 493, 494, 497, 498
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Runes, C#: this._config.Get(key) keeps an extension edge when _config is declared in another part of the partial class, while _config.Get(key) on the same field is silenced by issue 493's member reading. The receiver type of this.<field> is read only from the calling file. Probe: IConfig declares Get(string) in node core, an extension Get(this IConfig, string) sits in node ext, the field is in Page.cs and the call in Page.Render.cs; the this. form gives the extension edge on a1ef8c4 and on 68bf674.

## Why


## Acceptance


[test] A catalogue case with IConfig declaring Get(string) in node core, an extension Get(this IConfig, string) in node ext, the field _config in Page.cs and the call this._config.Get(key) in Page.Render.cs of one partial class: the call gives no extension edge, the same as _config.Get(key) on that field, red before and green after · by: npm run check

## Changelog
- C#: `this._config.Get(key)` reads the field another part of the partial class, or a base class, declares, as `_config.Get(key)` does, so an instance method of the field's type takes the call before an extension method.

## Evidence

### Proof

- **ran (line 903730e2a0f6):** node --test --test-name-pattern=<case id> test/relations/extractors/csharp-name-resolution-matrix.test.mjs for csharp-this-field-of-other-part-instance-method-silence, on a9912e8 with the new case, then on 2136343 · **saw:** before: fail, unexpected edge src/core/Page.Render.cs:5->ext; after: pass
- **ran (line 903730e2a0f6):** the branch's 13 new catalogue cases and its matrix test file copied into a scratch extraction of a94d31b (the branch's merge base), run with node --test --test-name-pattern=<the 13 case ids> test/relations/extractors/csharp-name-resolution-matrix.test.mjs; then the full suite on a scratch extraction of 9eb9987 (build, grammars, node --test --test-concurrency=6 on every test file, dist compared with the committed dist) · **saw:** before: fail, unexpected edge src/core/Page.Render.cs:5->ext; after: the full suite 2512 tests, 2511 pass, 0 fail, 1 skipped; rebuilt dist identical to the committed dist

### Notes

Assumed: this.<name> is read through the resolver only inside a type that is partial or lists a base, and only where the file declares no member of that name. Where no type of the repository declares the member (a base outside it), the extension readings stand, unlike for the bare name.

