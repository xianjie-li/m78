import { Response } from "./response";
/** Standard error format, which includes a response when a request is received but has error */
export declare class ResponseError extends Error {
    response?: Response<any> | undefined;
    constructor(message: string, response?: Response<any> | undefined);
}
//# sourceMappingURL=response-error.d.ts.map