import React from "react";
import { Seed } from "@m78/seed";
import { isFunction } from "@m78/utils";
import { State, UseState } from "./types.js";

export function _createState(seed: Seed, useState: UseState<any>) {
  const _State: State<any> = ({ children, selector, equalFn }) => {
    const state = useState(selector, equalFn);

    if (isFunction(children)) {
      return children(state) as React.ReactElement;
    }
    return null;
  };

  return _State;
}
