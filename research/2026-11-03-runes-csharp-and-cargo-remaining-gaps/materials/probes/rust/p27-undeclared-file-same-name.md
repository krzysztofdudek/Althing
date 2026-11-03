---
id: p27-undeclared-file-same-name
language: rust
category: import
expectation: silence
cites: "Rust Reference, Modules (a file is a module only when a `mod` declares it); Paths"
---

## Rule

The bin root `src/bin/server.rs` defines `fn serve()` and calls `crate::serve()`. `src/bin/serve.rs` is a different binary (its own crate), never a module of `server`. The call names an item of `server.rs` (same owner), no cross edge.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/bin/server.rs owner=server
fn serve() {}
fn main() { crate::serve(); }
```

```rust path=src/bin/serve.rs owner=servebin
fn main() {}
```

## Expect

- silence
