import { _RCTableContext, RCTableProps } from "./types.js";
import { _UseCustomRender } from "./use-custom-render.js";
export declare function _useMethods(ctx: _RCTableContext, customRender: _UseCustomRender): {
    initEmptyNode: () => void;
    updateInstance: (propsConf: Partial<RCTableProps>, isFull: boolean) => void;
};
export declare type _Methods = ReturnType<typeof _useMethods>;
//# sourceMappingURL=methods.d.ts.map