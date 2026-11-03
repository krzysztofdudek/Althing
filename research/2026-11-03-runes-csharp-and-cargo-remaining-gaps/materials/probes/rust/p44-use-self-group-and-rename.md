---
id: p44-use-self-group-and-rename
language: rust
category: import
expectation: edge
cites: "Rust Reference, Use declarations (`self` in a group, `as` renames)"
---

## Rule

`use crate::billing::{self, Invoice as Inv};` binds `billing` twice (module and its item); `use super::orders as o;` from `src/api/mod.rs` binds `src/orders/mod.rs`.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod billing;
mod orders;
mod api;
```

```rust path=src/billing/mod.rs
pub struct Invoice;
```

```rust path=src/orders/mod.rs
pub struct Order;
```

```rust path=src/api/mod.rs
use crate::billing::{self, Invoice as Inv};
use super::orders as o;
```

## Expect

- src/lib.rs:1 -> node:billing
- src/lib.rs:2 -> node:orders
- src/lib.rs:3 -> node:api
- src/api/mod.rs:1 -> node:billing
- src/api/mod.rs:2 -> node:orders
