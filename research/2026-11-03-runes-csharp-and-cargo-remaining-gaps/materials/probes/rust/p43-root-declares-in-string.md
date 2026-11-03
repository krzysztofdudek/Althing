---
id: p43-root-declares-in-string
language: rust
category: import
expectation: silence
cites: "Rust Reference, Macros by example (`#[macro_export]`); Tokens, String literals"
---

## Rule

As p42, but the root's text mentions `fn ensure` inside a string literal and a nested function inside another fn: neither is an item of the crate root. `use crate::ensure;` must not bind the root file (owner root).

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod macros;
mod api;
pub const HELP: &str = "call fn ensure first";
fn setup() { fn ensure() {} ensure(); }
```

```rust path=src/macros/mod.rs owner=mac
#[macro_export]
macro_rules! ensure { () => {}; }
```

```rust path=src/api/mod.rs
use crate::ensure;
```

## Expect

- src/lib.rs:1 -> node:mac
