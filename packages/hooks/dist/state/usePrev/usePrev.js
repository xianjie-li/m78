import { useEffect, useRef } from "react";
export function usePrev(value) {
    var ref = useRef();
    useEffect(function() {
        return void (ref.current = value);
    }, [
        value
    ]);
    return ref.current;
}
