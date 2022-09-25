import { useRef } from "react";
export function useRefize(refState) {
    var ref = useRef({});
    ref.current = Object.assign(ref.current, refState);
    return ref.current;
}
