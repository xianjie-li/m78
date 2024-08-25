import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { useMemo, useRef } from "react";
import { createEvent, useSelf, useSetState } from "@m78/hooks";
import { _injector } from "../table.js";
import { preInstantiationRCPlugin } from "../common.js";
import { RCTablePlugin } from "../plugin.js";
import { isBoolean } from "@m78/utils";
import { _FilterPlugin } from "../plugins/filter/filter.js";
import { _FeedBackPlugin } from "../plugins/feedback/feedback.js";
import { _RedoAndUndoPlugin } from "../plugins/redo-and-undo.js";
import { _CountTextPlugin } from "../plugins/count-text.js";
import { _XLSHandlePlugin } from "../plugins/xls-handle.js";
import { _DataActionPlugin } from "../plugins/data-actions.js";
import { _ConfigSyncPlugin } from "../plugins/config-sync.js";
import { _DragMovePlugin } from "../plugins/drag-move.js";
import { _ContextMenuPlugin } from "../plugins/context-menu/context-menu.js";
export function _useStateAct() {
    var props = _injector.useProps();
    var getters = _injector.useGetter();
    /** 实例容器 */ var ref = useRef(null);
    /** 滚动容器 */ var scrollRef = useRef(null);
    /** 滚动内容 */ var scrollContRef = useRef(null);
    /** 最外层包裹容器 */ var wrapRef = useRef(null);
    var plugins = useMemo(function() {
        return preInstantiationRCPlugin([
            _FilterPlugin,
            _FeedBackPlugin,
            _RedoAndUndoPlugin,
            _DragMovePlugin,
            _CountTextPlugin,
            _ConfigSyncPlugin,
            _XLSHandlePlugin,
            _DataActionPlugin,
            _ContextMenuPlugin
        ].concat(_to_consumable_array(props.plugins || [])));
    }, []);
    // 所有RCTablePlugin实例
    var rcPlugins = useMemo(function() {
        return plugins.filter(function(p) {
            return _instanceof(p, RCTablePlugin);
        });
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
    var self = useSelf(useMemo(function() {
        var _self = {
            renderMap: {},
            editMap: {},
            editStatusMap: {},
            editCheckForm: null,
            overlayStackCount: 0,
            instance: null,
            vCtx: null
        };
        rcPlugins.forEach(function(p) {
            var _p_rcSelfInitializer;
            return (_p_rcSelfInitializer = p.rcSelfInitializer) === null || _p_rcSelfInitializer === void 0 ? void 0 : _p_rcSelfInitializer.call(p, _self);
        });
        return _self;
    }, []));
    var _useSetState = _sliced_to_array(useSetState(function() {
        var _state = {
            selectedRows: [],
            rowCount: 0,
            instance: null,
            vCtx: null,
            initializing: true,
            initializingTip: null,
            blockError: null
        };
        rcPlugins.forEach(function(p) {
            var _p_rcStateInitializer;
            return (_p_rcStateInitializer = p.rcStateInitializer) === null || _p_rcStateInitializer === void 0 ? void 0 : _p_rcStateInitializer.call(p, _state);
        });
        return _state;
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    var scrollEvent = useMemo(function() {
        return createEvent();
    }, []);
    var dataOperations = useMemo(function() {
        var conf = {
            edit: false,
            add: false,
            delete: false,
            sortRow: false,
            sortColumn: true,
            import: false,
            export: true
        };
        var pConf = props.dataOperations;
        if (isBoolean(pConf) && pConf) {
            Object.keys(conf).forEach(function(k) {
                return conf[k] = true;
            });
            return conf;
        }
        if (isBoolean(pConf) && !pConf) {
            conf.sortColumn = false;
            conf.export = false;
            return conf;
        }
        if (!pConf) return conf;
        return Object.assign(conf, pConf);
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
