import { AnyObject } from "@m78/utils";
import { useRef } from "react";

export function useRefState<T extends AnyObject>(refState: T): T {
  const ref = useRef({});

  ref.current = Object.assign(ref.current, refState);

  return ref.current as T;
}
