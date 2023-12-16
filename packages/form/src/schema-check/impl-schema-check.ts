// 静态schema验证相关逻辑
import {
  _Context,
  FormErrorTemplateType,
  FormRejectMeta,
  FormSchema,
  FormVerifyInstance,
  FormVerifyMeta,
  NamePath,
} from "../types.js";
import {
  AnyObject,
  ensureArray,
  getNamePathValue,
  interpolate,
  isArray,
  isFunction,
  isObject,
  isString,
  stringifyNamePath,
} from "@m78/utils";
import { _ROOT_SCHEMA_NAME } from "../common.js";
import { isVerifyEmpty } from "../validator/index.js";
import {
  _fmtValidator,
  _getExtraKeys,
  _isErrorTemplateInterpolate,
} from "./common.js";

export function _implSchemaCheck(ctx: _Context) {
  const { instance: _instance, config } = ctx;

  const instance = _instance as FormVerifyInstance;

  ctx.schemaCheck = async (values, extraMeta) => {
    const _rootSchema = instance.getSchemas();

    const rootSchema = {
      ..._rootSchema,
      name: _ROOT_SCHEMA_NAME,
    };

    // 验证器错误
    const rejectMeta: FormRejectMeta = [];

    // 为true时, 中断后续验证
    let needBreak = false;

    const getValueByName: FormVerifyMeta["getValueByName"] = (name) =>
      getNamePathValue(values, name);

    // 对一项schema执行检测, 返回true时可按需跳过后续schema的验证
    // 如果传入parentNames，会将当前项作为指向并将parentNames与当前name拼接
    async function checkSchema(schema: FormSchema, parentNames: NamePath) {
      const isRootSchema = schema.name === _ROOT_SCHEMA_NAME;

      const parentNamePath = ensureArray(parentNames);
      const namePath = [...parentNamePath, ...ensureArray(schema.name)];

      // 排除rootSchema的真实name
      const realNamePath = isRootSchema ? [] : namePath;

      let value = isRootSchema ? values : getValueByName(namePath);

      const name = stringifyNamePath(namePath);
      const label = schema.label || name;

      // 预转换值
      if (schema.transform) value = schema.transform(value);

      const isEmpty = isVerifyEmpty(value);

      const validators = _fmtValidator(schema.validator, isEmpty);

      // 基础插值对象
      const interpolateValues: AnyObject = {
        name,
        label,
        value,
        type: Object.prototype.toString.call(value),
      };

      // 当前schema是否通过验证, 未通过时其子级验证器不进行验证
      let currentPass = true;

      const meta: FormVerifyMeta = {
        name,
        namePath,
        label,
        value,
        values,
        schema,
        rootSchema,
        isEmpty,
        parentNamePath,
        getValueByName,
        config: config as any,
        ...extraMeta /* 扩展接口 */,
      };

      // 验证validators
      if (validators?.length) {
        for (const validator of validators) {
          let errorTemplate: FormErrorTemplateType = "";

          try {
            const result = await validator(meta);

            // 不同的验证返回类型处理
            if (isString(result)) errorTemplate = result;

            if (_isErrorTemplateInterpolate(result)) {
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

      // 处理StrangeValue
      if (!config.ignoreStrangeValue) {
        const extraKeys = _getExtraKeys(namePath, schema, value);

        if (extraKeys.length) {
          const template = config.languagePack!.commonMessage.strangeValue;

          extraKeys.forEach((nameKey) => {
            const msg = interpolate(template, { name: nameKey });

            rejectMeta.push({
              ...meta,
              message: msg,
            });
          });
        }
      }

      // 检测是否需要中断后续验证
      needBreak = !!(config.verifyFirst && rejectMeta.length);

      if (needBreak) return;

      // 未通过验证时不再进行子级验证
      if (!currentPass) return;

      if (schema.schema?.length) {
        await checkSchemas(schema.schema, realNamePath);
      }

      if (schema.eachSchema) {
        let _schemas: FormSchema[] = [];

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

        await checkSchemas(_schemas, realNamePath);
      }
    }

    // 检测一组schema
    async function checkSchemas(_schemas: FormSchema[], parentNames: NamePath) {
      for (const schema of _schemas) {
        await checkSchema(schema, parentNames);
        if (needBreak) break;
      }
    }

    await checkSchema(rootSchema, []);

    return rejectMeta.length ? rejectMeta : null;
  };
}
