import { BaseRequestOptions, CreateOptions, Request } from "./interfaces";
/**
 * 创建Request实例
 * <Opt> - 创建的request函数的配置参数类型
 * @param options - 配置
 * @return - Request实例
 * */
export declare const createRequest: <Opt extends BaseRequestOptions<{}>>(options: CreateOptions<Opt>) => Request<Opt>;
export * from "./plugin";
//# sourceMappingURL=index.d.ts.map