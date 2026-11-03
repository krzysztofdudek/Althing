---
id: p14-edition-2015-leading-colons
language: rust
category: import
expectation: edge
cites: "Rust Reference, Paths, Path qualifiers (`::` — edition 2015: paths starting with `::` are relative to the crate root)"
---

## Rule

Edition 2015 (no edition written): `use ::shapes::Circle;` in a submodule is the crate root's module `shapes` (src/shapes/mod.rs, node shapes).

## Files

```toml path=Cargo.toml
[package]
name = "app"
```

```rust path=src/lib.rs
mod shapes;
mod api;
```

```rust path=src/shapes/mod.rs
pub struct Circle;
```

```rust path=src/api/client.rs
use ::shapes::Circle;
```

## Expect

- src/api/client.rs:1 -> node:shapes
- src/lib.rs:1 -> node:shapes
