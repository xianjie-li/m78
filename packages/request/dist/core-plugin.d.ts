import { Plugin } from "./plugin";
import { ResponseError } from "./response-error";
import { Response } from "./response";
interface BatchData {
    currentBatch?: Promise<any>;
    response?: Response;
    responseError?: ResponseError;
}
/** 核心插件，用于完成各种配置对应的基础功能 */
export declare class CorePlugin extends Plugin<any> {
    store: {
        batch: {
            [key: string]: BatchData;
        };
    };
    private batchFlag;
    before(): Promise<Response<any> | ResponseError | undefined>;
    start(currentTask: Promise<Response>): void;
    finish(): void;
    error(error: ResponseError): void;
    pipe(response: Response): Response<any>;
    success(data: any, response: Response): void;
    private getCurrentBatchObj;
}
export {};
//# sourceMappingURL=core-plugin.d.ts.map