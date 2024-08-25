import { _RCTableSelf, _RCTableState, TableDataOperationsConfig } from "../types.js";
import { RCTablePlugin } from "../plugin.js";
export declare function _useStateAct(): {
    self: _RCTableSelf;
    state: _RCTableState;
    setState: import("@m78/hooks").SetState<_RCTableState>;
    ref: import("react").MutableRefObject<HTMLDivElement>;
    scrollRef: import("react").MutableRefObject<HTMLDivElement>;
    scrollContRef: import("react").MutableRefObject<HTMLDivElement>;
    wrapRef: import("react").MutableRefObject<HTMLDivElement>;
    scrollEvent: import("@m78/hooks").CustomEventWithHook<import("@m78/utils").AnyFunction>;
    plugins: (typeof import("../../index.js").TablePlugin | import("../../index.js").TablePlugin)[];
    rcPlugins: RCTablePlugin[];
    dataOperations: TableDataOperationsConfig;
};
//# sourceMappingURL=state.act.d.ts.map