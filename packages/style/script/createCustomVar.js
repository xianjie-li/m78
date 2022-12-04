import { generate } from "@ant-design/colors";
import inquirer from "inquirer";

inquirer
  .prompt({
    type: "input",
    name: "color",
    message: "请输入主题色:",
  })
  .then(({ color }) => {
    // Use user feedback for... whatever!!
    if (!color) {
      console.warn("请输入颜色值!");
      return;
    }

    const colors = generate(color);

    if (!colors.length) {
      console.log("请检查颜色输入是否正确");
      return;
    }

    colors.forEach((color, index) => {
      console.log(`--m78-color-${index + 1}: ${color};`);
    });

    console.log(`--m78-color: ${colors[6]};`);
    console.log(`--m78-color-opacity-sm: #{rgba(${colors[6]}, 0.2)};`);
    console.log(`--m78-color-opacity-md: #{rgba(${colors[6]}, 0.4)};`);
    console.log(`--m78-color-opacity-lg: #{rgba(${colors[6]}, 0.7)};`);
  });
