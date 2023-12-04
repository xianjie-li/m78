import { Plugin } from "./plugin";
import { Response } from "./response";
import { ResponseError } from "./response-error";
import { AnyObject } from "@lxjx/utils";

/** Feedback mode */
export enum FeedbackMode {
  /** Feedback on error */
  error = "error",
  /** No feedback */
  all = "all",
  /** Feedback on success/error */
  none = "none",
}

/**
 * Request configuration must follow the basic configuration, if it does not match, manual bridging is required in `fetchAdapter`
 * - <Ext> If specified，which will be used to extend extraOption, use when you want to customize extra config
 * */
export interface BaseRequestOptions<Ext = {}> {
  /** Request address */
  url: string;
  /** Request body */
  body?: any;
  /** Convert to request search string   */
  query?: AnyObject;
  /** Request Headers, default `Content-Type` is application/json */
  headers?: AnyObject;
  /** Default: GET | Request method, like GET/POST/PUT */
  method?: string;
  /** Extra options */
  extraOption?: {
    /** Default: error | Request Feedback Mode: error - feedback on error, none - no feedback, all - feedback on success/error */
    feedbackMode?: FeedbackMode;
    /** Custom success feedback message, default obtained through `opt.messageField` */
    successMessage?: string;
    /** Pass other custom option and access them in hooks and plugins */
    [key: string]: any;
  } & Ext;
}

/**
 * Request instance.
 *
 * There are tow types error:
 *  1. Client error. like cross domain，network error etc. it will be different according fetchAdapter.
 *  2. Server error. status code exception, checkStatus not pass etc. at this point, the Error object will contain a response field to return data to the server
 * */
export interface Request<Opt> {
  <Data = any>(url: string, options?: Omit<Opt, "url">): Promise<Data>;
}

/** base options，support createInstance and request(opt) both，request option has a higher priority */
export interface Options<Opt> {
  /** Receives server response，return a boolean to determine whether the request was successful or not. (data has been processed by `option.format`) */
  checkStatus?(data: any): boolean;

  /** Field to get server message */
  messageField?: string;

  /**
   * Used to provide feedback to user
   * @param message - feedback message
   * @param status - true: success, false: error
   * @param option
   * @param response
   * */
  feedBack?(
    message: string,
    status: boolean,
    option: Opt,
    response?: Response
  ): void;

  /** Convert response to actual need data, invoke after all plugin is called.  */
  format?(response: Response, option: Opt): any;

  /** Request start */
  start?(option: Opt): any;

  /** Request finish, flag is returned by start hook, usually, it is the identifier for loading/close modal */
  finish?(option: Opt, flag?: any): void;

  /** Request error */
  error?(resError: ResponseError, option: Opt): void;

  /** Request success */
  success?(data: any, response: Response, option: Opt): void;

  /**
   * How to generate unique key by request options, use to batch and cache.
   *
   * By default, when `option.method` is GET/get, use `method + url + JSON.stringify(query) + JSON.stringify(headers)` as key.
   *
   * If return nothing, request will never be cached and batch.
   * */
  keyBuilder?(option: Opt): string | void;

  /** Default: 200 | Batch process interval (ms), if multiple requests with the same key are issued within this time interval, these requests will be merged into a single request.  */
  batchInterval?: number;
}

/** Request instance create options */
export interface CreateOptions<Opt> extends Options<Opt> {
  /**
   * Request adapter, receive request options and return a promise.
   * - The configuration includes several necessary fields in BaseRequestOptions. If the request library used does not match the configuration of these field names, manual smoothing is required
   * - If the request is successful, resolve the response object
   * - If the request fails, an error of type ResponseError needs to be thrown
   * */
  adapter: (options: Opt) => Promise<Response>;
  /** Default configuration passed to request，will deep merge into request config */
  baseOptions?: Partial<Opt>;
  /** plugins */
  plugins?: Array<typeof Plugin>;
}
