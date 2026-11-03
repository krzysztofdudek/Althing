---
id: p17-edition-2018-extern-crate-alias-prelude
language: rust
category: import
expectation: edge
cites: "Rust Reference, Preludes, Extern prelude (an `extern crate` at the crate root adds its name, the alias when renamed, to the extern prelude)"
---

## Rule

Edition 2021: `src/lib.rs` has `extern crate engine_core as core2;`. The alias is in the extern prelude, so `use core2::Engine;` in any module names the dependency `engine-core/src/lib.rs` (owner dep).

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

```rust path=src/api/client.rs
use core2::Engine;
```

## Expect

- src/api/client.rs:1 -> node:dep
- src/lib.rs:1 -> node:dep
