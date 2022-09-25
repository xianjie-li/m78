import { useState, useCallback, useRef } from "react";
import { SetState, StateInitState } from "../../";
import { AnyObject } from "@m78/utils";

/**
 * 实现类似react类组件的setState Api
 * @param initState - 初始状态
 * @return tuple
 * @return tuple[0] - 当前状态
 * @return tuple[1] - 类似类组件的setState，不支持回调
 * */
export const useSetState = <T extends AnyObject>(
  initState = {} as StateInitState<T>
): [T, SetState<T>] => {
  const [state, set] = useState<T>(initState);
  const ref = useRef(state);

  const setState = useCallback(
    (patch: any) => {
      const newState = {
        ...state,
        ...(patch instanceof Function ? patch(ref.current) : patch),
      };
      ref.current = Object.assign(ref.current, newState);
      set(newState);
    },
    [set]
  );

  return [ref.current, setState];
};
