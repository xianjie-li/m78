import create from "@m78/seed";
import { create as createPermission } from "../../dist/index";

const seed = create({
  state: {
    name: "lxj",
    age: 17,
  },
});

const permission = createPermission({
  validFirst: true,
  seed,
  validators: {
    isLxj(state) {
      console.log(1);
      if (state.name !== "lxj") {
        return {
          label: "403",
          desc: "你不是lxj",
          actions: [
            {
              label: "切换账号",
            },
            {
              label: "放弃操作",
            },
          ],
        };
      }
    },
    is18plus(state, extra) {
      console.log(2, extra);
      if (state.age < 18) {
        return {
          label: "403",
          desc: "未满18岁",
          actions: [
            {
              label: "切换账号",
            },
            {
              label: "放弃操作",
            },
          ],
        };
      }
    },
  },
});

console.log(permission);

seed.coverSet({
  name: "jxl",
  age: 15,
});

console.log(seed.get());

console.log(
  permission(["isLxj", "is18plus", "isFalse"], {
    extra: 111,
    validators: {
      isFalse() {
        return {
          label: "错误!",
        };
      },
    },
  })
);
