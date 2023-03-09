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
import { i18n } from "../i18n/index.js";

export const _createForm = (config: FormConfig) => {
  // 目前以创建时语言为准, 不考虑做动态切换, 场景应该十分有限
  const languagePack = i18n.getResourceBundle(i18n.language, "form");

  const conf: FormConfig = {
    layoutType: FormLayoutType.horizontal,
    schemas: {},
    languagePack,
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
