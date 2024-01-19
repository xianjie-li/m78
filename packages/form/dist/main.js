import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _implEvent } from "./impl-event.js";
import { _implState } from "./impl-state.js";
import { _notifyFilter } from "./common.js";
import { _implValue } from "./impl-value.js";
import { _implSchema } from "./impl-schema.js";
import { _implAction } from "./impl-action.js";
import { _implList } from "./impl-list.js";
import { simplyDeepClone as clone } from "@m78/utils";
import _defaultsDeep from "lodash/defaultsDeep.js";
import en from "./language-pack/en.js";
import { _implSchemaCheck } from "./schema-check/impl-schema-check.js";
/** 创建form实例 */ export function _createForm(config) {
    return createMain(config, false)[0];
}
/**
 * 创建verify实例, verify用于纯验证的场景, 在需要将form用于服务端或是仅需要验证功能的场景下非常有用, 在数据体量较大时能显著提升执行速度
 *
 * > 用于创建verify实例时, 部分 FormConfig 会被忽略, 如 autoVerify
 * */ export function _createVerify(config) {
    var _createMain = _sliced_to_array(createMain(config, true), 2), instance = _createMain[0], ctx = _createMain[1];
    var check = function() {
        var _ref = _async_to_generator(function(values, extraMeta) {
            var _ctx_getFormatterValuesAndSchema, schemas, fmbValues, rt;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        ctx.values = values;
                        _ctx_getFormatterValuesAndSchema = _sliced_to_array(ctx.getFormatterValuesAndSchema(values), 2), schemas = _ctx_getFormatterValuesAndSchema[0], fmbValues = _ctx_getFormatterValuesAndSchema[1];
                        return [
                            4,
                            ctx.schemaCheck(fmbValues, schemas, extraMeta)
                        ];
                    case 1:
                        rt = _state.sent();
                        ctx.values = null;
                        return [
                            2,
                            rt
                        ];
                }
            });
        });
        return function check(values, extraMeta) {
            return _ref.apply(this, arguments);
        };
    }();
    return {
        check: check,
        getConfig: instance.getConfig
    };
}
// 创建FormInstance或FormVerifyInstance
function createMain(config, verifyOnly) {
    var conf = _defaultsDeep({}, config, {
        verifyFirst: false,
        languagePack: en,
        ignoreStrangeValue: true,
        autoVerify: !verifyOnly
    });
    var instance = {
        getConfig: function() {
            return _object_spread({}, conf);
        }
    };
    var defaultValue = config.values || {};
    var ctx = {
        defaultValue: verifyOnly ? defaultValue : clone(defaultValue),
        values: verifyOnly ? defaultValue : clone(defaultValue),
        state: {},
        listState: {},
        instance: instance,
        schema: config.schemas,
        config: conf,
        lockNotify: false,
        lockListState: false,
        isValueChangeTrigger: false,
        verifyOnly: verifyOnly
    };
    if (!verifyOnly) instance.notifyFilter = _notifyFilter;
    _implSchemaCheck(ctx);
    if (!verifyOnly) _implEvent(ctx);
    if (!verifyOnly) _implState(ctx);
    _implValue(ctx);
    _implSchema(ctx);
    if (!verifyOnly) _implAction(ctx);
    if (!verifyOnly) _implList(ctx);
    return [
        instance,
        ctx
    ];
}
