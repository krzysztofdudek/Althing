---
id: p42-macro-export-use-crate
language: rust
category: import
expectation: silence
cites: "Rust Reference, Macros by example, Path-based scope (`#[macro_export]` puts the macro in the crate root)"
---

## Rule

`#[macro_export] macro_rules! ensure` lives in `src/macros/mod.rs`; `src/lib.rs` declares `mod macros;` and also `use std::fmt::Debug;` and nothing named `ensure`. `use crate::ensure;` in `src/api/mod.rs` names the macro; the root file must not be bound for it. Silence (or an edge to node macros) is right; node root is wrong.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod macros;
mod api;
// ensure the API is stable
```

```rust path=src/macros/mod.rs owner=root
#[macro_export]
macro_rules! ensure { () => {}; }
```

```rust path=src/api/mod.rs
use crate::ensure;
```

## Expect

- silence
