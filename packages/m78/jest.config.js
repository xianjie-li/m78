import config from "@m78/devtools/jest.config.js";

export default {
  ...config,
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/jest/__mocks__/styleMock.ts",
    "@m78/sass-base": "<rootDir>/jest/__mocks__/fileMock.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  rootDir: "./",
};
