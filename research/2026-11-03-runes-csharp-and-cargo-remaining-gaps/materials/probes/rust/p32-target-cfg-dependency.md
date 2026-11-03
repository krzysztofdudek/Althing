---
id: p32-target-cfg-dependency
language: rust
category: import
expectation: edge
cites: "The Cargo Book, Specifying dependencies, Platform specific dependencies (`[target.'cfg(...)'.dependencies]`)"
---

## Rule

`[target.'cfg(target_os = "linux")'.dependencies] sys-linux = { path = "../sys-linux" }`: `use sys_linux::Epoll;` binds the dependency's library (owner sysdep).

## Files

```toml path=app/Cargo.toml
[package]
name = "app"
edition = "2021"

[target.'cfg(target_os = "linux")'.dependencies]
sys-linux = { path = "../sys-linux" }
```

```toml path=sys-linux/Cargo.toml
[package]
name = "sys-linux"
edition = "2021"
```

```rust path=sys-linux/src/lib.rs owner=sysdep
pub struct Epoll;
```

```rust path=app/src/lib.rs owner=root
use sys_linux::Epoll;
```

## Expect

- app/src/lib.rs:1 -> node:sysdep
