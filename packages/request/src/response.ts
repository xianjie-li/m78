import { AnyObject, isArray, isObject } from "@m78/utils";

/**
 * Response class, used to smooth out differences between returns from different clients
 * */
export class Response<D = any> {
  /** Response message, which is usually the prompt text corresponding to code in the request response */
  message = "";
  /** Http status code. If 0, it usually means that the connection with the server has not been established normally. The error is caused by the local environment, such as network / cors, etc. */
  code = 0;
  /** Response data */
  data: D | null = null;
  /** Response header */
  headers: AnyObject = {};
  /** Original response object */
  original?: any;

  /** Shallow cloning in current state */
  clone(): Response<D> {
    const n = new Response();

    n.message = this.message;
    n.code = this.code;

    if (isArray(this.data)) {
      n.data = [...this.data];
    } else if (isObject(this.data)) {
      n.data = { ...this.data };
    } else {
      n.data = this.data;
    }

    n.headers = { ...this.headers };
    n.original = { ...this.original };

    return n;
  }
}
