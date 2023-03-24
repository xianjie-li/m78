import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import clone from "lodash/cloneDeep.js";
import { createVerify } from "@m78/verify";
import { _implEvent } from "./impl-event.js";
import { _implState } from "./impl-state.js";
import { _notifyFilter } from "./common.js";
import { _implValue } from "./impl-value.js";
import { _implSchema } from "./impl-schema.js";
import { _implAction } from "./impl-action.js";
import { _implList } from "./impl-list.js";
export function _createForm(config) {
    var conf = _object_spread({
        verifyFirst: false,
        autoVerify: true
    }, config);
    var instance = {
        verifyInstance: createVerify(conf),
        notifyFilter: _notifyFilter,
        getConfig: function() {
            return _object_spread({}, conf);
        }
    };
    var defaultValue = config.defaultValue || {};
    var ctx = {
        defaultValue: clone(defaultValue),
        values: clone(defaultValue),
        state: {},
        listState: {},
        instance: instance,
        schema: config.schemas,
        config: conf,
        lockNotify: false,
        lockListState: false,
        isValueChangeTrigger: false
    };
    _implEvent(ctx);
    _implState(ctx);
    _implValue(ctx);
    _implSchema(ctx);
    _implAction(ctx);
    _implList(ctx);
    return instance;
}
