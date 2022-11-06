import { Plugin } from "./plugin";
import { ResponseError } from "./response-error";
import { Response } from "./response";
import { pickValid } from "@m78/utils";

/** 在某些请求api(fetch)中，即使出现404/500依然会走resolve，通过此方法自行限定错误范围 */
function checkResponseStatus(status: number) {
  return status >= 200 && status < 300;
}

/** 核心插件，用于完成各种配置对应的基础功能 */
export class CorePlugin extends Plugin<any> {
  before() {
    const start = this.getCurrentOption("start");

    this.ctx._corePlugin = {
      // 从返回、配置等提取出来的反馈信息
      message: "",
    };

    this.ctx._corePlugin.startFlag = start?.(this.options);
  }

  finish(): void {
    const finish = this.getCurrentOption("finish");

    finish?.(this.options, this.ctx._corePlugin.startFlag);
  }

  error(error: ResponseError): void {
    const feedback = this.getCurrentOption("feedBack");

    /**
     * 取错误消息进行反馈, 顺序为:
     * 1. 根据messageField取服务器返回的错误提示消息
     * 2. 根据statusCode生成错误消息
     * 3. Error.message
     * 4. 未知错误
     * */
    const errMessage = error.message;

    /** 从服务器返回中取出的msg */
    let serverMsg = "";

    /** 根据服务器返回状态码获取的msg */
    let statusMsg = "";

    /** 包含response的内部错误 */
    if (error.response) {
      const { response } = error;
      const messageField = this.getCurrentOption("messageField");

      if (response) {
        const data = response.data;

        if (data) {
          serverMsg = data[messageField!];
        }

        statusMsg = error.response.message;
      }
    }

    const finalMsg = pickValid(serverMsg, errMessage, statusMsg);

    // 将Error对象的msg改为与反馈的msg一致
    error.message = finalMsg;

    const errorHook = this.getCurrentOption("error");

    errorHook?.(error, this.options);

    if (!this.options.extraOption.quiet && feedback) {
      feedback(finalMsg, false, this.options, error.response);
    }
  }

  pipe(response: Response) {
    const checkStatus = this.getCurrentOption("checkStatus");
    const serverMsgField = this.getCurrentOption("messageField");

    /**
     * 提示消息, 取值顺序为:
     * 1. 如果请求未失败, 且配置了extraOption.successMessage则直接使用
     * 2. 通过serverMsgField拿到的服务器响应
     * 3. 通过状态码匹配到的错误消息
     * 4. 默认错误信息
     * */
    const message = pickValid(
      response.data?.[serverMsgField!],
      response.message,
      `${response.code ? `${response.code}: ` : ""}请求异常`
    );

    this.ctx._corePlugin.message = message;

    /** 如果包含status，将其视为http状态码并进行检查 */
    if (!checkResponseStatus(response.code)) {
      throw new ResponseError(message, response);
    }

    /** 通过配置的`checkStatus`检测服务器返回是否符合用户预期, 检测为false时抛出异常 */
    if (checkStatus && response.data && !checkStatus(response.data)) {
      throw new ResponseError(message, response);
    }

    const successMessage = this.options.extraOption.successMessage;

    if (successMessage) {
      this.ctx._corePlugin.message = successMessage;
    }

    return response;
  }

  success(data: any, response: Response) {
    const extra = this.options.extraOption;
    const success = this.getCurrentOption("success");

    /** 请求成功，且设置了feedback和useServeFeedBack，使用message进行反馈 */
    if (!extra.quiet && (extra.useServeFeedBack || extra.successMessage)) {
      const { message } = this.ctx._corePlugin;
      const feedback = this.getCurrentOption("feedBack");

      feedback?.(message, true, this.options, response);
    }

    success?.(data, response, this.options);
  }
}
