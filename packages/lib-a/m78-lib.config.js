import sass from "sass";
import { mkdir, writeFile } from "node:fs/promises";
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
    beforeCopy: async (meta) => {
      if (meta.suffix === ".scss") {
        const result = sass.compile(meta.filePath);

        await mkdir(meta.outDir, { recursive: true });
        await writeFile(meta.outPath.replace(/\.scss$/, ".css"), result.css);

        return true; // 如果返回true, 表示自行进行该文件的处理和复制操作, 内部不会再进行任何操作
      }
    },
  },
  {
    inpDir: "src",
    outDir: "dist/umd",
    swcConfig: {
      module: {
        type: "umd",
      },
    },
  },
]);
