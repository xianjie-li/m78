import React from "react";
import { OverlayInstance } from "../overlay/index.js";
import { DialogProps, DialogQuicker } from "./types.js";
declare const _Dialog: {
    (props: DialogProps): React.JSX.Element;
    defaultProps: Partial<DialogProps>;
    displayName: string;
} & import("@m78/render-api").RenderApiInstance<Omit<DialogProps, "children" | "onChange" | "open" | "innerRef" | "defaultOpen" | "childrenAsTarget" | "triggerType" | "onUpdate" | "onDispose" | "instanceRef">, OverlayInstance> & {
    quicker: DialogQuicker;
    info: DialogQuicker;
    error: DialogQuicker;
    success: DialogQuicker;
    warning: DialogQuicker;
};
export { _Dialog };
//# sourceMappingURL=dialog.d.ts.map