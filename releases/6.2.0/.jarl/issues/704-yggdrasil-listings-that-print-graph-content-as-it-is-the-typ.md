# 704 · Yggdrasil: listings that print graph content as it is (the type column of yg tree, the Type line of yg find, the rules and participants of yg flows, the body of yg context) show a key-shaped name whole

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** light
**Key:** 20261112T0317-snch
**Tags:** yggdrasil, keys
**Files:** 
**Repo:** Yggdrasil
**After:** 683
**Found by:** jarl
**Where:** w-683-sonnet, keys-more package report
**Branch:** jarl/690-small-rest

## What


## Why
Every finding and refusal now masks a key-shaped value, but a key pasted as a type, rule or node name still prints whole wherever the graph is listed; whether a listing should mask it, or the name should be refused when the graph loads, is open.

## Acceptance
[test] A key-shaped name in the graph is either refused when the graph loads, with a message that masks it, or masked in every listing that prints it (yg tree, yg find, yg flows, yg context), red before and green after · by: cd source/cli && npm test

## Evidence

### Notes

Assumed: mask in the listings rather than refuse at load. The key shape (a provider prefix, then 20 or more name characters holding an uppercase letter or a digit) also matches ordinary names (a provider prefix such as sk- followed by a long report title), so refusing at load would turn a working repository red, while masking costs such a name only its tail in four listings. Yggdrasil also states elsewhere that it never refuses a configuration over where a key sits. A masked name cannot be typed back as an argument; the owner of such a name has to rename it anyway, since a committed key is already exposed. yg check's own grouped 'at:' listing still prints a key-shaped rule name whole; it is outside the four listings of the issue and is filed under Found.

Dropped: Ruling yggdrasil-no-key-masking: Yggdrasil does not mask key-shaped values.

Assumed: dropped by the owner (ruling yggdrasil-no-key-masking: Yggdrasil masks no key-shaped values); the masking commit was reverted by a further commit and no work remains for 704.

