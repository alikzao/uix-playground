import { rm } from "node:fs/promises";
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
