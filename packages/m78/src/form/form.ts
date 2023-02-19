import { _Context, FormConfig, FormInstance } from "./types.js";
import clone from "lodash/cloneDeep.js";
import { createVerify } from "@m78/verify";
import { _implEvent } from "./impl-event.js";
import { _implState } from "./impl-state.js";
import { _notifyFilter } from "./common.js";
import { _implValue } from "./impl-value.js";
import { _implSchema } from "./impl-schema.js";
import { _implAction } from "./impl-action.js";

export function createForm(config: FormConfig): FormInstance {
  const conf: FormConfig = {
    verifyFirst: false,
    ...config,
  };

  const instance: FormInstance = {
    verifyInstance: createVerify(conf),
    notifyFilter: _notifyFilter,
  } as any;

  const ctx: _Context = {
    defaultValue: clone(config.defaultValue),
    values: clone(config.defaultValue),
    state: {},
    instance,
    schema: config.schema,
    config: conf,
    lockNotify: false,
    debounceVerify: (() => {}) as any,
    getSchemasAndInvalid: (() => {}) as any,
  };

  _implEvent(ctx);

  _implState(ctx);

  _implValue(ctx);

  _implSchema(ctx);

  _implAction(ctx);

  return instance;
}
