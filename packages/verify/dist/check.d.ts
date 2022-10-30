import { Config, RejectMeta, Verify } from "./types";
/**
 * 获取check api，verify此时还不可操作, 仅可作为引用传递
 * - 这里要注意的点是，同步和异步 check流程极为相似，为了最大程度的复用，在同步验证时这里通过syncCallBack来对检测结果进行同步回调
 * */
export declare function getCheckApi(conf: Required<Config>, verify: Verify): {
    check: (source: any, rootSchema: import("./types").SchemaWithoutName, config?: import("./types").CheckConfig | undefined) => RejectMeta | null;
    asyncCheck: (source: any, rootSchema: import("./types").SchemaWithoutName, config?: import("./types").CheckConfig | undefined) => Promise<void>;
};
//# sourceMappingURL=check.d.ts.map