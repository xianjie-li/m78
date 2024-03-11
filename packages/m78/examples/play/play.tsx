import { isFunction } from "@m78/utils";
import React from "react";

type Constructor = new (...args: any[]) => any;

/**
 * 对给定的多个类执行混合, 首个类会被视为主类, 执行混合后类的类型默认与其相同
 *
 * - 同名属性/方法/会进行覆盖, 参数位于左侧的类优先级大于右侧
 * - 构造函数内不可访其他类的成员, 因为初始化尚未完成
 * - 不会处理静态方法/属性, 应统一维护到主类
 * */
export function applyMixins<C extends Constructor>(
  MainConstructor: C,
  ...constructors: Constructor[]
): C {
  const list = [MainConstructor, ...constructors];

  if (list.length < 2) return MainConstructor;

  // 方法名: descriptor
  const methodMap: any = Object.create(null);

  list.forEach((Constr) => {
    Object.getOwnPropertyNames(Constr.prototype).forEach((name) => {
      if (methodMap[name]) {
        throw Error(
          `Mixin: Contains duplicate method declarations -> ${
            Constr.name ? `class ${Constr.name}.` : ""
          }${name}()`
        );
      }

      const cur = Object.getOwnPropertyDescriptor(Constr.prototype, name);

      if (!cur) return;

      if (
        name !== "constructor" &&
        (isFunction(cur.value) || isFunction(cur.get) || isFunction(cur.set))
      ) {
        methodMap[name] = cur;
      }
    });
  });

  // 记录写入过的属性
  const propertyExist: any = {};
  // 待合并的属性
  const propertyMap: any = {};

  class Mixin extends MainConstructor {
    constructor(...args: any[]) {
      super(...args);

      constructors.forEach((Con) => {
        const ins = new Con(...args);

        Object.keys(ins).forEach((k) => {
          if (propertyExist[k]) return;

          if (k in this) {
            propertyExist[k] = true;
            return;
          }

          propertyMap[k] = ins[k];
          propertyExist[k] = true;
        });
      });

      Object.assign(this, propertyMap);
    }
  }

  Object.defineProperties(Mixin.prototype, methodMap);

  return Mixin as C;
}

interface A extends B {}

class D {
  static sd = 1;

  c = [2, 3, 5];

  d() {
    console.log("ddd");
  }
}

class A extends D {
  // constructor() {}

  static sa = 1;
  static saStaticFn = () => {};

  aProps = [1, 2, 3];

  aMethod() {
    console.log(this.aProps);
  }

  toString() {
    console.log("a");
  }

  get aa() {
    return "aa";
  }

  set aa(a) {
    console.log(122);
  }

  d() {
    console.log("dd");
  }
}

class B {
  // constructor(a: number) {}

  static sb = 1;
  static saStaticFn = () => {};

  bProps = [2, 3];

  private abc = 222;

  bMethod() {
    console.log(this.bProps);
    return 1;
  }
}

const Play = () => {
  return (
    <div>
      <button
        onClick={() => {
          // @ts-ignore
          const Cls = applyMixins(A, B);
          // @ts-ignore
          const i = new Cls();
          console.log(i, i.bMethod());

          i.d();
          i.toString();
        }}
      >
        send
      </button>
    </div>
  );
};

export default Play;
