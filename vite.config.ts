import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/AUTICARE.in/",  // REQUIRED for GitHub Pages
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@/": "/src/",
    },
  },
});
