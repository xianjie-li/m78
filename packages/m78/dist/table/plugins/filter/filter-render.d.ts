import { FormInstance } from "../../../form/index.js";
import React from "react";
import { SetState } from "@m78/hooks";
/** 通用筛选弹层渲染逻辑 */
export declare const _FilterBtnCommon: ({ render, isToolbar, children, }: {
    render?: ((form: FormInstance) => React.ReactNode) | undefined;
    isToolbar?: boolean | undefined;
    children: (arg: {
        state: {
            open: boolean;
            changed: boolean;
        };
        setState: SetState<{
            open: boolean;
            changed: boolean;
        }>;
        renderContent: () => JSX.Element;
    }) => React.ReactElement;
}) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
//# sourceMappingURL=filter-render.d.ts.map