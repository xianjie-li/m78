import { spawnSync } from "node:child_process";
import { stat } from "node:fs/promises";

import path from "path";
import url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export async function example(exampleName) {
  if (!exampleName) {
    throw Error(`example name not specified`);
  }

  const ePath = path.resolve(process.cwd(), "./examples", exampleName);
  const viteConfig = path.resolve(__dirname, "./vite.config.ts");

  const stats = await stat(ePath);

  if (!stats.isDirectory()) {
    throw Error(`entry ${ePath} not exist`);
  }

  try {
    spawnSync("npx", ["vite", ePath, "--config", viteConfig, "--host"], {
      cwd: process.cwd(),
      stdio: "inherit",
    });
  } catch (e) {
    console.log(e);
  }
  //
  // try {
  //   spawnSync("npx", ["parcel", ePath, "--dist-dir", ".examples-dist"], {
  //     cwd: process.cwd(),
  //     stdio: "inherit",
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
}
