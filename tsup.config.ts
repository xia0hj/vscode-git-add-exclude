import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],
  shims: false,
  dts: false,
  external: ["vscode"],
  sourcemap: true,
  // treeshake: true, // @todo can not debug with breakpoint when rollup treeshake enable
  define:{ 'import.meta.vitest': 'undefined' }
});
