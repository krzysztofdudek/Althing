---
id: p08-example-subdir-module
language: rust
category: import
expectation: edge
cites: "Cargo targets.rs infer_subdirectory (examples/<name>/main.rs); Rust Reference, Modules"
---

## Rule

`examples/demo/main.rs` is an example root; `mod ui;` is `examples/demo/ui/mod.rs`, and from that module `crate::state::S` is `examples/demo/state/mod.rs`.

## Files

```toml path=Cargo.toml
[package]
name = "kit"
edition = "2021"
```

```rust path=src/lib.rs
pub fn f() {}
```

```rust path=examples/demo/main.rs
mod ui;
mod state;
fn main() {}
```

```rust path=examples/demo/ui/mod.rs
use crate::state::S;
```

```rust path=examples/demo/state/mod.rs
pub struct S;
```

## Expect

- examples/demo/main.rs:1 -> node:ui
- examples/demo/main.rs:2 -> node:state
- examples/demo/ui/mod.rs:1 -> node:state
