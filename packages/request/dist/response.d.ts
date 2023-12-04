import { AnyObject } from "@m78/utils";
/**
 * Response class, used to smooth out differences between returns from different clients
 * */
export declare class Response<D = any> {
    /** Response message, which is usually the prompt text corresponding to code in the request response */
    message: string;
    /** Http status code. If 0, it usually means that the connection with the server has not been established normally. The error is caused by the local environment, such as network / cors, etc. */
    code: number;
    /** Response data */
    data: D | null;
    /** Response header */
    headers: AnyObject;
    /** Original response object */
    original?: any;
    /** Shallow cloning in current state */
    clone(): Response<D>;
}
//# sourceMappingURL=response.d.ts.map