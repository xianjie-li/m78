import { jsx as _jsx } from "react/jsx-runtime";
import { dumpFn, stringifyNamePath } from "@m78/utils";
import React, { useMemo } from "react";
import { useFn } from "@m78/hooks";
var ctx = /*#__PURE__*/ React.createContext({
    map: {},
    register: dumpFn,
    unregister: dumpFn
});
export function _useDetector(name) {
    var ctxValue = React.useContext(ctx);
    React.useEffect(function() {
        ctxValue.register(name);
        return function() {
            ctxValue.unregister(name);
        };
    }, [
        name
    ]);
}
export function _FieldDetector(param) {
    var onChange = param.onChange, children = param.children;
    var notify = useFn(function() {
        var ls = [];
        Object.keys(value.map).forEach(function(key) {
            var cur = value.map[key];
            if (cur) {
                ls.push(cur);
            }
        });
        onChange === null || onChange === void 0 ? void 0 : onChange(ls);
    });
    var value = useMemo(function() {
        return {
            map: {},
            register: function register(name) {
                var sName = stringifyNamePath(name);
                this.map[sName] = name;
                notify();
            },
            unregister: function unregister(name) {
                var sName = stringifyNamePath(name);
                delete this.map[sName];
                notify();
            }
        };
    }, []);
    return /*#__PURE__*/ _jsx(ctx.Provider, {
        value: value,
        children: children
    });
}
