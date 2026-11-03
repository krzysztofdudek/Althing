---
id: s10-edition-inline-declared
language: rust
category: import
expectation: silence
cites: "As p10, with src/api/mod.rs declaring `mod client;` so the importing file is in the module tree"
---

## Rule

As p10: the member is edition 2021 through `edition = { workspace = true }`, so `use config::Config;` in the declared module `src/api/client.rs` is the registry crate.

## Files

```toml path=Cargo.toml
[workspace]
members = ["app"]

[workspace.package]
edition = "2021"
```

```toml path=app/Cargo.toml
[package]
name = "app"
edition = { workspace = true }

[dependencies]
config = "0.14"
```

```rust path=app/src/lib.rs owner=root
mod config;
mod api;
```

```rust path=app/src/config/mod.rs
pub struct Config;
```

```rust path=app/src/api/mod.rs
mod client;
```

```rust path=app/src/api/client.rs
use config::Config;
```

## Expect

- app/src/lib.rs:1 -> node:config
- app/src/lib.rs:2 -> node:api
