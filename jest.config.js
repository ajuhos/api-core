const {defaults} = require('jest-config');

module.exports = {
  bail: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/**/*.(ts|js)",
    "!src/config/*"
  ],
  coverageReporters: [
    "text",
    "cobertura",
    "lcov"
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100
  //   }
  // },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  reporters: [ "default", "jest-junit" ],
  roots: ['src', 'test'],
  testMatch: ['<rootDir>/**/?(*.)test.{ts,tsx}'],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  verbose: true,
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  }
};
