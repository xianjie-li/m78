import React from "react";
import {
  createForm as createVanillaForm,
  FormConfig as VanillaFormConfig,
} from "../form-vanilla/index.js";
import {
  _Context,
  _omitConfigs,
  FormConfig,
  FormInstance,
  FormLayoutType,
} from "./types.js";
import { createEvent } from "@m78/hooks";
import { _implField } from "./field.js";
import { omit } from "@m78/utils";
import { _implList } from "./list.js";

export const _createForm = (config: FormConfig) => {
  const conf: FormConfig = {
    layoutType: FormLayoutType.horizontal,
    schemas: {},
    ...omit(config, _omitConfigs as any),
  };

  const vForm = createVanillaForm({
    ...(conf as VanillaFormConfig),
    eventCreator: createEvent,
  });

  const form = vForm as FormInstance;

  const ctx: _Context = {
    config: conf,
    form: vForm as FormInstance,
    components: {
      ...config.components,
    },
  };

  form.getConfig = () => ({ ...conf });

  _implField(ctx);

  _implList(ctx);

  return vForm as FormInstance;
};
