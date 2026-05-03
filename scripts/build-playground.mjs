import { cp, mkdir, rm } from "node:fs/promises";
import { build } from "esbuild";

await rm(new URL("../dist", import.meta.url), { recursive: true, force: true });

await build({
  entryPoints: ["./src/app.js"],
  bundle: true,
  format: "esm",
  outfile: "./dist/app.js",
  loader: { ".css": "css" },
  minify: true,
  logLevel: "info"
});

await mkdir(new URL("../dist/vendor/monaco", import.meta.url), { recursive: true });
await cp(
  new URL("../node_modules/monaco-editor/min/vs", import.meta.url),
  new URL("../dist/vendor/monaco/vs", import.meta.url),
  { recursive: true }
);
