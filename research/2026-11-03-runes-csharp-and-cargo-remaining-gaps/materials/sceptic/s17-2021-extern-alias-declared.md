---
id: s17-2021-extern-alias-declared
language: rust
category: import
expectation: edge
cites: "As p17, with src/api/mod.rs declaring the importing module"
---

## Rule

Edition 2021, root `extern crate engine_core as core2;`: the alias is in the extern prelude, so `use core2::Engine;` in the declared module `src/api/client.rs` is the dependency.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"

[dependencies]
engine-core = { path = "engine-core" }
```

```toml path=engine-core/Cargo.toml
[package]
name = "engine-core"
edition = "2021"
```

```rust path=engine-core/src/lib.rs owner=dep
pub struct Engine;
```

```rust path=src/lib.rs owner=root
extern crate engine_core as core2;
mod api;
```

```rust path=src/api/mod.rs
mod client;
```

```rust path=src/api/client.rs
use core2::Engine;
```

## Expect

- src/api/client.rs:1 -> node:dep
