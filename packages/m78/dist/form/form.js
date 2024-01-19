import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { createForm as createVanillaForm } from "@m78/form";
import { _formPropsKeys, _omitConfigs, FormLayoutType } from "./types.js";
import { createEvent } from "@m78/hooks";
import { _fieldImpl } from "./field.js";
import { omit, pick } from "@m78/utils";
import { _listImpl } from "./list.js";
import { FORM_LANG_PACK_NS, i18n } from "../i18n/index.js";
import { _schemaRenderImpl } from "./schema-render.js";
import { m78Config } from "../config/index.js";
export var _createForm = function(config) {
    // 目前以创建时语言为准, 不考虑做动态切换
    var languagePack = i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS);
    var conf = _object_spread({
        layoutType: FormLayoutType.horizontal,
        schemas: {},
        languagePack: languagePack
    }, omit(config, _omitConfigs));
    var vForm = createVanillaForm(_object_spread_props(_object_spread({}, conf), {
        eventCreator: createEvent
    }));
    var form = vForm;
    /* # # # # # # #  合并全局适配器/局部适配器 # # # # # # # */ // 以控件本身作为key
    var adaptorsMap = new Map();
    // 以字符串name作为索引
    var adaptorsNameMap = new Map();
    m78Config.get().formAdaptors.forEach(function(item) {
        adaptorsMap.set(item.element.type, item);
        if (item.name) adaptorsNameMap.set(item.name, item);
    });
    if (conf.adaptors) {
        conf.adaptors.forEach(function(item) {
            adaptorsMap.set(item.element.type, item);
            if (item.name) adaptorsNameMap.set(item.name, item);
        });
    }
    /* # # # # # # #  共享的上下文对象 # # # # # # # */ var ctx = {
        config: conf,
        form: vForm,
        adaptorsMap: adaptorsMap,
        adaptorsNameMap: adaptorsNameMap,
        updatePropsEvent: createEvent()
    };
    /* # # # # # # #  功能实现 # # # # # # # */ form.getConfig = function() {
        return _object_spread({}, conf);
    };
    form.updateProps = function(props) {
        var pickProps = pick(props, _formPropsKeys);
        Object.assign(conf, pickProps);
        ctx.updatePropsEvent.emit();
    };
    // 重写setSchemas, 确保内部能在schema更新后能立即获取到最新的
    if (!form.setSchemas) {
        form.setSchemas = function(schema) {
            conf.schemas = schema;
            vForm.setSchemas(schema);
        };
    }
    _fieldImpl(ctx);
    _listImpl(ctx);
    _schemaRenderImpl(ctx);
    return vForm;
};
