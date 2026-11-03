---
id: p39-nested-workspace-dep-relative-path
language: rust
category: import
expectation: edge
cites: "The Cargo Book, The [workspace] section, The dependencies table (a path in [workspace.dependencies] is relative to the workspace root)"
---

## Rule

`[workspace.dependencies] util = { path = "libs/util" }` in the root; member `services/api` writes `util = { workspace = true }`. The path is relative to the root, so `use util::slug;` binds `libs/util/src/lib.rs`.

## Files

```toml path=Cargo.toml
[workspace]
members = ["services/api", "libs/util"]

[workspace.dependencies]
util = { path = "libs/util" }
```

```toml path=libs/util/Cargo.toml
[package]
name = "util"
edition = "2021"
```

```toml path=services/api/Cargo.toml
[package]
name = "api"
edition = "2021"

[dependencies]
util = { workspace = true }
```

```rust path=libs/util/src/lib.rs owner=util
pub fn slug() {}
```

```rust path=services/api/src/main.rs owner=api
use util::slug;
fn main() {}
```

## Expect

- services/api/src/main.rs:1 -> node:util
