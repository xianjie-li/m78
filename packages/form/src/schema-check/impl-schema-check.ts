// 静态schema验证相关逻辑
import {
  _Context,
  FormErrorTemplateType,
  FormRejectMeta,
  FormSchema,
  FormSchemaWithoutName,
  FormVerifyMeta,
  NamePath,
} from "../types.js";
import {
  AnyObject,
  getNamePathValue,
  interpolate,
  isFunction,
  isString,
  NameItem,
  stringifyNamePath,
} from "@m78/utils";
import { isVerifyEmpty } from "../validator/index.js";
import {
  _fmtValidator,
  _getExtraKeys,
  _isErrorTemplateInterpolate,
} from "./common.js";
import { _ROOT_SCHEMA_NAME } from "../common.js";

export function _implSchemaCheck(ctx: _Context) {
  const { config } = ctx;

  ctx.schemaCheck = async (values, rootSchema, extraMeta) => {
    // 验证器错误
    const rejectMeta: FormRejectMeta = [];

    // 为true时, 中断后续验证
    let needBreak = false;

    const getValueByName: FormVerifyMeta["getValueByName"] = (name) =>
      getNamePathValue(values, name);

    // 对一项schema执行检测, 返回true时可按需跳过后续schema的验证
    // 如果传入parentNames，会将当前项作为指向并将parentNames与当前name拼接
    async function checkSchema(
      _schema: FormSchema | FormSchemaWithoutName,
      parentNamePath: NameItem[],
      isRootSchema?: boolean
    ) {
      if (!isRootSchema && !("name" in _schema)) return;

      const schema = _schema as FormSchema;

      const namePath: NamePath = isRootSchema
        ? []
        : [...parentNamePath, schema.name];

      let value = isRootSchema ? values : getValueByName(namePath);

      const nameStr = isRootSchema
        ? _ROOT_SCHEMA_NAME
        : stringifyNamePath(namePath);
      const label = schema.label || nameStr;

      // 预转换值
      if (schema.transform) value = schema.transform(value);

      const isEmpty = isVerifyEmpty(value);

      const validators = _fmtValidator(schema.validator, isEmpty);

      // 基础插值对象
      const interpolateValues: AnyObject = {
        name: nameStr,
        label,
        value,
        type: Object.prototype.toString.call(value),
      };

      // 当前schema是否通过验证, 未通过时其子级验证器不进行验证
      let currentPass = true;

      const meta: FormVerifyMeta = {
        name: nameStr,
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
        await checkSchemas(schema.schema, namePath.slice());
      }

      // 经过schemaSpecialPropsHandle处理后, schema不会有eachSchema
      // if (schema.eachSchema) {}
    }

    // 检测一组schema
    async function checkSchemas(
      _schemas: FormSchema[],
      parentNames: NameItem[]
    ) {
      for (const schema of _schemas) {
        await checkSchema(schema, parentNames);
        if (needBreak) break;
      }
    }

    await checkSchema(rootSchema, [], true);

    const rm = rejectMeta.length ? rejectMeta : null;

    return [rm, values];
  };
}
