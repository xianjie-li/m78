import { BaseRequestOptions, Options } from "../interfaces";
import { Response } from "../response";
import { AxiosRequestConfig } from "axios";
export interface AxiosOptions<Ext = {}> extends Omit<AxiosRequestConfig, "url" | "data" | "headers">, BaseRequestOptions<Options<AxiosOptions<Ext>> & Ext> {
}
/** axios适配 */
export declare function axiosAdapter(opt: AxiosOptions): Promise<Response<any>>;
//# sourceMappingURL=axios.d.ts.map