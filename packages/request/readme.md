<h1 align="center" style="color: #61dafb;">Request</h1>
<h1 align="center" style="font-size: 80px;color:#61dafb">♻</h1>
<p align="center">make data requests easier
</p>
<br>
<br>

## Features

- Supports all JavaScript runtimes and can be used in conjunction with any request library (fetch/Axios/mini program, etc.)
- Used to solve repetitive and tedious parts such as error handling, centralized feedback, data processing, interception, and merging duplicate requests in data requests
- Flexible and comprehensive configuration with support for plugins

<br>
<br>

## Installation

```
npm install @m78/request
```

<br>
<br>

## Usage

Usage and Configuration Overview:

```ts
import createRequest from '@m78/request';
import { AxiosOptions, axiosAdapter } from '@m78/request/adapter/axios';	// Import adapter, currently supports fetch and axios
// import { FetchOptions, fetchAdapter } from "./adapter/fetch"

// Create a request instance
const request = createRequest<AxiosOptions>({
  /* ############## Adapter configuration ############## */
  adapter: axiosAdapter,

  /* ############## Functional configuration: interceptor, loading status, message feedback, personalized configuration based on server returns, etc. These configurations can be used separately at the request level ##############  */
  /** Receives server response，return a boolean to determine whether the request was successful or not. (data has been processed by `option.format`) */
  checkStatus: data => data.code === 0,
  /** Field to get server message */
  messageField: 'message',
  /** Used to provide feedback to user */
  feedBack(message, status, option, response) {
    console.log('request feedback:', status ? 'success' : 'error');
    console.log('message:', message);
  },
  /** Convert response to actual need data, invoke after all plugin is called.  */
  format: (response, option) => response?.data?.data,
  /** Request start */
  start(option: AxiosOptions) {
    console.log('request start');

    requestConfig.headers = {
      ...requestConfig.headers,
      token: 'a token',
    };

    requestConfig.extraOption.loading && console.log('loading...');

    return Math.random(); // used by finish()
  },
  /** Request finish, flag is returned by start hook, usually, it is the identifier for loading/close modal */
  finish(option: AxiosOptions, flag) {
    console.log('request finish', flag);
  },
  /** Request error */
  error(resError, option) {},
  /** Request success */
  success(data, response, option) {},

  /** How to generate unique key by request options, use to batch and cache. */
  keyBuilder(option) {},
  /** Default: 200 | Batch process interval (ms), if multiple requests with the same key are issued within this time interval, these requests will be merged into a single request.  */
  batchInterval: 500,


  // ############## other API ##############
  /** Default configuration passed to request，will deep merge into request config */
  baseOptions: { timeout: 8000 },
  /** plugins */
  plugins: [plugin1, plugin2],
});

interface ResponseType {
  name: string;
  age: number;
}

// Use the request instance to initiate a request, where ResponseType is the type of return value, defaulting to any
request<ResponseType>('/api/user', {
    // ############## base config ##############
    /** Request body */
    body?: any;
    /** Convert to request search string   */
    query?: AnyObject;
    /** Request Headers, default `Content-Type` is application/json */
    headers?: AnyObject;
    /** Default: GET | Request method, like GET/POST/PUT */
    method?: string;
    // ############## extra config ##############
    extraOption: {
      /** Default: error | Request Feedback Mode: error - feedback on error, none - no feedback, all - feedback on success/error */
      feedbackMode?: FeedbackMode;
      /** Custom success feedback message, default obtained through `opt.messageField` */
      successMessage?: string;
      /** Pass other custom option and access them in hooks and plugins */
      [key: string]: any;
      /** Most of the creation configurations can also be used, with priority over the configurations passed in at the time of creation */
      start() {};
      format(res) { return res.data };
    },
    /** Other configurations will be passed in to the used request library as is */
    timeout: 8000
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });

```

<br>

<br>

## Plugin

Used to expand library capabilities.

```ts
class Plugin<Opt extends BaseRequestOptions = BaseRequestOptions> {
  constructor(
    /** Objects that share data between different plugins should only be operated by plugins in their own namespace, such as caching plugins using ctx.catch.xx */
    public ctx: any,
    /** Create options */
    public createOptions: CreateOptions<Opt>,
    /** Current request options */
    public options: Opt,
    /** Store content shared in the current request instance */
    public store: any
  ) {}

  /**
   * helper，extract specified propriety for extraOption or createOption, extraOption > createOption
   * */
  getCurrentOption<key extends keyof Options<Opt>>(
    optionField: key
  ): Options<Opt>[key] {
    return (
      getNamePathValue(this.options, ["extraOption", optionField]) ||
      this.createOptions[optionField]
    );
  }

  /**
   * Execute before the request starts. If a valid value is returned, it will behave differently depending on the type of value:
   * - Response: skip real request, use this Response continue to perform subsequent operations
   * - ResponseError: skip real request,  use this ResponseError continue to perform subsequent operations
   * - other valid value: skip real request, use this value as Promise resolve value, like Promise.resolve(returnValue)
   *
   * Once a value is returned, subsequent `plugin.before` executions will be skipped.
   * */
  before?(): Promise<any>;

  /** Promise instance created, request issued */
  start?(currentTask: Promise<Response>): void;

  /**
   * Convert the request result and return it. During the conversion process, you can actively make the request 'error' by throwing an error and enter the catch phase.
   * @param response - Response is determined based on the type of request library configured.
   * @return - The processed response must be returned before other plugins can receive the processed response
   * */
  pipe?(response: Response): Response;

  /** The request was successful. Please execute the data processing in the pipe(). success() only applicable for message feedback, etc */
  success?(data: any, response: Response): void;

  /** Request error */
  error?(error: ResponseError): void;

  /** Request finish */
  finish?(): void;
}
```

<br>

<br>

## Custom adapter

Through different adapters, this library can be used in different environments and request APIs, such as browsers, nodes, react native, fetch, axios, mini programs, etc

> Currently, there are built-in adapters for fetch and axios

As a reference, the following is the adapter implementation for Axios

```ts
// You can import these types from @m78/request
import { BaseRequestOptions, Options } from "../interfaces";
import { Response } from "../response";
import { ResponseError } from "../response-error";

import axios, { AxiosRequestConfig } from "axios";
import { omit } from "@m78/utils";

export interface AxiosOptions<Ext = {}>
  extends Omit<AxiosRequestConfig, "url" | "data" | "headers">,
    Omit<BaseRequestOptions<Options<AxiosOptions<Ext>> & Ext>, "method"> {}

const responseProcess = (res: any) => {
  const response = new Response();

  response.message = res.statusText;
  response.code = res.status;
  response.headers = res.headers;
  response.data = res.data;
  response.original = res;

  return response;
};

/** Axios adapter */
export function axiosAdapter(opt: AxiosOptions) {
  return axios(opt.url, {
    ...omit(opt, ["body", "query"]),
    data: opt.body,
    params: opt.query,
  })
    .then(responseProcess)
    .catch((err) => {
      return Promise.reject(
        new ResponseError(
          `${err.name}: ${err.message}`,
          err?.response ? responseProcess(err.response) : undefined
        )
      );
    });
}
```

<br>
<br>
