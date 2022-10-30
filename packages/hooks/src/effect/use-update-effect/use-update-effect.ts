import { useEffect } from "react";
import { useFirstMountState } from "../../";

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) return effect();
  }, deps);
};
