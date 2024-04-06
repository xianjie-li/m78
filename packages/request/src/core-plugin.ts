import { Plugin } from "./plugin";
import { ResponseError } from "./response-error";
import { Response } from "./response";
import { pickValid } from "@m78/utils";
import { FeedbackMode } from "./interfaces.js";

/** 在某些请求api(fetch)中，即使出现404/500依然会走resolve，通过此方法自行限定错误范围 */
function checkResponseStatus(status: number) {
  return status >= 200 && status < 300;
}

interface BatchData {
  // 当前正在执行的批处理请求, 包含值时, 后续相同的key应该等待其完成, 然后直接使用 response 或 responseError
  currentBatch?: Promise<any>;
  // 该次请求的响应
  response?: Response;
  // 该次请求的错误
  responseError?: ResponseError;
}

/** 核心插件，用于完成各种配置对应的基础功能 */
export class CorePlugin extends Plugin<any> {
  public store: {
    // 记录批处理信息
    batch: {
      // 请求的唯一key
      [key: string]: BatchData;
    };
  };

  // 标记当前插件实例为batch起始实例
  private batchFlag: boolean;

  async before() {
    if (!this.store.batch) this.store.batch = {};

    // 用于缓存/batch等操作的key
    let key = "";
    const keyBuilder = this.getCurrentOption("keyBuilder");

    if (keyBuilder) {
      key = keyBuilder(this.options) || "";
    }

    this.ctx._corePlugin = {
      // 从返回、配置等提取出来的反馈信息
      message: "",
      key,
    };

    // 包含正在执行的batch任务时, 等待其完成
    const [batchData] = this.getCurrentBatchObj();

    if (batchData && batchData.currentBatch) {
      await batchData.currentBatch;

      if (batchData.response) return batchData.response;
      if (batchData.responseError) return batchData.responseError;
    }
  }

  start(currentTask: Promise<Response>) {
    const start = this.getCurrentOption("start");
    const batchInterval = this.getCurrentOption("batchInterval");

    this.ctx._corePlugin.startFlag = start?.(this.options);

    // 若batch data未初始化对其进行初始化
    const [batchData, key] = this.getCurrentBatchObj();

    if (key && !batchData && batchInterval) {
      this.batchFlag = true;
      this.store.batch[key] = {
        currentBatch: currentTask,
      };
    }
  }

  finish(): void {
    const finish = this.getCurrentOption("finish");
    const batchInterval = this.getCurrentOption("batchInterval");

    finish?.(this.options, this.ctx._corePlugin.startFlag);

    // 清理batch data
    if (this.batchFlag) {
      const [, key] = this.getCurrentBatchObj();

      if (key) {
        setTimeout(() => {
          delete this.store.batch[key];
          this.batchFlag = false;
        }, batchInterval || 0);
      }
    }
  }

  error(error: ResponseError): void {
    // 记录完成请求后的error信息
    const [batchData] = this.getCurrentBatchObj();

    if (this.batchFlag && batchData && !batchData.responseError) {
      batchData.responseError = error;
    }

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

    if (
      this.options.extraOption.feedbackMode !== FeedbackMode.none &&
      feedback
    ) {
      feedback(finalMsg, false, this.options, error.response);
    }
  }

  pipe(response: Response) {
    // 记录完成请求后的初始response
    const [batchData] = this.getCurrentBatchObj();

    if (this.batchFlag && batchData && !batchData.response) {
      batchData.response = response.clone();
    }

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

    /** 请求成功且配置了需要成功反馈时，使用message进行反馈 */
    if (
      extra.feedbackMode !== FeedbackMode.none &&
      (extra.feedbackMode === FeedbackMode.all || extra.successMessage)
    ) {
      const { message } = this.ctx._corePlugin;
      const feedback = this.getCurrentOption("feedBack");

      feedback?.(message, true, this.options, response);
    }

    success?.(data, response, this.options);
  }

  // 获取当前请求的batch配置对象和key
  private getCurrentBatchObj() {
    const key = this.ctx._corePlugin.key;

    // 记录完成请求后的初始response
    if (key) {
      const cur = this.store.batch[key];
      return [cur, key] as const;
    }

    return [] as const;
  }
}
