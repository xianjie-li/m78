import { useState, useCallback, useRef } from "react";
import { SetState, StateInitState } from "../../index.js";
import { AnyObject } from "@m78/utils";

/**
 * 实现类似react类组件的setState Api
 * @param initState - 初始状态
 * @return tuple
 * @return tuple[0] - 当前状态
 * @return tuple[1] - 类似类组件的setState，不支持回调
 *
 * - 如果新状态对象第一层的所有值与之前相等, 则不会重新触发render
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

      const newKeys = Object.keys(newState);

      // 第一层的所有key均相等
      let isEq = true;

      for (const key of newKeys) {
        if (newState[key] !== ref.current[key]) {
          isEq = false;
          break;
        }
      }

      ref.current = Object.assign(ref.current, newState);

      !isEq && set(newState);
    },
    [set]
  );

  return [ref.current, setState];
};
