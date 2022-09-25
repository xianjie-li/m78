import { defineConfig } from "@m78/build-tools/defineConfig.js";

const ignore = ["**/*(play|.umi)/", "**/*.demo.*(js|ts|jsx|tsx)"];

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
    ignore,
    copyfile: false,
  },
]);
