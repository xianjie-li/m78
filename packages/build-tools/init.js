import path from "path";
import glob from "glob";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "url";
import commentJSON from "comment-json";
import { setNamePathValue } from "@m78/utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function init() {
  const usrPkgPath = path.resolve(process.cwd(), "./package.json");
  const curPkgPath = path.resolve(__dirname, "./package.json");

  let pkg = await readFile(usrPkgPath, "utf8");
  let curPkg = await readFile(curPkgPath, "utf8");

  pkg = JSON.parse(pkg);
  curPkg = JSON.parse(curPkg);

  // 添加命令
  const scripts = {
    "lint:prettier":
      "prettier ./src ./test --write --no-error-on-unmatched-pattern",
    "lint:script": "eslint ./src ./test --ext .js,.jsx,.ts,.tsx,.vue --fix",
    lint: "npm run lint:script && npm run lint:prettier",
    test: "jest",
    build: "m78-build-tools build",
    pub: "pnpm build && pnpm publish --access public --registry https://registry.npmjs.org --no-git-checks",
    examples: "pnpm exec parcel ./examples/index.html",
  };

  pkg.scripts = {
    ...pkg.scripts,
    ...scripts,
  };

  pkg.devDependencies = {
    ...pkg.devDependencies,
    "@m78/build-tools": `^${curPkg.version}`,
    typescript: curPkg.dependencies.typescript,
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

  await writeFile(usrPkgPath, JSON.stringify(pkg, null, 2));

  // 复制文件
  const copeFiles = [
    path.resolve(__dirname, "./.eslintignore"),
    path.resolve(__dirname, "./.prettierignore"),
    ...glob.sync(path.resolve(__dirname, "./_copy-files/**/*"), {
      absolute: true,
      dot: true,
    }),
  ];

  const copyTasks = copeFiles.map((filepath) =>
    copyFile(filepath, path.resolve(process.cwd(), path.basename(filepath)))
  );

  await Promise.all(copyTasks);

  // 改写用户tsconfig的path配置为当前包名
  if (pkg.name) {
    const userTsConfPath = path.resolve(process.cwd(), "./tsconfig.json");

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
}
