import create from "@m78/seed";
import { createPro } from "../../dist";

// console.log(authProTplParser('wqrwq:fwq'))
// console.log(authProTplParser('user:create&delete'));
// console.log(authProTplParser('user:create|delete'));
// console.log(authProTplParser('user:create&delete|query'));
// console.log(authProTplParser('user:create&(1delete|query)'))

const ap = createPro({
  seed: create(),
  permission: {
    user: ["query1", "update", "create"],
    "mod2.news": ["publish", "delete"],
  },
  meta: {
    general: [
      {
        label: "创建",
        key: "create",
        short: "C",
      },
    ],
    modules: {
      user: [
        {
          label: "查询",
          key: "query11",
          short: "Q",
        },
        {
          label: "更新",
          key: "update",
          short: "U",
        },
      ],
    },
  },
});

console.log(ap.check(["user:create&update"]));
console.log(ap.check(["user:create&(query11|query2)"]));
