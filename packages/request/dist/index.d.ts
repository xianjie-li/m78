import { BaseRequestOptions, CreateOptions, Request } from "./interfaces.js";
/**
 * Create request instance
 * <Opt> - Request config type
 * @param options - create options
 * @return - request instance
 * */
export declare const createRequest: <Opt extends BaseRequestOptions<{}>>(options: CreateOptions<Opt>) => Request<Opt>;
export * from "./plugin";
//# sourceMappingURL=index.d.ts.map