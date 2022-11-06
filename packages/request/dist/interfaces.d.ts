import { Plugin } from "./plugin";
import { Response } from "./response";
import { ResponseError } from "./response-error";
/**
 * request配置必须遵循的一些字段名, 如果使用请求库与此接口不匹配, 需要在`fetchAdapter`中进行手动桥接
 * - <Ext> 如果指定，会用于扩展extraOption的类型, 当你想要自定义额外的配置时使用(比如你可以扩展extraOption.loading然后在start和finish中进行对应处理)
 * */
export interface BaseRequestOptions<Ext = {}> {
    /** 请求地址 */
    url: string;
    /** 请求体 */
    body?: any;
    /** 请求参数  */
    query?: any;
    /** 请求头, 默认请求类型为 application/json */
    headers?: any;
    /** 额外扩展配置 */
    extraOption?: {
        /** 为true时即使返回服务器状态码正确依然会以服务器返回的消息(根据messageField配置项确定)作为反馈提示 */
        useServeFeedBack?: boolean;
        /** 静默模式，无论正确与否不会有任何提示 */
        quiet?: boolean;
        /** 默认会返回经过format处理的结果，为true时返回原始的response */
        plain?: boolean;
        /** 自定义请求成功的提示, 会覆盖其他根据配置生成的提示消息 */
        successMessage?: string;
        /** 传递其他自定义配置, 并在各种钩子和插件中访问 */
        [key: string]: any;
    } & Ext;
}
/**
 * 请求方法, 根据成功/失败来设置promise的状态
 * 错误分为两种:
 *  1. 常规错误。跨域，网络错误、请求链接等错误，根据配置的fetchAdapter会有所不同
 *  2. 服务器错误。状态码异常、checkStatus未通过等，此时Error对象会包含一个response字段，为服务器返回数据
 * */
export interface Request<Opt> {
    <Data = any>(url: string, options?: Omit<Opt, "url">): Promise<Data>;
}
/** 基础配置，支持在createInstance和request(opt.extraOption)时配置，后者配置会覆盖前者 */
export interface Options<Opt> {
    /** 接收服务器response，返回一个boolean值用于判定该次请求是否成功(状态码等在内部已处理，只需要关心服务器实际返回的data) */
    checkStatus?(data: any): boolean;
    /** 用来从服务端请求中提取提示文本的字段 */
    messageField?: string;
    /**
     * 用于向用户提供反馈
     * @param message - 反馈消息
     * @param status - 反馈状态: true成功, false失败
     * @param option - 请求配置
     * @param response - 请求响应
     * */
    feedBack?(message: string, status: boolean, option: Opt, response?: Response): void;
    /** 将response格式化为自己想要的格式后返回, 会在所有插件执行完毕后执行  */
    format?(response: Response, option: Opt): any;
    /** 请求开始 */
    start?(requestConfig: Opt): any;
    /** 请求结束, flag是start hook的返回值, 通常为从start中返回的loading等的关闭标识 */
    finish?(requestConfig: Opt, flag?: any): void;
    /** 请求失败 */
    error?(resError: ResponseError, option: Opt): void;
    /** 请求成功 */
    success?(data: any, response: Response, option: Opt): void;
}
/** 创建request实例时的配置 */
export interface CreateOptions<Opt> extends Options<Opt> {
    /**
     * 请求适配器, 收配置并返回promise的函数, 默认使用fetch进行请求
     * - 配置包含BaseRequestOptions中的几个必要字段, 如果使用的请求库不符合这些字段名配置，需要手动抹平
     * - 如果请求成功, 解析Response对象
     * - 如果请求失败, 需要抛出ResponseError类型的错误
     * */
    adapter: (options: Opt) => Promise<Response>;
    /** 传递给Request的默认配置，会在请求时深合并到请求配置中 */
    baseOptions?: Partial<Opt>;
    /** 插件 */
    plugins?: Array<typeof Plugin>;
}
//# sourceMappingURL=interfaces.d.ts.map