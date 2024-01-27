#!/usr/bin/env node

import { build } from "./build.js";
import { init } from "./init.js";
import { example } from "./example.js";

async function main() {
  const cmd = process.argv[2];

  // 构建
  if (cmd === "build") {
    await build();
    return;
  }

  // 执行初始化, 生产lint配置, npm script等
  // ⚠️ 此命令会覆盖你目录中的相关配置文件, 请谨慎使用
  if (cmd === "init") {
    await init(process.argv[3]);
    return;
  }

  // 开发服务
  if (cmd === "example") {
    await example(process.argv[3]);
    return;
  }

  console.error("argument error");
}

main();
