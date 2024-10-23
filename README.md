# tree-sitter-idris

[Idris 2](https://github.com/idris-lang/Idris2) grammar for 
[tree-sitter](https://github.com/tree-sitter/tree-sitter).

Tested with the [official libs](https://github.com/idris-lang/Idris2/tree/main/libs).

This has not been tested with Idris 1.

## How to Use with [Helix Editor](https://helix-editor.com/)

### Language configuration

Add the following in `~/.config/helix/languages.toml`:

```toml
[[grammar]]
name = "idris"
source = { git = "https://github.com/kayhide/tree-sitter-idris", rev = "c3ab3a95415d9807038f6ed026617cb44328f1c3" }
```

The `rev` value may be updated.
To obtain the current `rev` from a repository, use the following command:

```console
> git rev-parse HEAD
```


### Queries

Copy the queries:

```console
> mkdir -p "$HELIX_CONFIG_QUERIES/idris"
> cp queries/* "$HELIX_CONFIG_QUERIES/idris"
```

`HELIX_CONFIG_QUERIES` is typically located at "~/.config/helix/runtime/queries".


### Build

Then, let the Helix Editor build it:

```console
> hx --grammar fetch
> hx --grammar build
```
