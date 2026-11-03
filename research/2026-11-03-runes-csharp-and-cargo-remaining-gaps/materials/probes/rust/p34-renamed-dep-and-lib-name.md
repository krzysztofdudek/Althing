---
id: p34-renamed-dep-and-lib-name
language: rust
category: import
expectation: edge
cites: "The Cargo Book, Specifying dependencies, Renaming dependencies in Cargo.toml (`package =`); Cargo targets, Library ([lib] name)"
---

## Rule

`store = { path = "../db", package = "db-core" }` is named `store` in code; `fmtx = { path = "../fmt" }` whose package is `fmtx` with `[lib] name = "fmt_ext"` is named `fmt_ext`. `use store::Pool;` and `use fmt_ext::pretty;` bind each library; `use fmtx::pretty;` names no crate and stays silent.

## Files

```toml path=app/Cargo.toml
[package]
name = "app"
edition = "2021"

[dependencies]
store = { path = "../db", package = "db-core" }
fmtx = { path = "../fmt" }
```

```toml path=db/Cargo.toml
[package]
name = "db-core"
edition = "2021"
```

```toml path=fmt/Cargo.toml
[package]
name = "fmtx"
edition = "2021"

[lib]
name = "fmt_ext"
```

```rust path=db/src/lib.rs owner=db
pub struct Pool;
```

```rust path=fmt/src/lib.rs owner=fmt
pub fn pretty() {}
```

```rust path=app/src/lib.rs owner=root
use store::Pool;
use fmt_ext::pretty;
use fmtx::pretty as p2;
```

## Expect

- app/src/lib.rs:1 -> node:db
- app/src/lib.rs:2 -> node:fmt
