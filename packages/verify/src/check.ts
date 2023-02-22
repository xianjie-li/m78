import {
  AnyFunction,
  AnyObject,
  getNamePathValue,
  isArray,
  isFunction,
  isObject,
  isString,
  stringifyNamePath,
  ensureArray,
  interpolate,
  NamePath,
} from "@m78/utils";
import {
  Config,
  ErrorTemplateType,
  Meta,
  RejectMeta,
  Schema,
  Validator,
  Verify,
} from "./types.js";
import {
  fmtValidator,
  isErrorTemplateInterpolate,
  SOURCE_ROOT_NAME,
} from "./common.js";
import { isVerifyEmpty } from "./validator/required.js";
import { VerifyError } from "./error.js";

/**
 * 获取check api，verify此时还不可操作, 仅可作为引用传递
 * - 这里要注意的点是，同步和异步 check流程极为相似，为了最大程度的复用，在同步验证时这里通过syncCallBack来对检测结果进行同步回调
 * */
export function getCheckApi(conf: Required<Config>, verify: Verify) {
  const baseCheck = async (
    args: Parameters<Verify["asyncCheck"]>,
    syncCallback?: AnyFunction
  ) => {
    // 传入callback视为同步调用
    const isSync = !!syncCallback;

    const [source, _rootSchema, _config] = args;

    const rootSchema = {
      ..._rootSchema,
      name: SOURCE_ROOT_NAME,
    };

    const rejectMeta: RejectMeta = [];

    const getValueByName: Meta["getValueByName"] = (name) =>
      getNamePathValue(source, name);

    // 对一项schema执行检测, 返回true时可按需跳过后续schema的验证
    // 如果传入parentNames，会将当前项作为指向并将parentNames与当前name拼接
    // 同步调用时需要使用checkItemSyncCallback通知跳过验证
    async function checkSchema(
      schema: Schema,
      parentNames: NamePath,
      checkItemSyncCallback?: AnyFunction
    ) {
      const isRootSchema = schema.name === SOURCE_ROOT_NAME;

      const parentNamePath = ensureArray(parentNames);
      const namePath = [...parentNamePath, ...ensureArray(schema.name)];
      // 排除rootSchema的真实name
      const realNamePath = isRootSchema ? [] : namePath;

      let value = isRootSchema ? source : getValueByName(namePath);

      const name = stringifyNamePath(namePath);
      const label = schema.label || name;

      // 预转换值
      if (schema.transform) value = schema.transform(value);

      const isEmpty = isVerifyEmpty(value);

      const validators = fmtValidator(schema.validator, isEmpty);

      // 插值对象
      const interpolateValues: AnyObject = {
        name,
        label,
        value,
        type: Object.prototype.toString.call(value),
      };

      // 当前schema是否通过验证, 未通过时其值集验证器不进行验证
      let currentPass = true;

      // 验证validators
      if (validators?.length) {
        for (const validator of validators) {
          let errorTemplate: ErrorTemplateType = "";

          const meta: Meta = {
            verify,
            name,
            label,
            value,
            values: source,
            schema,
            rootSchema,
            getValueByName,
            config: conf,
            parentNamePath,
            namePath,
            isEmpty,
            ..._config?.extraMeta /* 扩展接口 */,
          };

          try {
            const result = isSync
              ? (validator as Validator)(meta)
              : await validator(meta);

            // 不同的验证返回类型处理
            if (isString(result)) errorTemplate = result;

            if (isErrorTemplateInterpolate(result)) {
              errorTemplate = result.errorTemplate;
              Object.assign(interpolateValues, result.interpolateValues);
            }

            if (isFunction(result)) errorTemplate = result(meta);
          } catch (err: any) {
            if (err.message) errorTemplate = err.message;
          }

          if (isString(errorTemplate) && !!errorTemplate.trim()) {
            rejectMeta.push({
              ...meta,
              message: interpolate(errorTemplate, interpolateValues),
            });

            currentPass = false;

            break;
          }
        }
      }

      const needBreak = !!(conf.verifyFirst && rejectMeta.length);

      if (needBreak) {
        if (isSync) {
          checkItemSyncCallback?.(needBreak);
          return null;
        } else {
          return needBreak;
        }
      }

      if (!currentPass) return;

      if (schema.schema?.length) {
        if (isSync) {
          checkSchemas(schema.schema, realNamePath).then();
        } else {
          await checkSchemas(schema.schema, realNamePath);
        }
      }

      if (schema.eachSchema) {
        let _schemas: Schema[] = [];

        if (isArray(value)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _schemas = value.map((_, index) => ({
            ...schema.eachSchema,
            name: index,
          }));
        }

        if (isObject(value)) {
          _schemas = Object.keys(value).map((key) => ({
            ...schema.eachSchema,
            name: key,
          }));
        }

        if (isSync) {
          checkSchemas(_schemas, realNamePath).then();
        } else {
          await checkSchemas(_schemas, realNamePath);
        }
      }
    }

    // 检测一组schema
    async function checkSchemas(_schemas: Schema[], parentNames: NamePath) {
      for (const schema of _schemas) {
        if (isSync) {
          let needBreak;
          checkSchema(schema, parentNames, (nb) => (needBreak = nb)).then();

          if (needBreak) break;
        } else {
          const needBreak = await checkSchema(schema, parentNames);
          if (needBreak) break;
        }
      }
    }

    if (isSync) {
      checkSchema(rootSchema, []).then();
    } else {
      await checkSchema(rootSchema, []);
    }

    const _rejectMeta = rejectMeta.length ? rejectMeta : null;

    if (isSync) {
      syncCallback?.(_rejectMeta);
      return null;
    }

    if (_rejectMeta) {
      throw _rejectMeta;
    }
  };

  const check: Verify["check"] = (...args) => {
    let rejectMeta: RejectMeta | null = null;
    baseCheck(args, (_rejectMeta) => (rejectMeta = _rejectMeta)).then();
    return rejectMeta;
  };

  const asyncCheck: Verify["asyncCheck"] = async (...args) => {
    try {
      await baseCheck(args);
    } catch (e) {
      if (isArray(e)) {
        throw new VerifyError(e);
      } else {
        throw new VerifyError([]);
      }
    }
  };

  return {
    check,
    asyncCheck,
  };
}
