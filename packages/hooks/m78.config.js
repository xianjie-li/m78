import { defineConfig } from "@m78/devtools/defineConfig.js";

// 添加tsconfig.lib.json支持, 用于库配置

export default defineConfig([
  {
    inpDir: "src",
    outDir: "dist",
    swcConfig: {
      module: {
        type: "es6",
      },
    },
    copyfile: false,
  },
]);
