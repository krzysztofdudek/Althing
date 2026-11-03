---
id: p48-edition-2015-extern-crate-then-use
language: rust
category: import
expectation: edge
cites: "Rust Reference, Extern crate declarations; Use declarations (2015: relative to the crate root)"
---

## Rule

Edition 2015, `src/lib.rs` has `extern crate kit;` for path dependency `kit` and `mod api;`. In `src/api/mod.rs`, `use kit::Engine;` binds `kit/src/lib.rs` (owner dep), and `use api::helper;` from the root binds nothing across owners; `use std::fmt;` stays silent.

## Files

```toml path=Cargo.toml
[package]
name = "app"

[dependencies]
kit = { path = "kit" }
```

```toml path=kit/Cargo.toml
[package]
name = "kit"
```

```rust path=kit/src/lib.rs owner=dep
pub struct Engine;
```

```rust path=src/lib.rs owner=root
extern crate kit;
mod api;
```

```rust path=src/api/mod.rs
use kit::Engine;
use std::fmt;
```

## Expect

- src/lib.rs:1 -> node:dep
- src/lib.rs:2 -> node:api
- src/api/mod.rs:1 -> node:dep
