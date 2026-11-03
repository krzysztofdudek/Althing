---
id: p41-glob-reexport-root
language: rust
category: import
expectation: edge
cites: "Rust Reference, Use declarations, Glob imports; Paths (`crate`)"
---

## Rule

`src/lib.rs` has `pub use types::*;` and `mod types;`. `use crate::Order;` in `src/api/mod.rs` names the item the glob re-exports. A path-following reader may bind the root `src/lib.rs` (owner root) as for a named re-export, or stay silent; it must never bind an unrelated file.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod types;
mod api;
pub use types::*;
```

```rust path=src/types/mod.rs
pub struct Order;
```

```rust path=src/api/mod.rs
use crate::Order;
```

## Expect

- src/lib.rs:1 -> node:types
- src/lib.rs:2 -> node:api
- src/lib.rs:3 -> node:types
