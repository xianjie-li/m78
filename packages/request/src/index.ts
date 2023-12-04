import _defaultsDeep from "lodash/defaultsDeep.js";
import { AnyObject } from "@lxjx/utils";
import { BaseRequestOptions, CreateOptions, Request } from "./interfaces.js";
import { defaultCreateConfig } from "./default.js";
import { CorePlugin } from "./core-plugin.js";
import { ResponseError } from "./response-error.js";
import { isFunction, isTruthyOrZero } from "@m78/utils";
import { Response } from "./response.js";

/**
 * Create request instance
 * <Opt> - Request config type
 * @param options - create options
 * @return - request instance
 * */
export const createRequest = <Opt extends BaseRequestOptions>(
  options: CreateOptions<Opt>
) => {
  // 创建时配置
  const cOpt = {
    ...defaultCreateConfig,
    ...options,
    plugins: [CorePlugin, ...(options.plugins || [])],
  } as CreateOptions<Opt>;

  const { baseOptions } = cOpt;

  // 存储在当前request实例中共享的内容
  const store: any = {};

  const request: Request<Opt> = async (url, optionsArg) => {
    // 请求时配置
    const options: Opt = _defaultsDeep(
      {
        url,
        extraOption: {},
      },
      optionsArg,
      baseOptions,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );

    // 额外配置
    const extra: Opt["extraOption"] = options.extraOption!;

    const ctx: AnyObject = {};

    const format = extra!.format || cOpt.format;

    const plugins = cOpt.plugins!.map((Plugin) => {
      return new Plugin(ctx, cOpt, options, store);
    });

    // 若存在已有的响应或错误, 跳过请求直接使用对应内容执行后续操作, 用于缓存/批处理等实现
    let existResponse: Response | null = null;
    let existError: ResponseError | null = null;

    /* ======== before ======= */
    for (const plugin of plugins) {
      const returns = await plugin.before?.();

      if (returns instanceof Response) {
        existResponse = returns;
        break;
      }

      if (returns instanceof ResponseError) {
        existError = returns;
        break;
      }

      if (isTruthyOrZero(returns)) {
        return returns;
      }
    }

    // 处理传入的异步操作, 并根据响应执行后续流程
    function handleTask(pm: Promise<Response>) {
      plugins.forEach((plugin) => {
        plugin.start?.(pm);
      });

      return (
        pm
          /* ======== pipe ======= */
          .then((response) => {
            return plugins.reduce((prev, plugin) => {
              if (isFunction(plugin.pipe)) {
                return plugin.pipe(prev);
              }
              return prev;
            }, response);
          })
          /* ======== success ======= */
          .then((response) => {
            let res = response;

            // 格式化返回
            if (format) {
              res = format(response, options);
            }

            plugins.forEach((plugin) => {
              plugin.success?.(res, response);
            });

            return res;
          })
          /* ======== error ======= */
          .catch((error: ResponseError) => {
            plugins.forEach((plugin) => {
              plugin.error?.(error);
            });

            return Promise.reject(error);
          })
          /* ======== finish ======= */
          .finally(() => {
            plugins.forEach((plugin) => {
              plugin.finish?.();
            });
          })
      );
    }

    if (existResponse) return handleTask(Promise.resolve(existResponse));
    if (existError) return handleTask(Promise.reject(existError));

    return handleTask(cOpt.adapter!(options));
  };

  return request;
};

export * from "./plugin";
