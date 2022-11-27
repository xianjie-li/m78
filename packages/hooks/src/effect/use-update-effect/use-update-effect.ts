import { useEffect } from "react";
import { useFirstMountState } from "../../index.js";

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) return effect();
  }, deps);
};
