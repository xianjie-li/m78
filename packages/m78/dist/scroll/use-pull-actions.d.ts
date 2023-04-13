import { _ScrollContext } from "./types.js";
import { UseScrollMeta } from "@m78/hooks";
export declare const _usePullActions: (ctx: _ScrollContext) => {
    springStyle: {
        rotate: import("@react-spring/core/dist/declarations/src/SpringValue.js").SpringValue<number>;
        y: import("@react-spring/core/dist/declarations/src/SpringValue.js").SpringValue<number>;
        running: import("@react-spring/core/dist/declarations/src/SpringValue.js").SpringValue<boolean>;
        ratio: import("@react-spring/core/dist/declarations/src/SpringValue.js").SpringValue<number>;
    };
    pullDownNode: JSX.Element | null;
    onPullDown: () => Promise<void>;
    onScroll: (meta: UseScrollMeta) => Promise<void>;
};
export declare type _UsePullActionsReturns = ReturnType<typeof _usePullActions>;
//# sourceMappingURL=use-pull-actions.d.ts.map