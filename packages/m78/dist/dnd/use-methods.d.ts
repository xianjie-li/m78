import { _Context } from "./types.js";
import { FullGestureState } from "@use-gesture/react";
export declare function _useMethods(ctx: _Context): {
    onDrag: (ev: FullGestureState<"drag">) => true | undefined;
    updateDNDMeta: () => void;
    throttleUpdateDNDMeta: () => void;
};
export declare type _UseMethodReturns = ReturnType<typeof _useMethods>;
//# sourceMappingURL=use-methods.d.ts.map