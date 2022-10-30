import { useEffect, useRef } from "react";
export function useFirstMountState() {
    var r = useRef(0);
    useEffect(function() {
        r.current += 1;
    }, []);
    return r.current === 0;
}
