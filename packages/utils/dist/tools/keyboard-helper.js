import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { isFunction } from "../is.js";
import { getCmdKey, getCmdKeyStatus } from "../bom.js";
import { ensureArray } from "../array.js";
import { createUniqString } from "../string.js";
export var KeyboardHelperTriggerType;
(function(KeyboardHelperTriggerType) {
    KeyboardHelperTriggerType["down"] = "down";
    KeyboardHelperTriggerType["up"] = "up";
})(KeyboardHelperTriggerType || (KeyboardHelperTriggerType = {}));
export var KeyboardHelperModifier;
(function(KeyboardHelperModifier) {
    KeyboardHelperModifier["alt"] = "alt";
    KeyboardHelperModifier["ctrl"] = "ctrl";
    KeyboardHelperModifier["meta"] = "meta";
    KeyboardHelperModifier["shift"] = "shift";
    /** system key, determined by system, command on Mac and ctrl on Windows */ KeyboardHelperModifier["sysCmd"] = "sysCmd";
})(KeyboardHelperModifier || (KeyboardHelperModifier = {}));
/** global listener is bound, delay binding for ssr compatible */ var init = false;
/** all events. string is uniq key */ var events = [];
var eventMap = new Map();
/** special priority event count  */ var sortCount = 0;
var defaultOption = {
    enable: true,
    type: "down",
    priority: 0,
    overwrite: false,
    code: [],
    modifier: [],
    preventDefault: true
};
/** mapper KeyboardEvent.type to KeyboardTriggerType */ function typeMapper(type) {
    if (type === "keydown") return "down";
    if (type === "keyup") return "up";
    return "down";
}
/** dispatch events by a single event listener */ function initBind() {
    if (init || typeof document === "undefined") return;
    init = true;
    document.addEventListener("keydown", handle);
    document.addEventListener("keyup", handle);
}
function handle(e) {
    var revEvents = events.slice().reverse().map(function(key) {
        return eventMap.get(key);
    });
    if (sortCount) {
        revEvents.sort(function(a, b) {
            return (b.priority || 0) - (a.priority || 0);
        });
    }
    var event = {
        code: e.code,
        key: e.key,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        sysCmdKey: getCmdKeyStatus(e),
        repeat: e.repeat,
        isComposing: e.isComposing,
        type: typeMapper(e.type),
        nativeEvent: e
    };
    Object.freeze(event);
    var eventKey = event.code;
    var baseKey = eventKey;
    if (event.altKey) eventKey += "+alt";
    if (event.ctrlKey) eventKey += "+ctrl";
    if (event.metaKey) eventKey += "+meta";
    if (event.shiftKey) eventKey += "+shift";
    if (event.sysCmdKey) eventKey += "+sysCmd";
    // mark event triggered
    var triggerFlags = new Map();
    for(var i = 0; i < revEvents.length; i++){
        var opt = revEvents[i];
        if (!opt || opt.type !== event.type) continue;
        var code = ensureArray(opt.code);
        if (code.length && !code.includes(event.code)) continue;
        var modifier = ensureArray(opt.modifier);
        if (modifier.length) {
            var _obj;
            // all modifier key must be same
            var actualModifierStatus = (_obj = {}, _define_property(_obj, "alt", event.altKey), _define_property(_obj, "ctrl", event.ctrlKey), _define_property(_obj, "meta", event.metaKey), _define_property(_obj, "shift", event.shiftKey), _define_property(_obj, "sysCmd", event.sysCmdKey), _obj);
            var hasSysCmd = modifier.includes("sysCmd");
            var hasCtrl = modifier.includes("ctrl");
            var hasMeta = modifier.includes("meta");
            var hasAlt = modifier.includes("alt");
            var hasShift = modifier.includes("shift");
            var sysCmdKey = getCmdKey();
            var sysKeyIsCtrl = sysCmdKey === "ctrlKey";
            var sysKeyIsMeta = sysCmdKey === "metaKey";
            var _obj1;
            var optModifierStatus = (_obj1 = {}, _define_property(_obj1, "alt", hasAlt), _define_property(_obj1, "ctrl", sysKeyIsCtrl ? hasSysCmd || hasCtrl : hasCtrl), _define_property(_obj1, "meta", sysKeyIsMeta ? hasSysCmd || hasMeta : hasMeta), _define_property(_obj1, "shift", hasShift), _define_property(_obj1, "sysCmd", hasSysCmd), _obj1);
            var breakFlag = false;
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = Object.keys(optModifierStatus)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var key = _step.value;
                    if (optModifierStatus[key] !== actualModifierStatus[key]) {
                        breakFlag = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            if (breakFlag) continue;
        } else if (baseKey !== eventKey) {
            continue;
        }
        if (opt.enable === false) {
            continue;
        } else if (isFunction(opt.enable) && !opt.enable(event)) {
            continue;
        }
        if (opt.overwrite && triggerFlags.get(eventKey)) continue;
        var ret = opt.handle(event);
        if (ret === false) continue;
        if (opt.preventDefault) e.preventDefault();
        triggerFlags.set(eventKey, true);
    }
}
/** create helper */ export function createKeyboardHelper(option) {
    var key = createUniqString();
    events.push(key);
    update(option);
    initBind();
    function destroy() {
        var ind = events.indexOf(key);
        if (ind > -1) {
            events.splice(ind, 1);
        }
        var opt = eventMap.get(key);
        if (opt && opt.priority) {
            sortCount--;
        }
        eventMap.delete(key);
    }
    /** update event option */ function update(option) {
        var old = eventMap.get(key);
        // update
        if (old) {
            // update sortCount
            if (old.priority && !option.priority) {
                sortCount--;
            }
            eventMap.set(key, _object_spread({}, old, option));
            return;
        }
        // new
        if (option.priority) {
            sortCount++;
        }
        eventMap.set(key, _object_spread({}, defaultOption, option));
    }
    return {
        destroy: destroy,
        update: update,
        get option () {
            return eventMap.get(key);
        }
    };
}
/** create helper by multiple option */ export function createKeyboardHelpersBatch(options) {
    var helpers = options.map(function(opt) {
        return createKeyboardHelper(opt);
    });
    return {
        /** all helper instance */ helpers: helpers,
        /** destroy all helper */ destroy: function destroy() {
            helpers.forEach(function(i) {
                i.destroy();
            });
        },
        /** get all options */ get options () {
            return helpers.map(function(i) {
                return i.option;
            });
        }
    };
}
