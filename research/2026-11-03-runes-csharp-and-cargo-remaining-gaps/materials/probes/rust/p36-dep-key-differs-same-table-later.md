---
id: p36-dep-key-differs-same-table-later
language: rust
category: import
expectation: edge
cites: "The Cargo Book, Specifying dependencies (a dev-dependency may repeat a normal dependency to add features; both name the same package)"
---

## Rule

`[dependencies] core-lib = { path = "../core-lib" }` and `[dev-dependencies] core-lib = { path = "../core-lib", features = ["test"] }`: one crate `core_lib` in every target. `use core_lib::X;` from `tests/t.rs` binds it.

## Files

```toml path=app/Cargo.toml
[package]
name = "app"
edition = "2021"

[dependencies]
core-lib = { path = "../core-lib" }

[dev-dependencies]
core-lib = { path = "../core-lib", features = ["test"] }
```

```toml path=core-lib/Cargo.toml
[package]
name = "core-lib"
edition = "2021"
```

```rust path=core-lib/src/lib.rs owner=core
pub struct X;
```

```rust path=app/src/lib.rs owner=root
pub fn f() {}
```

```rust path=app/tests/t.rs owner=tests
use core_lib::X;
```

## Expect

- app/tests/t.rs:1 -> node:core
