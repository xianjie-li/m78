import { BaseRequestOptions, Options } from "../interfaces.js";
import { Response } from "../response.js";
import { AxiosRequestConfig } from "axios";
export interface AxiosOptions<Ext = {}> extends Omit<AxiosRequestConfig, "url" | "data" | "headers">, Omit<BaseRequestOptions<Options<AxiosOptions<Ext>> & Ext>, "method"> {
}
/** Axios adapter */
export declare function axiosAdapter(opt: AxiosOptions): Promise<Response<any>>;
//# sourceMappingURL=axios.d.ts.map