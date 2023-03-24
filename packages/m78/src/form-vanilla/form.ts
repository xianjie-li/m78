import { _Context, FormConfig, FormInstance } from "./types.js";
import clone from "lodash/cloneDeep.js";
import { createVerify } from "@m78/verify";
import { _implEvent } from "./impl-event.js";
import { _implState } from "./impl-state.js";
import { _notifyFilter } from "./common.js";
import { _implValue } from "./impl-value.js";
import { _implSchema } from "./impl-schema.js";
import { _implAction } from "./impl-action.js";
import { _implList } from "./impl-list.js";

export function _createForm(config: FormConfig): FormInstance {
  const conf: FormConfig = {
    verifyFirst: false,
    autoVerify: true,
    ...config,
  };

  const instance: FormInstance = {
    verifyInstance: createVerify(conf),
    notifyFilter: _notifyFilter,
    getConfig: () => ({ ...conf }),
  } as any;

  const defaultValue = config.defaultValue || {};

  const ctx = {
    defaultValue: clone(defaultValue),
    values: clone(defaultValue),
    state: {},
    listState: {},
    instance,
    schema: config.schemas,
    config: conf,
    lockNotify: false,
    lockListState: false,
    isValueChangeTrigger: false,
  } as any as _Context;

  _implEvent(ctx);

  _implState(ctx);

  _implValue(ctx);

  _implSchema(ctx);

  _implAction(ctx);

  _implList(ctx);

  return instance;
}
