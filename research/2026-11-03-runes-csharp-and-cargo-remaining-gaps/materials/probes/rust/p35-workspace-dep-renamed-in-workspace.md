---
id: p35-workspace-dep-renamed-in-workspace
language: rust
category: import
expectation: edge
cites: "The Cargo Book, The [workspace] section, The dependencies table (a member's `{ workspace = true }` inherits the workspace entry, `package` included)"
---

## Rule

Root `[workspace.dependencies] store = { path = "crates/db", package = "db-core" }`; member writes `store.workspace = true`. Code names it `store`.

## Files

```toml path=Cargo.toml
[workspace]
members = ["crates/*"]

[workspace.dependencies]
store = { path = "crates/db", package = "db-core" }
```

```toml path=crates/db/Cargo.toml
[package]
name = "db-core"
edition = "2021"
```

```toml path=crates/app/Cargo.toml
[package]
name = "app"
edition = "2021"

[dependencies]
store.workspace = true
```

```rust path=crates/db/src/lib.rs owner=db
pub struct Pool;
```

```rust path=crates/app/src/lib.rs owner=root
use store::Pool;
```

## Expect

- crates/app/src/lib.rs:1 -> node:db
