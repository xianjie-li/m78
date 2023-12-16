import {
  createForm as createVanillaForm,
  FormConfig as VanillaFormConfig,
  FormSchema as VanillaFormSchema,
} from "@m78/form";
import {
  _FormContext,
  _formPropsKeys,
  _omitConfigs,
  FormAdaptorsItem,
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
import { m78Config } from "../config/index.js";

export const _createForm = (config: FormConfig) => {
  // 目前以创建时语言为准, 不考虑做动态切换
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

  /* # # # # # # #  合并全局适配器/局部适配器 # # # # # # # */

  // 以控件本身作为key
  const adaptorsMap = new Map<any, FormAdaptorsItem>();
  // 以字符串name作为索引
  const adaptorsNameMap = new Map<string, FormAdaptorsItem>();

  m78Config.get().formAdaptors.forEach((item) => {
    adaptorsMap.set(item.element.type, item);
    if (item.name) adaptorsNameMap.set(item.name, item);
  });

  if (conf.adaptors) {
    conf.adaptors.forEach((item) => {
      adaptorsMap.set(item.element.type, item);
      if (item.name) adaptorsNameMap.set(item.name, item);
    });
  }

  /* # # # # # # #  共享的上下文对象 # # # # # # # */

  const ctx: _FormContext = {
    config: conf,
    form: vForm as FormInstance,
    adaptorsMap,
    adaptorsNameMap,
    updatePropsEvent: createEvent(),
  };

  /* # # # # # # #  功能实现 # # # # # # # */

  form.getConfig = () => ({ ...conf });

  form.updateProps = (props) => {
    const pickProps = pick(props, _formPropsKeys);

    Object.assign(conf, pickProps);

    ctx.updatePropsEvent.emit();
  };

  // 重写setSchemas, 确保内部能在schema更新后能立即获取到最新的
  if (!form.setSchemas) {
    form.setSchemas = (schema) => {
      conf.schemas = schema;
      vForm.setSchemas(schema as VanillaFormSchema);
    };
  }

  _fieldImpl(ctx);

  _listImpl(ctx);

  _schemaRenderImpl(ctx);

  return vForm as FormInstance;
};
