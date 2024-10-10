export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    ".+\\.(css|scss|png|jpg|ttf|woff|woff2|svg|jpeg|avif)$":
      "jest-transform-stub",
  },
  moduleFileExtensions: [
    "scss",
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
    "scss",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules"],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
    "<rootDir>/src/__ tests __/__ mocks __/actionMock.ts",
  ],
  testTimeout: 300000,
  coveragePathIgnorePatterns: ["/src/redux/","src/models/","src/utilities"],
};
