<h1 align="center" style="color: #61dafb;">Request</h1>
<h1 align="center" style="font-size: 80px;color:#61dafb">♻</h1>
<p align="center">make data requests easier
</p>

<br>
<br>

## Introduce

一个让数据请求变得更简单的库

<br>
<br>

## Features

- 支持所有 javascript 运行时, 可以和任何请求库(fetch/axios/小程序等)搭配使用
- 主要用于解决数据请求中 `错误处理`、`集中反馈`、`数据处理`、`拦截` 等重复且枯燥的部分
- 灵活全面的配置且支持插件

<br>
<br>

## Installation

```
npm install @m78/request
```

<br>
<br>

## 概览

通过不同的适配器, 可以将此库用于不同的环境, 不同的请求api, 比如 浏览器, node, react-native, 小程序等

> 目前内置了 fetch 和 axios 的适配器, 编写适配器非常的简单, 只需要调整你使用请求库的出入参, 达到与本库匹配即可

```ts
import createRequest from '@m78/request';
import { AxiosOptions, axiosAdapter } from '@m78/request/adapter/axios';
// import { FetchOptions, fetchAdapter } from "./adapter/fetch"

// 通过传入AxiosRequestConfig来指定request(options)中options的类型
const request = createRequest<AxiosOptions>({
  /* ############## 适配器配置 ############## */
  adapter: axiosAdapter,

  /* ############## 其他配置: 拦截器、加载状态、消息反馈、根据服务器返回进行的个性化配置等, 这些配置可以在request级别单独使用 ##############  */
  // 接收服务器response，返回一个boolean值用于判定该次请求是否成功
  checkStatus: data => data.code === 0,
  // 用来从服务端请求中提取提示文本的字段
  messageField: 'message',
  // 用于向用户提供反馈
  feedBack(message: string, status: boolean) {
    console.log('请求提示:', status ? '成功' : '失败');
    console.log('反馈消息:', message);
  },
  // 将response预格式化为自己想要的格式后返回
  format: response => response?.data?.data,
  // 请求开始，可以在此配置loading，token等
  start(requestConfig) {
    console.log('请求开始');

    requestConfig.headers = {
      ...requestConfig.headers,
      token: 'a token',
    };

    requestConfig.extraOption.loading && console.log('请求中...');

    return Math.random(); // 返回值作为finish的第二个参数传入，用于关闭弹窗等
  },
  // 请求结束, flag是start hook的返回值, 通常为从start中返回的loading等的关闭标识
  finish(option, flag) {
    console.log('请求结束', flag);
  },
  /** 请求失败 */
  error?(resError: ResponseError, option: Opt): void;
  /** 请求成功 */
  success?(data: any, response: Response, option: Opt): void;
  
  // ############## 其他API ##############
  /** 传递给Request的默认配置，会在请求时深合并到请求配置中 */
  baseOptions?: Partial<Opt>;
  /** 插件 */
  plugins?: Array<typeof Plugin>;
});

interface ResponseType {
  name: string;
  age: number;
}

// 通过request发起请求，ResponseType是返回值的类型，默认为any
request<ResponseType>('/api/user', {
  	/** ## 基础配置 */
    /** 请求体 */
    body?: any;
    /** 请求参数  */
    query?: any;
    /** 请求头, 默认请求类型为 application/json */
    headers?: any;
    /** ## 额外扩展配置 */
    extraOption: {
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
      /** 大部分创建配置也可以使用, 优先级高于创建时传入的配置 */
      start() {},
    },
    /** ## 可以传入所用请求库特有配置 */
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

## 插件

实现了简单的插件系统, 本库的核心能力都是在一个名为 `CorePlugin` 的插件中实现的, 如果你需要跟进一步的行为增强, 可以参考插件类型声明进行编写, 但在大部分场景下, 只需要使用创建时提供的钩子就足够了.
