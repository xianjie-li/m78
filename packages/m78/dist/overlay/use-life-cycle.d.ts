import { _Methods } from "./use-methods.js";
import { _Context } from "./types.js";
export declare function _useLifeCycle(ctx: _Context, methods: _Methods): {
    onContentMount: () => void;
    onContentUnmount: () => void;
};
export declare type _LifeCycle = ReturnType<typeof _useLifeCycle>;
//# sourceMappingURL=use-life-cycle.d.ts.map