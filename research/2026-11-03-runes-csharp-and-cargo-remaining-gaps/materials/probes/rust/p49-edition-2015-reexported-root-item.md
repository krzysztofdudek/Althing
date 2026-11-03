---
id: p49-edition-2015-reexported-root-item
language: rust
category: import
expectation: edge
cites: "Rust Reference, Use declarations (2015: relative to the crate root)"
---

## Rule

Edition 2015: `src/lib.rs` has `mod error;` and `pub use error::Error;`. In `src/api/mod.rs`, `use Error;` names the root's re-export, which binds the root file (owner root); `use error::Kind;` the module file `src/error/mod.rs` (node error).

## Files

```toml path=Cargo.toml
[package]
name = "app"
```

```rust path=src/lib.rs owner=root
mod error;
mod api;
pub use error::Error;
```

```rust path=src/error/mod.rs
pub struct Error;
pub enum Kind {}
```

```rust path=src/api/mod.rs
use Error;
use error::Kind;
```

## Expect

- src/lib.rs:1 -> node:error
- src/lib.rs:2 -> node:api
- src/lib.rs:3 -> node:error
- src/api/mod.rs:1 -> node:root
- src/api/mod.rs:2 -> node:error
