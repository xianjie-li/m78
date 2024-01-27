import { defineConfig } from "@m78/devtools/defineConfig.js";

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
