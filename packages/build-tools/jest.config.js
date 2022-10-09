import { config } from "./config.js";

export default {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", config],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "jsdom",
  // 严格的esm需要保留.js后缀, 这在jest中目前会导致模块未找到的报错, 通过此配置测试阶段去调.js后缀
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
