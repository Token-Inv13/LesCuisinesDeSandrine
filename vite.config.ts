import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [compression()],
  build: {
    target: "es2018",
    cssMinify: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
});
