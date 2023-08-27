import { createInjector } from "../../src/index.js";
import { _useState } from "./state.js";
import React from "react";

const RerenderTest = React.memo(function (props: any) {
  console.log("rerender");
  return <div>{Math.random()}</div>;
});

export const Injector = createInjector<{ name: string }>(
  () => {
    console.log("1 render start");

    const state = Injector.useDeps(_useState);
    const props = Injector.useProps();

    console.log("12 props: ", props);
    console.log("13 render state", state);
    console.log("14 render call");

    return (
      <div>
        <h2>mana</h2>
        <button onClick={() => state.setCount((p) => p + 1)}>
          count {state.count}
        </button>
        RerenderTest: <RerenderTest state={state} props={props} />
        <C1 />
      </div>
    );
  },
  {
    defaultProps: {
      name: 345,
      age: 18,
    },
  }
);

function C1() {
  const state = Injector.useDeps(_useState);
  console.log("15 render C1", state);

  return (
    <div>
      {state.count}
      <button onClick={() => state.setCount((p) => p + 1)}>
        count {state.count}
      </button>
    </div>
  );
}
