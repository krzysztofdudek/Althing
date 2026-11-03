---
id: p20-path-attr-after-doc-comment
language: rust
category: import
expectation: silence
cites: "Rust Reference, Modules, The path attribute"
---

## Rule

`#[path = "imp/unix.rs"]`, then a doc comment, then `mod sys;`: the attribute still applies, so the module is `src/imp/unix.rs`. A conventional `src/sys/mod.rs` (node sys) exists as a decoy and is no module of the crate. Runes skips `#[path]` mods, so the expected outcome is silence, never an edge to node sys.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs
#[path = "imp/unix.rs"]
/// Platform layer.
mod sys;
```

```rust path=src/imp/unix.rs
pub fn f() {}
```

```rust path=src/sys/mod.rs
pub fn f() {}
```

## Expect

- silence
