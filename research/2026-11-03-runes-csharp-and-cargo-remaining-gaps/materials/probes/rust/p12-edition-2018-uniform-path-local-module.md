---
id: p12-edition-2018-uniform-path-local-module
language: rust
category: import
expectation: edge
cites: "Rust Reference, Use declarations, Paths (edition 2018 uniform paths: a `use` path may start with a name in scope of the current module, such as a module it declares)"
---

## Rule

Edition 2021, `src/lib.rs` declares `mod shapes;` and then `pub use shapes::Circle;`: the path starts with the name `shapes` in scope in the root, the local module (src/shapes/mod.rs, node shapes). Line 1 (`mod`) and line 2 (`use`) both bind it.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs
mod shapes;
pub use shapes::Circle;
```

```rust path=src/shapes/mod.rs
pub struct Circle;
```

## Expect

- src/lib.rs:1 -> node:shapes
- src/lib.rs:2 -> node:shapes
