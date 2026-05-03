# UIX Playground

Standalone playground for UIX examples.

Includes:
- Monaco editor with custom attribute highlighting
- Split layout (code/result/console)
- Sandboxed runner iframe
- Built-in examples
- Local vendored UIX runtime for portability

## Run locally

```bash
npm run build
npm run serve
```

Open:
- http://127.0.0.1:4173/index.html

## Monorepo compatibility

This folder is self-contained so it can be split and pushed as a separate repository.
It still works from the monorepo path:
- `/modules/core/static/playground/`

## Build output

Build script creates shell assets:
- `dist/app.js`
- `dist/app.css`

Examples are intentionally not bundled into shell build:
- `examples/*.example.js`
- `examples/index.js`

Shell loads examples at runtime.

## External modules in sandbox

You can inject additional modules into runtime `api` from the top input:

```text
Name=https://cdn.example.com/mod.js, LocalUtil=./examples/local-util.js
```

Rules:
- format is `Name=url` (comma-separated)
- `Name` must be a valid JavaScript identifier
- URL can be same-origin relative path or `https://...`

Usage in code:

```js
const { Component, Name, LocalUtil } = api;
```
