import { Response } from "./response";

/** 标准错误格式, 当收到请求但请求失败时，会包含response */
export class ResponseError extends Error {
  constructor(message: string, public response?: Response) {
    super(message);
  }
}
