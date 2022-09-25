import { useEffect } from "react";
import { useFirstMountState } from "../../";
export var useUpdateEffect = function(effect, deps) {
    var isFirstMount = useFirstMountState();
    useEffect(function() {
        if (!isFirstMount) return effect();
    }, deps);
};
