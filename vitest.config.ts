/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      // opcional
      provider: "v8",
    },
  },
});
