import { _FormContext, _FieldContext, FormCommonPropsGetter, FormCustomRender, FormCustomRenderBasicArgs, FormAdaptorsItem, FormAdaptor } from "./types.js";
import { NamePath } from "@m78/utils";
import React from "react";
export declare function _useFieldMethods(ctx: _FormContext, fieldCtx: _FieldContext): {
    getProps: FormCommonPropsGetter;
    getAdaptor: () => {
        adaptorConf?: FormAdaptorsItem | undefined;
        /** 用户在schema或field传入了函数类型的component时, 此项为该函数 */
        componentRender?: FormAdaptor | undefined;
    };
    onChange: (value: any) => void;
    shouldRender: () => boolean;
    getWidth: () => string | number | undefined;
    getBind: () => {
        value: any;
        onChange: (value: any) => void;
        disabled?: boolean | undefined;
        size?: string | undefined;
    };
    getError: (name: NamePath) => string;
    listApiSimplify: (name: NamePath) => {
        add: (items: any, index?: number | undefined) => boolean;
        remove: (index: number) => boolean;
        move: (from: number, to: number) => boolean;
        swap: (from: number, to: number) => boolean;
    };
    extraNodeRenderHelper: (node: React.ReactNode | FormCustomRender) => React.ReactNode;
    getRenderArgs: () => FormCustomRenderBasicArgs;
};
export declare type _UseFieldMethods = ReturnType<typeof _useFieldMethods>;
//# sourceMappingURL=use-field-methods.d.ts.map