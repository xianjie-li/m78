import { OverlayInstance } from "../overlay/index.js";
import { DrawerProps } from "./types.js";
declare const _Drawer: {
    (props: DrawerProps): JSX.Element;
    defaultProps: Partial<DrawerProps>;
} & import("@m78/render-api").RenderApiInstance<Omit<DrawerProps, "children" | "onChange" | "open" | "innerRef" | "instanceRef" | "defaultOpen" | "childrenAsTarget" | "triggerType" | "onUpdate" | "onDispose">, OverlayInstance>;
export { _Drawer };
//# sourceMappingURL=drawer.d.ts.map