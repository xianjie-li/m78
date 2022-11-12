import fs from "fs";
import path from "path";
import { presetPalettes } from "@ant-design/colors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tpl = "";
const newLine = "\r\n";

// 自定义grey色板
presetPalettes.grey = [
  "#ffffff",
  "#fafafa",
  "#f5f5f5",
  "#d9d9d9",
  "#bfbfbf",
  "#8c8c8c",
  "#434343",
  "#262626",
  "#1f1f1f",
  "#000000",
];

Object.entries(presetPalettes).forEach(([key, colors]) => {
  colors.forEach((color, index) => {
    tpl += `  --m78-${key}-${++index}: ${color};${newLine}`;
  });
  tpl += newLine;
});

tpl = `
:root {
${tpl}
}
`;

fs.writeFile(path.resolve(__dirname, "../src/colors.scss"), tpl, (err) => {
  if (err) throw err;
  console.log("generate => color.scss");
});
