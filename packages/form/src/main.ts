import {
  _Context,
  FormConfig,
  FormInstance,
  FormVerify,
  FormVerifyInstance,
} from "./types.js";
import { _implEvent } from "./impl-event.js";
import { _implState } from "./impl-state.js";
import { _notifyFilter } from "./common.js";
import { _implValue } from "./impl-value.js";
import { _implSchema } from "./impl-schema.js";
import { _implAction } from "./impl-action.js";
import { _implList } from "./impl-list.js";
import deepClone from "lodash/cloneDeep.js";
import _defaultsDeep from "lodash/defaultsDeep.js";
import en from "./language-pack/en.js";
import { _implSchemaCheck } from "./schema-check/impl-schema-check.js";

/**
 * defaultValue -> value
 * verify移除
 * Verify类型更名 添加Form前缀
 * meta修改
 * 错误处理方式修改
 * 验证器key 私有化
 * */

/** 创建form实例 */
export function _createForm(config: FormConfig): FormInstance {
  return createMain(config, false)[0] as FormInstance;
}

/**
 * 创建verify实例, verify用于纯验证的场景, 在需要将form用于服务端或是仅需要验证功能的场景下非常有用, 在数据体量较大时能显著提升执行速度
 *
 * > 用于创建verify实例时, 部分 FormConfig 会被忽略, 如 autoVerify
 * */
export function _createVerify(config: FormConfig): FormVerify {
  const [instance, ctx] = createMain(config, true);

  const check: FormVerify["check"] = async (values, extraMeta) => {
    ctx.values = values;

    const pm = await ctx.schemaCheck(values, extraMeta);

    ctx.values = null;

    return pm;
  };

  return {
    check,
    getConfig: instance.getConfig,
  };
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

  const defaultValue = config.values || {};

  const ctx = {
    defaultValue: verifyOnly ? defaultValue : deepClone(defaultValue),
    values: verifyOnly ? defaultValue : deepClone(defaultValue),
    state: {},
    listState: {},
    instance,
    schema: config.schemas,
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
