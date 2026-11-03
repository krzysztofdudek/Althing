---
id: p13-edition-2018-uniform-path-imported-module
language: rust
category: import
expectation: edge
cites: "Rust Reference, Use declarations (edition 2018: a `use` path may start with a name an earlier `use` brought into scope)"
---

## Rule

Edition 2021, in `src/api/client.rs`: `use crate::shapes;` then `use shapes::Circle;`. The second path starts at the name `shapes` the first one bound, the module `src/shapes/mod.rs` (node shapes).

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs
mod shapes;
mod api;
```

```rust path=src/shapes/mod.rs
pub struct Circle;
```

```rust path=src/api/client.rs
use crate::shapes;
use shapes::Circle;
```

## Expect

- src/api/client.rs:1 -> node:shapes
- src/api/client.rs:2 -> node:shapes
- src/lib.rs:1 -> node:shapes
