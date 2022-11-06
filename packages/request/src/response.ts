import { AnyObject } from "@m78/utils";

/**
 * 响应类, 用于抹平不同客户端返回之间的差异
 * */
export class Response<D = any> {
  /** 响应消息, 通常是请求响应中与code对应的提示文本 */
  message = "";
  /** http状态码, 若为0, 通常意味着未与服务器正常建立连接, 错误是由于本地环境导致, 如网络/cors等 */
  code = 0;
  /** 响应数据 */
  data: D | null = null;
  /** 响应头 */
  headers: AnyObject = {};
  /** 原始响应对象 */
  original?: any;
}
