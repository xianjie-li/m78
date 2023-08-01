import { useRef } from "react";
/** record prev value */ export function usePrev(value) {
    var ref = useRef();
    var cur = ref.current;
    ref.current = value;
    return cur;
}
