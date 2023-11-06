/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ["src/controllers/**"],
      // opcional
      provider: "v8",
    },
  },
});
