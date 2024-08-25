import { useFn } from "@m78/hooks";
import { useEffect } from "react";
import { TableReloadLevel } from "../../table-vanilla/index.js";
import { notify } from "../../notify/index.js";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
// 将部分table实例事件直接暴露为props, 并对某些事件进行处理
export function _useEvent() {
    var _injector_useDeps = _injector.useDeps(_useStateAct), state = _injector_useDeps.state, setState = _injector_useDeps.setState;
    var props = _injector.useProps();
    var error = useFn(function(msg) {
        var _props_onError;
        (_props_onError = props.onError) === null || _props_onError === void 0 ? void 0 : _props_onError.call(props, msg);
        notify.warning(msg);
    });
    var click = useFn(function(cell, event) {
        var _props_onClick;
        (_props_onClick = props.onClick) === null || _props_onClick === void 0 ? void 0 : _props_onClick.call(props, cell, event);
    });
    var select = useFn(function() {
        var _props_onSelect;
        (_props_onSelect = props.onSelect) === null || _props_onSelect === void 0 ? void 0 : _props_onSelect.call(props);
        setState({
            selectedRows: state.instance.getSelectedRows()
        });
    });
    // 数据变更时, 重新计算行数等
    var dataChange = useFn(function() {
        var _state_vCtx;
        setState({
            rowCount: ((_state_vCtx = state.vCtx) === null || _state_vCtx === void 0 ? void 0 : _state_vCtx.allRowKeys.length) || 0
        });
    });
    var mutation = useFn(function(event) {
        var _props_onMutation;
        (_props_onMutation = props.onMutation) === null || _props_onMutation === void 0 ? void 0 : _props_onMutation.call(props, event);
        setState({
            renderID: Math.random()
        });
    });
    var reload = useFn(function(opt) {
        if (opt.level === TableReloadLevel.full || opt.level === TableReloadLevel.index) {
            dataChange();
        }
    });
    useEffect(function() {
        if (!state.instance) return;
        dataChange();
        state.instance.event.error.on(error);
        state.instance.event.click.on(click);
        state.instance.event.select.on(select);
        state.instance.event.mutation.on(mutation);
        state.instance.event.reload.on(reload);
        return function() {
            state.instance.event.error.off(error);
            state.instance.event.click.off(click);
            state.instance.event.select.off(select);
            state.instance.event.mutation.off(mutation);
            state.instance.event.reload.off(reload);
        };
    }, [
        state.instance
    ]);
}
