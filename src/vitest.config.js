import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    clearMocks: true,
    silent: true,

    include: [
      "src/**/*.test.js"
    ],

    environmentOptions: {
      jsdom: {
        url: "https://example.test/"
      }
    },

    coverage: {
      provider: "v8",

      include: [
        "src/main.js",
        "src/dateHelpers.js",
        "src/prefill.js",
        "src/validation.js"
      ],

      exclude: [
        "src/**/*.test.js",
        "src/vitest.config.js",
        "node_modules/**",
        "dist/**"
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
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
});