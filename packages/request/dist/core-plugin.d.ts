import { Plugin } from "./plugin";
import { ResponseError } from "./response-error";
import { Response } from "./response";
/** 核心插件，用于完成各种配置对应的基础功能 */
export declare class CorePlugin extends Plugin<any> {
    before(): void;
    finish(): void;
    error(error: ResponseError): void;
    pipe(response: Response): Response<any>;
    success(data: any, response: Response): void;
}
//# sourceMappingURL=core-plugin.d.ts.map