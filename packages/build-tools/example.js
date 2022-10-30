import { spawnSync } from "node:child_process";
import { stat } from "node:fs/promises";

import path from "path";

export async function example(exampleName) {
  if (!exampleName) {
    throw Error(`example name not specified`);
  }

  const ePath = path.resolve(
    process.cwd(),
    "./examples",
    exampleName,
    "./index.html"
  );

  const stats = await stat(ePath);

  if (!stats.isFile()) {
    throw Error(`entry html ${ePath} not exist`);
  }

  spawnSync("npx", ["parcel", ePath, "--dist-dir", ".examples-dist"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
}
