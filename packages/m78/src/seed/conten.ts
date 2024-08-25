import { seede } from "./createe.js";

export const state = {
  obj: {
    /** 测试 */
    props1: 123,
    props2: "string props",
  },
  name: "seed",
};

export function fn1(num: number): string {
  return num.toString();
}

export function fn2() {
  return seede.state.obj;
}

export function fn3() {
  return {
    abc: 123,
    cde: 456,
  };
}

export function fn4() {
  return seede.actions.inner.fn3();
}
