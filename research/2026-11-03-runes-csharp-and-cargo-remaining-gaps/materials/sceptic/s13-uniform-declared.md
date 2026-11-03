---
id: s13-uniform-declared
language: rust
category: import
expectation: edge
cites: "As p13 and p14, with src/api/mod.rs declaring the client modules"
---

## Rule

Edition 2021. `src/api/client.rs` has `use crate::shapes;` then `use shapes::Circle;`; `src/api/other.rs` has `use crate::shapes;` then `use shapes::round::Arc;`, where `round` is its own node, so the second line is the only edge to it.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod shapes;
mod api;
```

```rust path=src/shapes/mod.rs
pub mod round;
pub struct Circle;
```

```rust path=src/shapes/round/mod.rs
pub struct Arc;
```

```rust path=src/api/mod.rs
mod client;
mod other;
```

```rust path=src/api/client.rs
use crate::shapes;
use shapes::Circle;
```

```rust path=src/api/other.rs
use crate::shapes;
use shapes::round::Arc;
```

## Expect

- src/api/client.rs:1 -> node:shapes
- src/api/client.rs:2 -> node:shapes
- src/api/other.rs:1 -> node:shapes
- src/api/other.rs:2 -> node:round
