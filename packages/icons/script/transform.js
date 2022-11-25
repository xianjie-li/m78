import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { transform } from "@svgr/core";
import { tpl } from "./tpl.js";
import glob from "glob";
import { fileURLToPath } from "url";
import _ from "lodash";
import { execSync } from "node:child_process";
import * as path from "path";
import { upName } from "./utils.js";

/**
 * 将@material-design-icons/svg中的所有图标转换为tsx并输出到src目录, 目前图标1w+, 转换速度可接受, 有空可以改成多线程吧
 * */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, "../src");

const icons = glob.sync(
  path.resolve(
    __dirname,
    "../node_modules/@material-design-icons/svg/+(round|two-tone)/*.svg"
  )
);

const iconMetaList = [];

/** 收集所有图表名称, 仅适用round单色和双色两种图标 */
const nameMap = {
  icon: [],
  "icon-tow": [],
};

icons.forEach((i) => {
  const full = i.split("@material-design-icons/svg/")[1] || "";
  const sp = full.split("/");
  let type = sp[0] || "";
  const name = sp[1].replace(".svg", "") || "";

  if (type === "round") type = "icon";
  if (type === "two-tone") type = "icon-tow";

  const kebabName = `${type}-${name.replaceAll("_", "-")}`;
  const outPath = path.resolve(outputDir, "./", `${kebabName}.tsx`);

  iconMetaList.push({
    type,
    // 导出文件名/css类名片段
    name: kebabName,
    // 大写的文件名, 用于组件
    upName: upName(kebabName),
    // 不带type的名称
    oName: name,
    path: i,
    outPath: outPath,
    outDir: path.dirname(outPath),
  });
});

if (!iconMetaList.length) {
  throw Error("svg icon files not found!");
}

try {
  await rm(outputDir, {
    recursive: true,
  });
} catch (e) {
  console.log(e);
}

await mkdir(outputDir, {
  recursive: true,
});

let ind = 0;
let outputIndex = "";

for (const iconMeta of iconMetaList) {
  const filePath = new URL(iconMeta.path, import.meta.url);
  const svgContent = await readFile(filePath, { encoding: "utf8" });

  nameMap[iconMeta.type].push(iconMeta.name);

  outputIndex += `export { ${iconMeta.upName} } from "./${iconMeta.name}";\r\n`;

  const code = await transform(
    svgContent,
    {
      ref: true,
      memo: true,
      svgProps: {
        className: `{clsx('m78 m78-icon m78-icon_${iconMeta.name}', props.className)}`,
        focusable: false,
        "data-name": iconMeta.name,
      },
      expandProps: "start",
      typescript: true,
      template: tpl,
    },
    { componentName: iconMeta.upName }
  );

  await writeFile(iconMeta.outPath, code);

  ind++;

  if (ind % 100 === 0) {
    console.log(`${ind + 1}/${iconMetaList.length}`);
  }
}

console.log(`transform svg to component finish (${iconMetaList.length} icons)`);

await writeFile(path.resolve(outputDir, "./map.json"), JSON.stringify(nameMap));

await writeFile(
  path.resolve(outputDir, "./do-not-use-this-export-only-use-by-example.js"),
  outputIndex
);

execSync(`npx mbt build`);

const tempEntry = path.resolve(
  __dirname,
  "../dist/do-not-use-this-export-only-use-by-example.js"
);
const outBundle = path.resolve(__dirname, "../dist/bundle.js");

execSync(`npx rollup ${tempEntry} --format esm --file ${outBundle}`);

await rm(tempEntry, {
  recursive: true,
});

// await writeFile(
//   path.resolve(__dirname, "../dist/lib.d.ts"),
//   `declare module "@m78/icons/*";
// declare module "@m78/icons";
// `
// );

console.log("finish");
