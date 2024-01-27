import path from "path";
import glob from "glob";
import { readFile, writeFile } from "node:fs/promises";
import fse from "fs-extra";
import { fileURLToPath } from "url";
import commentJSON from "comment-json";
import { setNamePathValue } from "@lxjx/utils";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function init(link) {
  if (link && link.startsWith("/")) {
    console.error(
      `To avoid dangerous operations, paths starting with the root directory are currently not supported: ${link}`
    );
    return;
  }

  const tPath = path.resolve(process.cwd(), link || "./");

  const curPkg = await fse.readJson(path.resolve(__dirname, "./package.json"));

  const usrPkgPath = path.resolve(tPath, "./package.json");

  let pkg;

  try {
    pkg = await readFile(usrPkgPath, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") {
      fse.ensureDirSync(path.dirname(usrPkgPath));

      spawnSync("npm", ["init", "-y"], {
        cwd: tPath,
      });

      return init(link);
    }

    return;
  }

  if (!pkg) {
    console.error(`${usrPkgPath} has invalid content.`);
    return;
  }

  pkg = JSON.parse(pkg);

  // 添加命令
  const scripts = {
    "lint:prettier":
      "prettier ./src ./test --write --no-error-on-unmatched-pattern",
    "lint:script": "eslint ./src ./test --ext .js,.jsx,.ts,.tsx,.vue --fix",
    lint: "npm run lint:script && npm run lint:prettier",
    test: "jest",
    build: "m78 build",
    pub: "pnpm build && pnpm publish --access public --registry https://registry.npmjs.org --no-git-checks",
    "example-hello": "m78 example hello",
  };

  pkg.scripts = {
    ...pkg.scripts,
    ...scripts,
  };

  pkg.files = ["**"];
  pkg.main = "./index.js";
  pkg.type = "module";
  pkg.typings = "./";

  // 发布配置
  pkg.publishConfig = {
    // 发布dist目录
    directory: "dist",
    // pnpm特有, 用于将monorepo包定向到dist目录
    linkDirectory: true,
  };

  pkg.dependencies = curPkg.peerDependencies;

  pkg.devDependencies = {
    [curPkg.name]: `^${curPkg.version}`,
  };

  await writeFile(usrPkgPath, JSON.stringify(pkg, null, 2));

  // 复制文件
  const copeFiles = [
    path.resolve(__dirname, "./.eslintignore"),
    path.resolve(__dirname, "./.prettierignore"),
    ...glob.sync(path.resolve(__dirname, "./_copy-files/*"), {
      absolute: true,
      dot: true,
    }),
  ];

  const copyTasks = copeFiles.map((filepath) => {
    return fse.copy(filepath, path.resolve(tPath, path.basename(filepath)));
  });

  await Promise.all(copyTasks);

  // 改写用户tsconfig的path配置为当前包名
  if (pkg.name) {
    const userTsConfPath = path.resolve(tPath, "./tsconfig.json");

    let userTsConf = await readFile(userTsConfPath, "utf8");

    if (userTsConf) {
      userTsConf = commentJSON.parse(userTsConf);

      setNamePathValue(
        userTsConf,
        ["compilerOptions", "paths", pkg.name],
        ["src/index.ts"]
      );

      const modify = commentJSON.assign(
        {
          compilerOptions: {
            paths: {
              [pkg.name]: ["src/index.ts"],
            },
          },
        },
        userTsConf
      );

      await writeFile(userTsConfPath, commentJSON.stringify(modify, null, 2));
    }
  }

  console.log("init finish.");
}
