---
id: p50-dep-root-glob-reexport
language: rust
category: import
expectation: edge
cites: "Rust Reference, Use declarations, Glob imports (a `pub use m::*;` at the crate root makes every public item of `m` a path from the root); The Cargo Book, Specifying dependencies"
---

## Rule

Path dependency `kit`, whose `src/lib.rs` is `mod types; pub use types::*;`. In `app`, `use kit::Order;` names kit's root re-export of `types::Order`: the dependency edge exists, to the root `kit/src/lib.rs` (owner kitroot) or the defining `kit/src/types/mod.rs` (node types); silence loses the only edge between the two crates.

## Files

```toml path=app/Cargo.toml
[package]
name = "app"
edition = "2021"

[dependencies]
kit = { path = "../kit" }
```

```toml path=kit/Cargo.toml
[package]
name = "kit"
edition = "2021"
```

```rust path=kit/src/lib.rs owner=kitroot
mod types;
pub use types::*;
```

```rust path=kit/src/types/mod.rs
pub struct Order;
```

```rust path=app/src/lib.rs owner=root
use kit::Order;
```

## Expect

- kit/src/lib.rs:1 -> node:types
- kit/src/lib.rs:2 -> node:types
- app/src/lib.rs:1 -> node:kitroot
