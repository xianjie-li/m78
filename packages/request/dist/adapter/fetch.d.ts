import { BaseRequestOptions } from "../interfaces";
import { Response } from "../response";
export interface FetchOptions<Ext = {}> extends Omit<RequestInit, "body" | "headers">, BaseRequestOptions<Ext> {
}
/** fetch适配 */
export declare function fetchAdapter(opt: FetchOptions): Promise<Response<any>>;
//# sourceMappingURL=fetch.d.ts.map