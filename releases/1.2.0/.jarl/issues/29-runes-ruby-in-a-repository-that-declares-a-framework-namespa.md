# 29 · Runes, Ruby: in a repository that declares a framework namespace itself (rack's module Rack), the e…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1529-bqqk
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-753-opus
**Where:** the review of 2, 3, 736, 753, 754

## What
Runes, Ruby: in a repository that declares a framework namespace itself (rack's module Rack), the edge walk binds none of the constants it declares under it, because isRubyExternalConstant reads Rack, RSpec, Rake, Bundler, Minitest, Sinatra, Gem and the Rails frameworks as external in every repository: in rack 1856 uses such as lib/rack/content_length.rb:13 Rack::Utils, which lib/rack/utils.rb declares, give no edge. Present at v1.1.0, a recall loss of the readers; found while examining 753.

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: a lost edge v1.1.0 already had (ruling runes-1-2-0-cut-for-new-findings)

