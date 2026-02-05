import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  clearMocks: true,

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.tests.json",
        isolatedModules: true,
        diagnostics: false,
      },
    ],
  },

  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
}

export default config
