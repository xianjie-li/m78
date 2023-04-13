import React from "react";
import { Seed } from "@m78/seed";
import { isFunction } from "@m78/utils";
import { RCSeedState, RcSeedUseState } from "./types.js";

export function _createState(seed: Seed, useState: RcSeedUseState<any>) {
  const _State: RCSeedState<any> = ({ children, selector, equalFn }) => {
    const state = useState(selector, equalFn);

    if (isFunction(children)) {
      return children(state) as React.ReactElement;
    }
    return null;
  };

  return _State;
}
