import { Response } from "./response";
/** 标准错误格式, 当收到请求但请求失败时，会包含response */
export declare class ResponseError extends Error {
    response?: Response<any> | undefined;
    constructor(message: string, response?: Response<any> | undefined);
}
//# sourceMappingURL=response-error.d.ts.map