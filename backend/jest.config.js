/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/dist-tests/tests/**/*.test.js"],
  clearMocks: true,
}
