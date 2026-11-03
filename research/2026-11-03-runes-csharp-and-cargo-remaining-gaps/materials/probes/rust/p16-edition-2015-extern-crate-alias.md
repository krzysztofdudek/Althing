---
id: p16-edition-2015-extern-crate-alias
language: rust
category: import
expectation: edge
cites: "Rust Reference, Extern crate declarations (`extern crate foo as bar;` binds `bar` in the declaring module); Use declarations (2015: relative to the crate root)"
---

## Rule

Edition 2015: `src/lib.rs` has `extern crate engine_core as core2;` for path dependency `engine-core`. In a submodule `use core2::Engine;` is the crate root's `core2`, the dependency's `engine-core/src/lib.rs` (owner dep).

## Files

```toml path=Cargo.toml
[package]
name = "app"

[dependencies]
engine-core = { path = "engine-core" }
```

```toml path=engine-core/Cargo.toml
[package]
name = "engine-core"
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
