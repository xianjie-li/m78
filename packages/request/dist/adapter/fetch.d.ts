import { BaseRequestOptions } from "../interfaces";
import { Response } from "../response";
export interface FetchOptions<Ext = {}> extends Omit<RequestInit, "body" | "headers">, Omit<BaseRequestOptions<Ext>, "method"> {
}
/** Fetch adapter */
export declare function fetchAdapter(opt: FetchOptions): Promise<Response<any>>;
//# sourceMappingURL=fetch.d.ts.map