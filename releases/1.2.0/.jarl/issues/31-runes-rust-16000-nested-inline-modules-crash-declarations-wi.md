# 31 · Runes, Rust: 16000 nested inline modules crash declarations() with a stack overflow, and paths under nested inline modules cost time that grows with the square of the depth

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1551-sqeb
**Tags:** runes, rust, performance
**Files:** 
**Repo:** Runes
**Found by:** w-7-opus
**Where:** Runes/src/relations/extractors/rust.mts, declarations() and the inline-module scope walk
**Branch:** jarl/31-rust-nested-modules

## What
Found by the worker of 7 and 8 at the branch jarl/7-rust-scope: a Rust file of 16000 nested inline mod blocks makes declarations() throw a stack overflow (RangeError), and paths under nested inline modules take time that grows with the square of the nesting depth (4000 levels take 1.6 s). Whether v1.1.0 already did both is to be checked first.

## Why
A thrown stack overflow stops a consumer's whole pass on one crafted or generated file, against the extractors' guarantee that malformed or deep input is read without throwing and in linear time.

## Acceptance
[test] A Rust file of 16000 nested inline modules is read without throwing, and its declarations and uses are produced in linear time, in a bounded test in the style of the existing linear-time tests, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Confirmed before any change: v1.1.0 (1f3476b, from git archive, npm ci, npm run grammars, its committed dist) and release/1.2.0 (f64a1ca, committed dist) behave the same, so under ruling runes-1-2-0-cut-for-new-findings the fault moves to the next Runes version and nothing was changed. Probe: a scratch script that parses one generated file with the package's own test host and times rustExtractor.declarations(file) and rustExtractor.uses(file) apart, each run under systemd-run MemoryMax=8G, nice 15, timeout 300. Shapes: bare = N times 'mod a {' then N times '}'; use = 'mod a { use x<i>::Y;' at each level; path = 'mod a { fn f() { x<i>::g(); }' at each level. Throw: declarations() throws RangeError (Maximum call stack size exceeded) at 16000 levels for all three shapes on both versions (v1.1.0 after 286/1046/1223 ms, 1.2.0 after 281/1048/1224 ms), and already at 4000 levels for bare and 8000 for use and path on both. Scaling, declarations at 1000/2000/4000: v1.1.0 bare 56/179/throw ms, use 70/227/864, path 72/267/1029; 1.2.0 bare 54/180/throw, use 68/225/859, path 73/259/1241. Scaling, uses at 1000/2000/4000/8000/16000: v1.1.0 bare 23/78/296/1144/4505 ms, use 36/112/400/1525/6073, path 62/136/483/1941/8670; 1.2.0 bare 28/85/304/1159/4566, use 40/119/418/1551/6080, path 50/151/512/2051/8993. Both versions grow about four times per doubling of the depth (the square) in both functions, and the bare shape, which emits nothing, shows the cost lies in the walk under nested modules itself, not in the names-in-scope lookup of issues 7 and 8. Outputs agree between the versions except the path shape, where v1.1.0 emits no in::x<i>::g edges at all (the in:: reading of a bare path came later in the 1.1.0 to 1.2.0 line) and 1.2.0 emits one per level. Neither part was caused by 1.2.0's changes.

Deferred: To the next Runes version: v1.1.0 throws the same stack overflow at 16000 nested inline modules and scales the same way (w-31-opus measured both, numbers in its note); not caused by 1.2.0's changes (ruling runes-1-2-0-cut-for-new-findings)

