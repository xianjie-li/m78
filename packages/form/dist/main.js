import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
 * */ /** 创建form实例 */ export function _createForm(config) {
    return createMain(config, false)[0];
}
/**
 * 创建verify实例, verify用于纯验证的场景, 在需要将form用于服务端或是仅需要验证功能的场景下非常有用, 在数据体量较大时能显著提升执行速度
 *
 * > 用于创建verify实例时, 部分 FormConfig 会被忽略, 如 autoVerify
 * */ export function _createVerify(config) {
    var ref = _sliced_to_array(createMain(config, true), 2), instance = ref[0], ctx = ref[1];
    var check = function() {
        var _ref = _async_to_generator(function(values, extraMeta) {
            var pm;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        ctx.values = values;
                        return [
                            4,
                            ctx.schemaCheck(values, extraMeta)
                        ];
                    case 1:
                        pm = _state.sent();
                        ctx.values = null;
                        return [
                            2,
                            pm
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
        defaultValue: verifyOnly ? defaultValue : deepClone(defaultValue),
        values: verifyOnly ? defaultValue : deepClone(defaultValue),
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
