import swc from "@swc/core";
import path from "path";
import glob from "glob";
import { writeFile, mkdir, copyFile, rm } from "node:fs/promises";
import _ from "lodash";
import { config } from "./config.js";
import { ensureArray, isArray, isObject } from "@lxjx/utils";
import { spawnSync } from "node:child_process";
import fse from "fs-extra";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/** 默认过滤文件 */
const BASE_IGNORE = ["**/*.d.ts", "**/*.test.*(js|ts|jsx|tsx)"];
/** 支持编译的文件后缀 */
const COMPILE_SUFFIX = ["js", "ts", "jsx", "tsx"];

/** ts配置路径 */
const tsConfPath = path.resolve(process.cwd(), "./tsconfig.json");
/** ts-lib配置路径(如果有) */
const tsLibConfPath = path.resolve(process.cwd(), "./tsconfig.lib.json");
/** 用户package.json路径 */
const pkgPath = path.resolve(process.cwd(), "./package.json");

export async function build() {
  const res = await import(`${process.cwd()}/m78-lib.config.js`);

  let buildConf = res.default;

  if (!isArray(buildConf) && !isObject(buildConf)) {
    throw Error("build config is not found");
  }

  const configList = ensureArray(buildConf);

  await Promise.all(configList.map(run));

  await generateDeclaration(configList);
}

async function run({
  inpDir,
  outDir,
  swcConfig,
  extensions = COMPILE_SUFFIX,
  ignore: _ignore = [],
  copyfile = true,
  beforeCopy,
}) {
  const inpDirBase = path.resolve(process.cwd(), inpDir);
  const outDirBase = path.resolve(process.cwd(), outDir);
  const conf = _.defaultsDeep({}, swcConfig, config);
  const ignore = [...BASE_IGNORE, ..._ignore];

  const files = glob.sync(path.resolve(process.cwd(), `${inpDir}/**/*.*`), {
    ignore, // 忽略play和demo目录
    absolute: true,
    dot: true,
  });

  if (!files.length) {
    throw Error("no match files");
  }

  const copyList = [];
  const compileList = [];

  const suffixPattern = new RegExp(`.(${extensions.join("|")})$`);

  files.forEach((i) => {
    if (suffixPattern.test(i)) {
      compileList.push(i);
    } else {
      copyList.push(i);
    }
  });

  await rm(outDirBase, {
    recursive: true,
  }).catch(() => {});

  // 编译
  await compile({
    compileList,
    inpDirBase,
    outDirBase,
    conf,
  });

  // 复制文件
  if (copyfile) {
    await copyFileHandle({ copyList, inpDirBase, outDirBase, beforeCopy });
  }
}

/** 编译 */
async function compile({ compileList, inpDirBase, outDirBase, conf }) {
  const list = [];

  for (const filePath of compileList) {
    const outPath = filePath
      .replace(inpDirBase, outDirBase)
      .replace(/\.(js|jsx|ts|tsx)$/, ".js");

    await swc
      .transformFile(filePath, conf)
      .then((output) => {
        list.push([output, outPath]);
      })
      .catch((err) => {
        throw Error(err);
      });
  }

  const tasks = list.map(([output, outPath]) => {
    return (async () => {
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, output.code);

      if (output.map) {
        await writeFile(`${outPath}.map`, output.map);
      }
    })();
  });

  await Promise.all(tasks);

  console.log(`✨ compile completed.`);
}

/** 文件拷贝 */
async function copyFileHandle({
  copyList,
  inpDirBase,
  outDirBase,
  beforeCopy,
}) {
  for (const copyPath of copyList) {
    const outPath = copyPath.replace(inpDirBase, outDirBase);

    const meta = {
      outPath,
      outDir: path.dirname(outPath),
      filePath: copyPath,
      suffix: path.extname(outPath),
    };

    const isHandled = beforeCopy ? await beforeCopy(meta) : false;

    if (!isHandled) {
      await mkdir(path.dirname(outPath), { recursive: true });
      await copyFile(meta.filePath, outPath);
    }

    console.log(`✨ copy completed.`);
  }
}

/** 生成ts声明文件 */
async function generateDeclaration(configList) {
  let userTsConf = "";

  // 优先读取tsconfig.lib.json, 以允许用户添加构建特殊配置
  if (await fse.pathExists(tsLibConfPath)) {
    userTsConf = tsLibConfPath;
  } else if (await fse.pathExists(tsConfPath)) {
    userTsConf = tsConfPath;
  }

  if (!userTsConf) return;

  /** 存放临时声明文件的路径 */
  const tempPath = path.resolve(process.cwd(), "./node_modules/.m78temp/dts");

  /** 存放声明文件生成配置的模板路径 */
  const libTsTplConfPath = path.resolve(
    __dirname,
    "./_assets/ts-lib.config.json"
  );
  /** 拷贝到用户目录 */
  const libTsConfPath = path.resolve(
    process.cwd(),
    "./node_modules/.m78temp/ts-lib.config.json"
  );

  await fse.remove(tempPath);

  await fse.copy(libTsTplConfPath, libTsConfPath);

  const conf = await fse.readJson(libTsConfPath);

  conf.extends = userTsConf;

  await fse.writeJson(libTsConfPath, conf, {
    spaces: 2,
  });

  try {
    console.log("⏱ generate declaration...");
    spawnSync("npx", ["tsc", "-p", libTsConfPath, "--outDir", tempPath], {
      cwd: process.cwd(),
      stdio: "inherit",
    });
  } catch (e) {
    if (e.stdout) {
      console.error(e.stdout);
    } else if (e.stderr) {
      console.error(e.stderr);
    } else {
      console.error(e);
    }
    return;
  }

  let isFirstConf = true;

  for (const config of configList) {
    const outDirBase = path.resolve(process.cwd(), config.outDir);

    if (isFirstConf) {
      await fse.copy(pkgPath, `${outDirBase}/package.json`);
      isFirstConf = false;
    }
    await fse.copy(tempPath, outDirBase);
  }

  console.log(`✨ generate declaration completed.`);
}
