import config from "@m78/build-tools/jest.config.js";

export default {
  ...config,
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/jest/__mocks__/styleMock.ts",
    "@m78/sass-base": "<rootDir>/jest/__mocks__/fileMock.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
