import { useRef } from "react";
export function useRefState(refState) {
    var ref = useRef({});
    ref.current = Object.assign(ref.current, refState);
    return ref.current;
}
