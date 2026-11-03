---
id: p25-self-item-in-name-rs
language: rust
category: import
expectation: silence
cites: "Rust Reference, Paths, `self`"
---

## Rule

In `src/a.rs`, `self::Thing` is an item of `a.rs` itself (same owner, no cross edge). A decoy `src/a/Thing.rs` does not exist; `src/Thing.rs` (node decoy) is a different module and must not be bound.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=a
mod a;
```

```rust path=src/a.rs owner=a
pub struct Thing;
fn g() { let _ = self::Thing; }
```

```rust path=src/Thing.rs owner=decoy
pub struct X;
```

## Expect

- silence
