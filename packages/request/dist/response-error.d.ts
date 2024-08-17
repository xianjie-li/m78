import { Response } from "./response.js";
/** Standard error format, which includes a response when a request is received but has error */
export declare class ResponseError extends Error {
    response?: Response | undefined;
    constructor(message: string, response?: Response | undefined);
}
//# sourceMappingURL=response-error.d.ts.map