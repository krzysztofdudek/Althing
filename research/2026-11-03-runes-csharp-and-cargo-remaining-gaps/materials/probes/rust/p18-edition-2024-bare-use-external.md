---
id: p18-edition-2024-bare-use-external
language: rust
category: import
expectation: silence
cites: "Rust Reference, Use declarations (edition 2018 on; 2024 keeps the rule)"
---

## Rule

Edition 2024: `use shapes::Circle;` in a submodule that has no `shapes` in scope names an external crate; silence even though the root declares `mod shapes;`.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2024"
```

```rust path=src/lib.rs owner=root
mod api;
mod shapes;
```

```rust path=src/shapes/mod.rs
pub struct Circle;
```

```rust path=src/api/client.rs
use shapes::Circle;
```

## Expect

- silence
