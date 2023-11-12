import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { useMemo, useRef } from "react";
import { createEvent, useSelf, useSetState } from "@m78/hooks";
import { _injector } from "../table.js";
import { preInstantiationRCPlugin } from "../common.js";
import { RCTablePlugin } from "../plugin.js";
import { isBoolean, isFunction } from "@m78/utils";
import { _FilterPlugin } from "../plugins/filter/filter.js";
import { _FeedBackPlugin } from "../plugins/feedback/feedback.js";
import { _RedoAndUndoPlugin } from "../plugins/redo-and-undo.js";
import { _CountTextPlugin } from "../plugins/count-text.js";
import { _XLSHandlePlugin } from "../plugins/xls-handle.js";
import { _DataActionPlugin } from "../plugins/data-actions.js";
export function _useStateAct() {
    var props = _injector.useProps();
    var getters = _injector.useGetter();
    /** 实例容器 */ var ref = useRef(null);
    /** 滚动容器 */ var scrollRef = useRef(null);
    /** 滚动内容 */ var scrollContRef = useRef(null);
    /** 最外层包裹容器 */ var wrapRef = useRef(null);
    var self = useSelf({
        renderMap: {},
        editMap: {},
        editStatusMap: {},
        editCheckForm: null,
        overlayStackCount: 0
    });
    var plugins = useMemo(function() {
        return preInstantiationRCPlugin([
            _FilterPlugin,
            _FeedBackPlugin,
            _RedoAndUndoPlugin,
            _CountTextPlugin,
            _XLSHandlePlugin,
            _DataActionPlugin, 
        ].concat(_to_consumable_array(props.plugins || [])));
    }, []);
    // 所有RCTablePlugin实例
    var rcPlugins = useMemo(function() {
        return plugins.filter(function(p) {
            return p instanceof RCTablePlugin;
        });
    }, []);
    var ref1 = _sliced_to_array(useSetState({
        selectedRows: [],
        rowCount: 0,
        instance: null
    }), 2), state = ref1[0], setState = ref1[1];
    var scrollEvent = useMemo(function() {
        return createEvent();
    }, []);
    // 同步getter到插件实例
    useMemo(function() {
        rcPlugins.forEach(function(p) {
            p.getDeps = getters.getDeps;
            p.getProps = getters.getProps;
        });
    }, [
        getters
    ]);
    var dataOperations = useMemo(function() {
        var conf = {
            edit: false,
            add: false,
            delete: false
        };
        var pConf = props.dataOperations;
        if (!pConf) return conf;
        if (isBoolean(pConf) && pConf) {
            conf.edit = true;
            conf.add = true;
            conf.delete = true;
            return conf;
        }
        conf.edit = isFunction(pConf.edit) ? pConf.edit : pConf.edit || false;
        conf.add = pConf.add || false;
        conf.delete = pConf.delete || false;
        return conf;
    }, [
        props.dataOperations
    ]);
    return {
        self: self,
        state: state,
        setState: setState,
        ref: ref,
        scrollRef: scrollRef,
        scrollContRef: scrollContRef,
        wrapRef: wrapRef,
        scrollEvent: scrollEvent,
        plugins: plugins,
        rcPlugins: rcPlugins,
        dataOperations: dataOperations
    };
}
