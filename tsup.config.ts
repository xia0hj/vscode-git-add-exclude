import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],
  shims: false,
  dts: false,
  external: ["vscode"],
  sourcemap: true,
  treeshake: true,
  define:{
    'import.meta.vitest': 'undefined'
  }
});
