# 753 · Runes: classifyUse gives no reason for a use in C, C++ or Ruby

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-rptr
**Tags:** api, c, cpp, ruby, runes
**Files:** Runes/src/relations/resolver.mts
**Repo:** Runes
**Found by:** research research/2026-11-15-runes-readers-gaps-after-1-1-0
**Source:** research/2026-11-15-runes-readers-gaps-after-1-1-0#runes-readers-2026-11-15-c-ruby-reason, research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#triage
**Where:** Runes/src/relations/resolve-path.mts:221, Runes/src/relations/resolver.mts:855

## What
At Runes v1.1.0 (1f3476b) classifyUse answers {"kind":"absent"} with no reason for a use in C, C++ or Ruby that binds no file. Run on a listed file view: a quoted include of a header with no file (missing.h), a system include (stdio.h), a C++ include (vector, missing.hpp), a Ruby require of the standard library (json) and a require_relative with no file (./missing) all print the bare absent, where Python's os prints absent with reason outside. The cause is that explainMiss (resolve-path.mts:221-228) answers for TypeScript, JavaScript, Python, Go, PHP and Rust only, and a symbol hint of any other language than C# and the JVM ones reads as no reason (resolver.mts:855), so the walk ends at the bare absent (resolver.mts:900). docs/api.md says the reason is left out in C, C++ and Ruby and that they may gain reasons.

Moved from issue 753 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer that must report a use it could not follow and stay quiet about one that leaves the repository cannot do it in these three languages: #include <stdio.h> and a missing local header read the same, and so do require 'json' and a missing require_relative. It has to guess from the shape of the specifier, which is a second reader that can disagree with Runes. A new family tool that uses the readers as they are reported it.

## Acceptance
- [test] In C and C++, an angle include that binds no file of the repository gives reason outside and a quoted include with no file gives unfollowed; in Ruby, a require_relative with no file gives unfollowed, a constant the repository declares nothing of (JSON) gives outside, and a constant under a namespace the repository declares that binds no file gives unfollowed; one case each per language, red at v1.1.0 and green after, and every answer of an existing case and every edge stays as it is · by: npm run check
- [read] Runes/docs/api.md no longer says the reason is left out in C, C++ and Ruby, says that a plain Ruby require stays unread, and the issue's changelog entry names the change (Runes keeps no Unreleased section)

## Evidence

