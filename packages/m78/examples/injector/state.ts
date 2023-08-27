import { useEffect, useState } from "react";
import { _staticMethods } from "./static-methods.js";
import { _useLifeCycle } from "./life-cycle.js";
import { Injector } from "./injector.js";

/**
 * 注册顺序
 *
 * 按照use: list执行, 执行器内, 若执行的actuator内调用了其他inject, 则会对依赖的actuator先进行注册, 依次类推
 * 若自动注册的actuator反向依赖了当前actuator, 则其inject返回空的对象引用, 不对方向依赖进行自动注册
 * */

export function _useState() {
  const sMethods = Injector.useDeps(_staticMethods);
  const lifeCycle = Injector.useDeps(_useLifeCycle);
  const nState = Injector.useDeps(nestState);

  Injector.useSettle(nestState, (deps) => {
    console.log("7-1 settle", deps);
  });

  console.log("8 state methods", sMethods);
  console.log("9 state life", lifeCycle);
  console.log("10 state nest state", nState);

  console.log("11 state call");

  const [count, setCount] = useState(0);

  useEffect(() => {
    // console.log("递归依赖: ", lifeCycle.abd);
  }, []);

  return {
    count,
    setCount,
    ...nState,
  };
}

// 嵌套
export function nestState() {
  const [max, setMax] = useState(10);

  console.log("7 state2 call");

  return {
    /** AA */
    max,
    setMax,
  };
}
