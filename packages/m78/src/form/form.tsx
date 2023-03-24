import {
  createForm as createVanillaForm,
  FormConfig as VanillaFormConfig,
  FormSchema as VanillaFormSchema,
} from "../form-vanilla/index.js";
import {
  _Context,
  _formPropsKeys,
  _omitConfigs,
  FormConfig,
  FormInstance,
  FormLayoutType,
} from "./types.js";
import { createEvent } from "@m78/hooks";
import { _fieldImpl } from "./field.js";
import { omit, pick } from "@m78/utils";
import { _listImpl } from "./list.js";
import { FORM_LANG_PACK_NS, i18n } from "../i18n/index.js";
import { _schemaRenderImpl } from "./schema-render.js";

export const _createForm = (config: FormConfig) => {
  // 目前以创建时语言为准, 不考虑做动态切换, 场景应该十分有限
  const languagePack = i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS);

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
    updatePropsEvent: createEvent(),
  };

  form.getConfig = () => ({ ...conf });

  form.updateProps = (props) => {
    const pickProps = pick(props, _formPropsKeys);

    Object.assign(conf, pickProps);

    ctx.updatePropsEvent.emit();
  };

  // 重写setSchemas, 确保内部能在更新后获取到最新的
  form.setSchemas = (schema) => {
    conf.schemas = schema;
    vForm.setSchemas(schema as VanillaFormSchema);
  };

  _fieldImpl(ctx);

  _listImpl(ctx);

  _schemaRenderImpl(ctx);

  return vForm as FormInstance;
};
