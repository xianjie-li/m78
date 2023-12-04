import { Response } from "./response";

/** Standard error format, which includes a response when a request is received but has error */
export class ResponseError extends Error {
  constructor(message: string, public response?: Response) {
    super(message);
  }
}
