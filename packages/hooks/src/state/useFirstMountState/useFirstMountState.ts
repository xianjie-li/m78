import { useEffect, useRef } from "react";

export function useFirstMountState() {
  const r = useRef(0);

  useEffect(() => {
    r.current += 1;
  }, []);

  return r.current === 0;
}
