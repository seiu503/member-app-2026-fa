import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    clearMocks: true,

    environmentOptions: {
      jsdom: {
        url: "https://example.test/"
      }
    },

    coverage: {
      provider: "v8",

      include: [
        "main.js"
      ],

      exclude: [
        "main.test.js",
        "vitest.config.js",
        "vitest.config.mjs",
        "node_modules/**"
      ],

      reporter: [
        "text",
        "text-summary",
        "html",
        "json",
        "lcov"
      ],

      reportsDirectory: "./coverage",

      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
});