import { config } from "./config.js";

export default {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", config],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "jsdom",
};
