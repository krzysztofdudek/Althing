---
id: p11-edition-dotted-workspace-control
language: rust
category: import
expectation: silence
cites: "The Cargo Book, The [workspace] section (`edition.workspace = true`)"
---

## Rule

Control of p10 with the dotted spelling `edition.workspace = true`: edition 2021, so `use config::Config;` is the registry crate, silence.

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
edition.workspace = true

[dependencies]
config = "0.14"
```

```rust path=app/src/lib.rs
mod config;
mod api;
```

```rust path=app/src/config/mod.rs
pub struct Config;
```

```rust path=app/src/api/client.rs
use config::Config;
```

## Expect

- silence
