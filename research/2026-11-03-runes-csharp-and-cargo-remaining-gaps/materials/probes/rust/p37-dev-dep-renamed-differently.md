---
id: p37-dev-dep-renamed-differently
language: rust
category: import
expectation: edge
cites: "The Cargo Book, Specifying dependencies, Renaming dependencies (each table entry names its own crate; a dev-dependency may rename a package differently from the normal table)"
---

## Rule

`[dependencies] engine = { path = "../engine" }` and `[dev-dependencies] engine_testkit = { path = "../engine", package = "engine", features = ["mock"] }`. In `tests/t.rs`, `use engine_testkit::Mock;` binds the engine library (owner engine), as does `use engine::Real;`.

## Files

```toml path=app/Cargo.toml
[package]
name = "app"
edition = "2021"

[dependencies]
engine = { path = "../engine" }

[dev-dependencies]
engine_testkit = { path = "../engine", package = "engine", features = ["mock"] }
```

```toml path=engine/Cargo.toml
[package]
name = "engine"
edition = "2021"
```

```rust path=engine/src/lib.rs owner=engine
pub struct Real;
pub struct Mock;
```

```rust path=app/src/lib.rs owner=root
pub fn f() {}
```

```rust path=app/tests/t.rs owner=tests
use engine_testkit::Mock;
use engine::Real;
```

## Expect

- app/tests/t.rs:1 -> node:engine
- app/tests/t.rs:2 -> node:engine
