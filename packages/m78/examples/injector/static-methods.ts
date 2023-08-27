import { _useState } from "./state.js";
import { Injector } from "./injector.js";

export function _staticMethods() {
  const stateDep = Injector.useDeps(_useState);

  Injector.useSettle(_useState, () => {
    console.log("11-1 state settle", stateDep);
  });

  console.log("2 static state", stateDep);
  console.log("3 static call");

  const sFn = () => {
    console.log("3-1 static call");

    return {
      name: "static",
      add(a: number, b: number) {
        return a + b;
      },
    };
  };

  return Injector.useStatic(sFn);
}

_staticMethods.static = true;
