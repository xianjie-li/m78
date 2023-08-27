import { useEffect } from "react";
import { _useState } from "./state.js";
import { _staticMethods } from "./static-methods.js";
import { Injector } from "./injector.js";

export function _useLifeCycle() {
  const sMethods = Injector.useDeps(_staticMethods);
  const stateDep = Injector.useDeps(_useState);

  console.log("4 life methods", sMethods);
  console.log("5 life state", stateDep);
  console.log("6 life call");

  useEffect(() => {
    // console.log("count change: ", stateDep.count, sMethods.add(1, 1));
  }, [stateDep.count]);

  // console.log(stateDep);

  useEffect(() => {
    // console.log("max change: ", stateDep.max, sMethods.add(1, 1));
  }, [stateDep.max]);

  return {
    abd: 1,
  };
}
