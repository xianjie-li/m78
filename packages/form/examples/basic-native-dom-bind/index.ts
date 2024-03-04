import { createForm } from "../../dist";
import { required, number } from "../../dist/validator/index.js";

// 创建表单实例, 创建配置可见下方 FormConfig
const form = createForm({
  // 校验表单值结构, 这里描述了一个格式为 { name: "m78", age: 5 } 的对象
  // 针对对象本身的schema
  schemas: {
    // 对象的子字段的schema
    schemas: [
      {
        name: "name",
        validator: required(),
      },
      {
        name: "age",
        validator: [required(), number({ min: 10, max: 100 })],
      },
    ],
  },
  // 可选, 配置默认值
  values: {
    name: "m78",
  },
});

// ## 创建节点
const inputEl = document.createElement("input");
inputEl.placeholder = "input name";
inputEl.value = form.getValue("name"); // 设置初始值

const ageEl = document.createElement("input");
ageEl.placeholder = "input age";
const age = form.getValue("age");

ageEl.type = "number";
ageEl.value = typeof age === "number" ? age.toString() : ""; // 设置初始值

const submitBtn = document.createElement("button");
submitBtn.innerText = "submit";
submitBtn.onclick = form.submit;

// ## 表单输入时更新到form
inputEl.addEventListener("input", (e) =>
  form.setValue("name", (e.target as HTMLInputElement).value)
);

ageEl.addEventListener("input", (e) =>
  form.setValue("age", Number((e.target as HTMLInputElement).value))
);

// ## form值变更时更新到dom
form.events.change.on((name) => {
  if (name === "name") {
    inputEl.value = form.getValue("name");
  }

  if (name === "age") {
    ageEl.value = form.getValue("age").toString();
  }
});

// ## 监听提交/验证失败事件
form.events.submit.on(() => {
  console.log("submit", form.getValues());
});

form.events.fail.on((errors) => {
  console.log("fail", errors);
});

document.body.appendChild(inputEl);
document.body.appendChild(ageEl);
document.body.appendChild(submitBtn);
