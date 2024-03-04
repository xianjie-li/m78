import {
  _Context,
  FormConfig,
  FormInstance,
  FormVerifyInstance,
} from "./types.js";
import { _implEvent } from "./impl-event.js";
import { _implState } from "./impl-state.js";
import { _notifyFilter } from "./common.js";
import { _implValue } from "./impl-value.js";
import { _implSchema } from "./impl-schema.js";
import { _implAction } from "./impl-action.js";
import { _implList } from "./impl-list.js";
import { simplyDeepClone as clone, isTruthyOrZero } from "@m78/utils";
import _defaultsDeep from "lodash/defaultsDeep.js";
import en from "./language-pack/en.js";
import { _implSchemaCheck } from "./schema-check/impl-schema-check.js";
import { isArray } from "lodash";

/** 创建form实例 */
export function _createForm(config: FormConfig): FormInstance {
  return createMain(config, false)[0] as FormInstance;
}

/**
 * 创建verify实例, verify用于纯验证的场景, 在需要将form用于服务端或是仅需要验证功能的场景下非常有用, 能够避免form相关的多余计算
 *
 * > 用于创建verify实例时, 部分 FormConfig 会被忽略, 如 autoVerify
 * */
export function _createVerify(config: FormConfig): FormVerifyInstance {
  const [instance, ctx] = createMain(config, true);

  const withValues: FormVerifyInstance["withValues"] = (values, action) => {
    const backup = isTruthyOrZero(ctx.values) ? ctx.values : null;

    ctx.values = values;

    const res = action();

    ctx.values = backup;

    return res;
  };

  const check: FormVerifyInstance["check"] = (values, extraMeta) => {
    return withValues(values, () => {
      const [schemas, fmbValues] = ctx.getFormatterValuesAndSchema(values);

      return ctx.schemaCheck(fmbValues, schemas, extraMeta);
    });
  };

  return Object.assign(instance, {
    check,
    withValues,
    staticCheck: ctx.schemaCheck,
  });
}

// 创建FormInstance或FormVerifyInstance
function createMain(
  config: FormConfig,
  verifyOnly: boolean
): [FormInstance | FormVerifyInstance, _Context] {
  const conf: FormConfig = _defaultsDeep({}, config, {
    verifyFirst: false,
    languagePack: en,
    ignoreStrangeValue: true,
    autoVerify: !verifyOnly,
  });

  const instance: FormInstance = {
    getConfig: () => ({ ...conf }),
  } as any;

  const defaultValue = conf.values || {};

  const ctx = {
    defaultValue: verifyOnly ? defaultValue : clone(defaultValue),
    values: verifyOnly ? defaultValue : clone(defaultValue),
    state: {},
    listState: {},
    instance,
    schema: isArray(conf.schemas)
      ? {
          schemas: conf.schemas,
        }
      : conf.schemas,
    config: conf,
    lockNotify: false,
    lockListState: false,
    isValueChangeTrigger: false,
    verifyOnly,
  } as _Context;

  if (!verifyOnly) instance.notifyFilter = _notifyFilter;

  _implSchemaCheck(ctx);

  if (!verifyOnly) _implEvent(ctx);

  if (!verifyOnly) _implState(ctx);

  _implValue(ctx);

  _implSchema(ctx);

  if (!verifyOnly) _implAction(ctx);

  if (!verifyOnly) _implList(ctx);

  return [instance, ctx];
}
