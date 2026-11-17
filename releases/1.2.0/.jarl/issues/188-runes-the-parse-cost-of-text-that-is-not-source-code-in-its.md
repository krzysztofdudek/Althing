# 188 · Runes: the parse cost of text that is not source code in its language is stated as a limit (what is left of 188)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261117T1032-bhyc
**Tags:** runes, docs, performance
**Files:** Runes/README.md, Runes/CHANGELOG.md
**Repo:** Runes
**Found by:** runes-168
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#triage
**Where:**

## What
Checked on 2026-11-09 against Runes release/1.1.0 and again at v1.1.0: every point of 188 is done (the C# alias forms, and the tsconfig, Cargo and walk points split off as 236, 237 and 238), except one. The grammar's own parse of text that is not source code in its language takes time that grows with its size (measured on random printable text with 5% newlines: JavaScript 2.3 s for 250 000 characters and 8.1 s for 1 000 000, C# 0.8 and 3.2 s, Rust 0.6 and 2.5 s, Python 0.5 and 1.9 s, Java 0.4 and 1.8 s), and ruling D10 (a) of the 6.2.0 plan gives the sentence that states it to the final pass. Neither CHANGELOG.md nor README.md says it at v1.1.0.

Moved from issue 188 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer that reads every file of a repository meets this on generated or binary-like files and cannot tell a slow parse from a hang unless the limit is written down.

## Acceptance
[read] README.md (the host or limits section) and the CHANGELOG [1.2.0] section state that a file that is not source code in its language parses in time that grows with its size, and that a consumer caps the size of the files it reads and skips binaries, consistent with what 765 states about memory

## Evidence

