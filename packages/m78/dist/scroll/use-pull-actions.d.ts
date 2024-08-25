import React from "react";
import { _ScrollContext } from "./types.js";
import type { ScrollTriggerState } from "@m78/trigger/scroll.js";
export declare const _usePullActions: (ctx: _ScrollContext) => {
    springStyle: {
        rotate: import("react-spring").SpringValue<number>;
        y: import("react-spring").SpringValue<number>;
        running: import("react-spring").SpringValue<boolean>;
        ratio: import("react-spring").SpringValue<number>;
    };
    pullDownNode: React.JSX.Element | null;
    onPullDown: () => Promise<void>;
    onScroll: (meta: ScrollTriggerState) => Promise<void>;
};
export type _UsePullActionsReturns = ReturnType<typeof _usePullActions>;
//# sourceMappingURL=use-pull-actions.d.ts.map