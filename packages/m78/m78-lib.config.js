import { defineConfig } from "@m78/build-tools/defineConfig.js";

export default defineConfig([
  {
    inpDir: "src",
    outDir: "dist",
    swcConfig: {
      module: {
        type: "es6",
      },
    },
    ignore: ["**/*.md"],
  },
]);
