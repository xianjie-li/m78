import { _Context, _FieldContext, FormCommonPropsGetter, FormCustomRender, FormCustomRenderArgs } from "./types.js";
import { NamePath } from "@m78/utils";
import React from "react";
export declare function _useFieldMethods(ctx: _Context, fieldCtx: _FieldContext): {
    getProps: FormCommonPropsGetter;
    onChange: (...args: any[]) => void;
    shouldRender: () => boolean;
    getWidth: () => string | number | undefined;
    getBind: () => any;
    getError: (name: NamePath) => string;
    listApiSimplify: (name: NamePath) => {
        add: (items: any, index?: number | undefined) => boolean;
        remove: (index: number) => boolean;
        move: (from: number, to: number) => boolean;
        swap: (from: number, to: number) => boolean;
    };
    getRegisterComponent: () => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    extraNodeRenderHelper: (node: React.ReactNode | FormCustomRender) => React.ReactNode;
    getRenderArgs: () => FormCustomRenderArgs;
};
export declare type _UseFieldMethods = ReturnType<typeof _useFieldMethods>;
//# sourceMappingURL=use-field-methods.d.ts.map