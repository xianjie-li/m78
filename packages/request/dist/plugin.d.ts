import { BaseRequestOptions, CreateOptions, Options } from "./interfaces";
import { ResponseError } from "./response-error";
import { Response } from "./response";
export declare class Plugin<Opt extends BaseRequestOptions = BaseRequestOptions> {
    ctx: any;
    createOptions: CreateOptions<Opt>;
    options: Opt;
    constructor(ctx: any, // 在不同插件间共享数据的对象, 插件应仅在自己命名空间下进行操作, 如缓存插件使用ctx.catch.xx
    createOptions: CreateOptions<Opt>, // 创建时配置
    options: Opt);
    /**
     * 帮助函数，从extraOption或createOption中取出指定名称的方法，前者优先级更高
     * */
    getCurrentOption<key extends keyof Options<Opt>>(optionField: key): Options<Opt>[key];
    /**
     * 请求开始之前执行, 如果返回了任意有效值, 会阻断后续所有操作并直接以`Promise<返回值>`作为request调用的响应
     * */
    before?(): any;
    /**
     * 转换请求结果并返回, 在转换过程中可以通过抛出错误来主动使该次请求'失败', 并进入catch阶段
     * @param response - response是根据你配置的请求库类型返回决定的
     * @return - 必须将经过处理后的response return，其他插件才能接受到经过处理后的response
     * */
    pipe?(response: Response): Response;
    /**
     * 请求成功, 对数据的处理请在pipe中执行，此函数只应用于进行消息反馈等
     * */
    success?(data: any, response: Response): void;
    /** 请求失败 */
    error?(error: ResponseError): void;
    /** 请求结束 */
    finish?(): void;
}
//# sourceMappingURL=plugin.d.ts.map