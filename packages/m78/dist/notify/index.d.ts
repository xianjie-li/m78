import "../common/init/index.js";
import "./index.scss";
import { _loading } from "./notify.js";
export declare const notify: import("@m78/render-api/types.js").RenderApiInstance<import("./types.js").NotifyState, null> & {
    loading: typeof _loading;
} & {
    quicker: import("./types.js").NotifyQuicker;
    info: import("./types.js").NotifyQuicker;
    error: import("./types.js").NotifyQuicker;
    success: import("./types.js").NotifyQuicker;
    warning: import("./types.js").NotifyQuicker;
};
export * from "./types.js";
//# sourceMappingURL=index.d.ts.map