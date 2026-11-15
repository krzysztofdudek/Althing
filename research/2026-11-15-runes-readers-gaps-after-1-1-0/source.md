# Source: three gaps of the Runes readers, as reported

Reported on 2026-11-15 by the builders of a new family tool (Lawcheck, issue 731) that uses Runes' readers as they are, after Runes 1.1.0 was published. The report as it arrived, translated from the sender's words into this list:

1. The tree-sitter grammars are not shipped in the npm package, so every consumer builds them itself (a toolchain download of about 940 MB on first build).
2. `TargetResolver.classifyUse` gives no reason (outside, unfollowed, unowned) for uses in C, C++ and Ruby.
3. In Java, a nested type inherited from a standard-library type and named through it (for example `Map.Entry` used inside a class that implements `java.util.Map`) is classified `unfollowed` rather than `outside` (12 such uses in gson).

The sender asked that each be verified on Runes at tag v1.1.0 and, for the third, on google/gson at commit a961b0fe088f8558d00cc1b56e506a3656907a91, and filed for after 1.1.0.
