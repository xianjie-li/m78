import _defaultsDeep from "lodash/defaultsDeep";
import { AnyObject } from "@lxjx/utils";
import { BaseRequestOptions, CreateOptions, Request } from "./interfaces";
import { defaultCreateConfig } from "./default";
import { CorePlugin } from "./core-plugin";
import { ResponseError } from "./response-error";
import { isFunction, isTruthyOrZero } from "@m78/utils";

/**
 * 创建Request实例
 * <Opt> - 创建的request函数的配置参数类型
 * @param options - 配置
 * @return - Request实例
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
      return new Plugin(ctx, cOpt, options);
    });

    /* ======== before ======= */
    for (const plugin of plugins) {
      const returns = plugin.before?.();

      if (isTruthyOrZero(returns)) {
        return returns;
      }
    }

    return (
      cOpt.adapter!(options)
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
          if (format && !extra.plain) {
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
  };

  return request;
};

export * from "./plugin";
